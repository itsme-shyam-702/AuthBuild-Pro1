const express    = require("express");
const router     = express.Router();
const { authMiddleware, roleGuard } = require("../middlewares/auth");
const User       = require("../models/User");
const { asyncWrapper } = require("../utils/AppError");

// GET /api/users/profile — any authenticated user
router.get(
  "/profile",
  authMiddleware,
  asyncWrapper(async (req, res) => {
    const user = await User.findById(req.user.userId).select("-refreshTokens");
    res.json({ user });
  })
);

// GET /api/users/admin — admin role only
router.get(
  "/admin",
  authMiddleware,
  roleGuard("admin"),
  (req, res) => {
    res.json({ message: "Welcome, admin!", userId: req.user.userId });
  }
);

module.exports = router;
