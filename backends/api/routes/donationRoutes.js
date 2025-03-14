const express = require("express");
const {
  donateBook,
  getDonations,
  getDonationById,
  deleteDonation,
} = require("../controllers/donationController");
const {
  authenticateUser,
  donationverify,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/donate", authenticateUser, donateBook);
router.get("/alldonations", donationverify, getDonations);
router.get("/donation/:id", authenticateUser, getDonationById);
router.delete("/donation/:id", authenticateUser, deleteDonation);

module.exports = router;
