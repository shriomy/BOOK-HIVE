const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Route to get all books
router.get("/", bookController.getBooks);

// Route to get a single book by ID
router.get("/:id", bookController.getBookById);

// New route to serve book images
router.get("/:id/image", bookController.getBookImage);

// Other book-related routes...

module.exports = router;
