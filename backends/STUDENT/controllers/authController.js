const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendVerificationEmail } = require("../services/emailService");
const { sendWelcomeEmail } = require("../services/welcomeMessageService");

exports.registerUser = async (req, res) => {
  const { name, email, password, idnumber } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "ID card image is required." });
  }

  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userDoc = await User.create({
      name,
      email,
      idnumber,
      password: hashedPassword,
      idcard: { data: file.buffer, contentType: file.mimetype },
      otp,
      otpExpiration,
      isVerified: false,
    });

    await sendVerificationEmail(email, otp);

    res.status(201).json({
      message: "A verification OTP has been sent to your email.",
      userId: userDoc._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    if (new Date() > user.otpExpiration) {
      await User.deleteOne({ _id: userId });
      return res.status(400).json({ message: "OTP expired. User deleted." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    await sendWelcomeEmail(user.email);

    res.json({ message: "Email verified successfully! Welcome email sent." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", token, { httpOnly: true })
      .json({ token, user: userDoc });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email _id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/authController.js

exports.logoutUser = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Delete a user account
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
