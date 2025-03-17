const express = require("express");
const { getBooks, getBookById } = require("../controllers/bookController");

const router = express.Router();

// Route to get all books
router.get("/", getBooks);

// Route to get a single book by ID
router.get("/:id", getBookById);

module.exports = router;
