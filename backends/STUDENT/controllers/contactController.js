// controllers/contactController.js
const Contact = require("../models/Contact");

// Controller to save the contact form data
exports.saveContactForm = async (req, res) => {
  try {
    const {
      name,
      studentNumber,
      email,
      phone,
      faculty,
      specialisation,
      message,
    } = req.body;

    // Create a new contact form document
    const newContact = new Contact({
      name,
      studentNumber,
      email,
      phone,
      faculty,
      specialisation,
      message,
    });

    // Save to the database
    await newContact.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error saving contact form:", error);
    res.status(500).json({
      message: "Failed to save your message. Please try again later.",
    });
  }
};
