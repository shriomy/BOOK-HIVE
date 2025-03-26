const express = require("express");
const multer = require("multer");
const {
  registerUser,
  verifyOtp,
  loginUser,
  getProfile,
  logoutUser,
  deleteUser,
  uploadProfilePicture,
  getProfilePicture,
} = require("../controllers/authController");
const { authMiddleware, deleteauth } = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer();

router.post("/register", upload.single("idcard"), registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logoutUser);
router.delete("/users/:id", deleteauth, deleteUser);
router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.get("/profile-picture", authMiddleware, getProfilePicture);

module.exports = router;
