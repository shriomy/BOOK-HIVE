const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itNumber: { type: String, required: true },
  email: { type: String, required: true }, // Added email field
  faculty: { type: String, required: true },
  specialisation: { type: String, required: true },
  mobile: { type: String, required: true },
  message: { type: String, default: "" },
  donerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now }, // Auto-set if not provided
  replied: { type: Boolean, default: false }, // New field with default value
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
