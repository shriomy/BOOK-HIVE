// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// POST route to handle contact form submission
router.post("/submit", contactController.saveContactForm);

module.exports = router;
