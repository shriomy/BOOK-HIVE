const express = require("express");
const {
  getAllDonations,
  updateDonationStatus,
  deleteDonation,
} = require("../controllers/donationController");

const router = express.Router();

// Route to get all donations
router.get("/donations", getAllDonations);

// Route to update donation status
router.put("/:donationId/status", updateDonationStatus);

// Route to delete a donation
router.delete("/:donationId", deleteDonation);

module.exports = router;
