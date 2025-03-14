const Donation = require("../models/Donation");

exports.donateBook = async (req, res) => {
  try {
    const {
      bookTitle,
      author,
      genre,
      condition,
      donorName,
      donorContact,
      message,
    } = req.body;

    // Trim values to prevent issues caused by extra spaces
    if (
      !bookTitle?.trim() ||
      !author?.trim() ||
      !genre?.trim() ||
      !condition?.trim() ||
      !donorName?.trim() ||
      !donorContact?.trim()
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    const newDonation = new Donation({
      bookTitle: bookTitle.trim(),
      author: author.trim(),
      genre: genre.trim(),
      condition: condition.trim(),
      donorName: donorName.trim(),
      donorContact: donorContact.trim(),
      message: message?.trim() || "", // Message is optional
      donorId: req.userId, // Link donation to signed-in user
      verified: false, // Default value for verification
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation recorded successfully!" });
  } catch (error) {
    console.error("Donation Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

exports.getDonations = async (req, res) => {
  try {
    let donations;

    if (req.isAdmin) {
      donations = await Donation.find();
    } else {
      donations = await Donation.find({ donorId: req.user.id });
    }

    if (donations.length === 0) {
      return res.status(404).json({ message: "No donations found." });
    }

    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

// Fetch donation details by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json(donation);
  } catch (error) {
    console.error("Error fetching donation by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a donation by ID (Only for unverified donations or admins)
exports.deleteDonation = async (req, res) => {
  try {
    const donationId = req.params.id;

    // Fetch the donation by ID
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Check if the donation is verified
    if (donation.verified) {
      return res.status(403).json({
        message: "Cannot delete a verified donation",
      });
    }

    // Allow deletion if the user is the donor or an admin
    if (donation.donorId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this donation",
      });
    }

    // Delete the donation
    await Donation.findByIdAndDelete(donationId);

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Please try again later." });
  }
};
