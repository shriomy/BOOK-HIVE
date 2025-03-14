const express = require("express");
const multer = require("multer");
const {
  registerUser,
  verifyOtp,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer();

router.post("/register", upload.single("idcard"), registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
