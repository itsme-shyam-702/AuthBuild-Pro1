const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/AppError");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Authorization token required", 401));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    next(err); // TokenExpiredError or JsonWebTokenError → global handler in server.js
  }
}

function roleGuard(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError("Access denied — insufficient role", 403));
    }
    next();
  };
}

module.exports = { authMiddleware, roleGuard };
