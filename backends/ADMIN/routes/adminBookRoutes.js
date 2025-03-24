const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookCover,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/adminBookController");

router.get("/", getBooks); // Fetch all books
router.get("/:id/cover", getBookCover); // Fetch book cover by ID
router.post("/", addBook); // Add a new book
router.put("/:id", updateBook); // Update an existing book
router.delete("/:id", deleteBook); // Delete a book

module.exports = router;
