const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Donation = require("./models/Donation");
const Book = require("./models/Book"); // Adjust the path if needed

// Import email services
const { sendVerificationEmail } = require("./services/emailService"); // For OTP
const { sendWelcomeEmail } = require("./services/welcomeMessageService"); // For Welcome Email with QR Code

const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const questionRoutes = require("./routes/questionRoutes");
const contactRoutes = require("./routes/contactRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const borrowedRoutes = require("./routes/borrowedRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const bcryptSalt = bcrypt.genSaltSync(10);
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const multer = require("multer");
const upload = multer();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Update this with the appropriate frontend URL
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

// Modify the /register route to handle file uploads and send OTP verification email
const crypto = require("crypto");

app.use("/api/auth", authRoutes);

app.use("/api/donations", donationRoutes);

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.use("/api/books", bookRoutes);
// Backend route for deleting a review
app.use("/api/reviews", reviewRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/contacts", contactRoutes);

// In your main server.js or app.js file

app.use(borrowRoutes);
app.use("/api/borrowings", borrowedRoutes);

app.use("/api", teacherRoutes);

// API route for an admin to verify a donation
/*app.patch("/donations/:id/verify", authenticateUser, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized. Admins only." });
    }

    const donationId = req.params.id;
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found." });
    }

    // Mark the donation as verified
    donation.verified = true;
    await donation.save();

    res.status(200).json({ message: "Donation verified successfully!" });
  } catch (error) {
    console.error("Error verifying donation:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});*/

app.listen(4000);
