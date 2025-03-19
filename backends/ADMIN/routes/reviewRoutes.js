// This goes in your API routes file (e.g., routes/reviews.js)
const express = require("express");
const Book = require("../models/AdminBookModel"); // Adjust path as needed
const router = express.Router();

// GET all reviews across all books
router.get("/api/reviews", async (req, res) => {
  try {
    console.log("Fetching all books...");
    const books = await Book.find({});
    console.log(`Found ${books.length} books`);

    // Transform the data structure to match frontend expectations
    const allReviews = [];

    books.forEach((book) => {
      console.log(
        `Processing book: ${book.title} with ${
          book.reviews ? book.reviews.length : 0
        } reviews`
      );
      if (book.reviews && book.reviews.length > 0) {
        const bookReviews = book.reviews.map((review) => ({
          reviewId: review._id ? review._id.toString() : "unknown",
          bookId: book._id ? book._id.toString() : "unknown",
          title: book.title || "Unknown Title",
          reviewer: review.reviewer || "Anonymous",
          date: review.date || new Date(),
          reviewText: review.reviewText || "No review text",
        }));

        allReviews.push(...bookReviews);
      }
    });

    console.log(`Returning ${allReviews.length} total reviews`);
    res.json(allReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      message: "Server error fetching reviews",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// DELETE a specific review
router.delete("/api/:bookId/review/:reviewId", async (req, res) => {
  try {
    const { bookId, reviewId } = req.params;
    console.log(`Attempting to delete review ${reviewId} from book ${bookId}`);

    // Find the book and pull the specific review from the reviews array
    const result = await Book.findByIdAndUpdate(
      bookId,
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );

    if (!result) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book not found" });
    }

    console.log("Review deleted successfully");
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      message: "Server error deleting review",
      error: error.message,
    });
  }
});

module.exports = router;
