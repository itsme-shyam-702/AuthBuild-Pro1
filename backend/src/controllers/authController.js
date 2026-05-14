const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const { z }   = require("zod");
const { OAuth2Client } = require("google-auth-library");

const User    = require("../models/User");
const { AppError, asyncWrapper } = require("../utils/AppError");
const { signPair } = require("../utils/tokens");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerSchema = z.object({
  email:    z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email:    z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// ── REGISTER ─────────────────────────────────────────────────
const register = asyncWrapper(async (req, res) => {
  const { email, password } = registerSchema.parse(req.body);

  const exists = await User.exists({ email });
  if (exists) throw new AppError("Email already registered", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  const { accessToken, refreshToken } = signPair({ userId: user._id, role: user.role });
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.status(201).json({
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

// ── LOGIN ─────────────────────────────────────────────────────
const login = asyncWrapper(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  // Must explicitly select both fields — both are select:false on the schema
  const user = await User.findOne({ email }).select("+passwordHash +refreshTokens");
  if (!user) throw new AppError("Invalid email or password", 401);

  if (!user.passwordHash) throw new AppError("This account uses Google sign-in", 400);

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const { accessToken, refreshToken } = signPair({ userId: user._id, role: user.role });
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

// ── REFRESH ───────────────────────────────────────────────────
const refresh = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError("Refresh token required", 401);

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // Find by decoded.userId — NOT by the token string itself
  const user = await User.findById(decoded.userId).select("+refreshTokens");
  if (!user) throw new AppError("User not found", 401);

  if (!user.refreshTokens.includes(refreshToken)) {
    // Reuse detected — nuke all sessions as security response
    user.refreshTokens = [];
    await user.save();
    throw new AppError("Refresh token already used — all sessions cleared", 401);
  }

  // Rotate: remove old, issue new pair
  user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
  const newPair = signPair({ userId: user._id, role: user.role });
  user.refreshTokens.push(newPair.refreshToken);
  await user.save();

  res.json({
    accessToken:  newPair.accessToken,
    refreshToken: newPair.refreshToken,
  });
});

// ── LOGOUT ────────────────────────────────────────────────────
const logout = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Not authenticated", 401);

  if (refreshToken) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
  }

  res.sendStatus(204);
});

// ── GOOGLE OAUTH ──────────────────────────────────────────────
const googleAuth = asyncWrapper(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) throw new AppError("Google ID token required", 400);

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError("Invalid Google token", 401);
  }

  const { sub: googleId, email } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] }).select("+refreshTokens");

  if (!user) {
    user = await User.create({ email, googleId });
  } else if (!user.googleId) {
    user.googleId = googleId;
    await user.save();
  }

  const { accessToken, refreshToken } = signPair({ userId: user._id, role: user.role });
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

module.exports = { register, login, refresh, logout, googleAuth };
