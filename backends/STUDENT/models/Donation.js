const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  bookTitle: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  condition: { type: String, required: true },
  donorName: { type: String, required: true },
  donorContact: { type: String, required: true },
  message: { type: String, default: "" },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  verified: {
    type: Boolean,
    default: false, // Set to false by default, to indicate that the donation is not verified
  },
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
