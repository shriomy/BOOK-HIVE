const User = require("../models/UserModel");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpiration"); // Exclude sensitive fields
    res.json(users); // Send the data as JSON
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserIdCard = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set content type and send image data
    res.contentType(user.idcard.contentType); // Set the correct content type (image/jpeg, image/png, etc.)
    res.send(user.idcard.data); // Send image buffer data
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ID card", error: error.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user and check if exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Return success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
exports.getUserProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If no profile picture exists
    if (!user.profilePicture || !user.profilePicture.data) {
      return res.status(404).json({ message: "No profile picture found" });
    }

    // Set content type and send image data
    res.contentType(user.profilePicture.contentType);
    res.send(user.profilePicture.data);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching profile picture",
        error: error.message,
      });
  }
};
