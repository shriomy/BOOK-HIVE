const express = require("express");
const {
  submitContact,
  getContacts,
  getContactById,
} = require("../controllers/contactController");
const {
  authenticateUser,
  donationverify,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/submit", authenticateUser, submitContact);
router.get("/allcontacts", donationverify, getContacts);
//router.get("/contact/:id", authenticateUser, getContactById);

module.exports = router;
