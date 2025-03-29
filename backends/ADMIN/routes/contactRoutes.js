// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Get all contacts
router.get("/contacts", contactController.getAllContacts);

// Get a single contact by ID
router.get("/contacts/:id", contactController.getContactById);

// Reply to a contact
router.post("/contacts/:id/reply", contactController.replyToContact);

module.exports = router;
