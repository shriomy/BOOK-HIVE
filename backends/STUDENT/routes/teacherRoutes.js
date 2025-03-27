const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Route to get all teachers
router.get("/teachers", async (req, res) => {
  try {
    // Find all users with the role 'teacher'
    const teachers = await User.find({ role: "teacher" })
      .select("-password") // Exclude password field for security
      .select("-idcard") // Exclude ID card data
      .select("-profilePicture"); // Exclude profile picture data

    // Check if any teachers are found
    if (teachers.length === 0) {
      return res.status(404).json({
        message: "No teachers found",
        teachers: [],
        count: 0,
      });
    }

    // Return the list of teachers
    res.status(200).json({
      count: teachers.length,
      teachers: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      message: "Server error while fetching teachers",
      error: error.message,
      teachers: [],
      count: 0,
    });
  }
});

module.exports = router;
