const express = require("express");
const {
  submitContact,
  getContacts,
  getContactById,
  deleteContact,
  updateContactMessage,
} = require("../controllers/contactController");
const {
  authenticateUser,
  donationverify,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/submit", authenticateUser, submitContact);
router.get("/allcontacts", donationverify, getContacts);
router.get("/contact/:id", authenticateUser, getContactById);
router.delete("/contact/:id", authenticateUser, deleteContact);
router.patch("/contact/:id", authenticateUser, updateContactMessage);

module.exports = router;
