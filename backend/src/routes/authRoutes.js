// const express = require("express");
// const router  = express.Router();

// // Import all controller functions
// const { register, login, refresh, logout, googleAuth } =
//   require("../controllers/authController");

// // POST /api/auth/register
// router.post("/register", register);

// // POST /api/auth/login
// router.post("/login", login);

// // POST /api/auth/refresh   — send { refreshToken } in body
// router.post("/refresh", refresh);

// // POST /api/auth/logout    — Bearer token + { refreshToken } in body
// router.post("/logout", logout);

// // POST /api/auth/google    — send { idToken } from Google sign-in
// router.post("/google", googleAuth);

// module.exports = router;


// // // src/controllers/authController.js

// // // REGISTER
// // const register = async (req, res) => {
// //   try {
// //     res.status(201).json({
// //       success: true,
// //       message: "User registered successfully",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // LOGIN
// // const login = async (req, res) => {
// //   try {
// //     res.status(200).json({
// //       success: true,
// //       message: "Login successful",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // REFRESH TOKEN
// // const refresh = async (req, res) => {
// //   try {
// //     res.status(200).json({
// //       success: true,
// //       message: "Token refreshed",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // LOGOUT
// // const logout = async (req, res) => {
// //   try {
// //     res.status(200).json({
// //       success: true,
// //       message: "Logout successful",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // GOOGLE AUTH
// // const googleAuth = async (req, res) => {
// //   try {
// //     res.status(200).json({
// //       success: true,
// //       message: "Google auth successful",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // EXPORTS
// // module.exports = {
// //   register,
// //   login,
// //   refresh,
// //   logout,
// //   googleAuth,
// // };





const express = require("express");
const router  = express.Router();

const { register, login, refresh, logout, googleAuth } =
  require("../controllers/authController");

router.post("/register", register);
router.post("/login",    login);
router.post("/refresh",  refresh);
router.post("/logout",   logout);
router.post("/google",   googleAuth);

module.exports = router;
