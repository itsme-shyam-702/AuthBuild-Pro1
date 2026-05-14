const jwt = require("jsonwebtoken");

function signPair(payload) {
  const accessToken  = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET,      { expiresIn: "7d"  });
  return { accessToken, refreshToken };
}

module.exports = { signPair };
