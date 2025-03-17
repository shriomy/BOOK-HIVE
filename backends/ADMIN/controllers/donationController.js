const Donation = require("../models/DonationModel");

// Controller function to fetch all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("donorId", "name email"); // Populating donorId with user info
    res.status(200).json(donations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve donations", error: err });
  }
};

// Update donation status (Accept or Decline)
exports.updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { verified } = req.body;

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      { verified },
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res
      .status(200)
      .json({ message: "Donation status updated", updatedDonation });
  } catch (error) {
    res.status(500).json({ message: "Error updating donation status", error });
  }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
  try {
    const { donationId } = req.params;

    const deletedDonation = await Donation.findByIdAndDelete(donationId);

    if (!deletedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting donation", error });
  }
};
