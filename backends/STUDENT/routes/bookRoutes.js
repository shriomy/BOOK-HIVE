const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const recomendController = require("../controllers/recomendController");

// Route to get all books
router.get("/", bookController.getBooks);

// Route to get a single book by ID
router.get("/:id", bookController.getBookById);

// New route to serve book images
router.get("/:id/image", bookController.getBookImage);

// Other book-related routes...
router.get("/stats/most-borrowed", recomendController.getMostBorrowedBooks);
router.get(
  "/stats/most-borrowed-sse",
  recomendController.getMostBorrowedBooksSSE
);

module.exports = router;
