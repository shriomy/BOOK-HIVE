const express = require("express");
const router = express.Router();
const { getUserBorrowings } = require("../controllers/borrowedBooksController");
const { donationverify } = require("../middlewares/authMiddleware");

// Route to get user-specific borrowings
router.get("/myborrowings", donationverify, getUserBorrowings);

module.exports = router;
