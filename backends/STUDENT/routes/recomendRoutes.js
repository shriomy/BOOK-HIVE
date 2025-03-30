const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // Adjust path as needed
/**
 * GET /api/books/most-available
 * Returns books sorted by availability (highest bookCount first)
 * @param {number} limit - Optional query parameter to limit results (default: 10)
 */
router.get("/most-available", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    // Add more detailed logging for debugging
    console.log(`Fetching most available books with limit: ${limit}`);

    // First, check if the Book model and connection are working
    if (!Book) {
      throw new Error("Book model is undefined");
    }

    // Find all available books, sort by bookCount in descending order
    // Simplify the query first to identify issues
    const mostAvailableBooks = await Book.find()
      .sort({ bookCount: -1 })
      .limit(limit)
      .lean(); // Using lean() for better performance and to return plain JS objects

    console.log(`Found ${mostAvailableBooks.length} books`);

    // Safely transform the data to handle potential missing fields
    const booksWithRatings = mostAvailableBooks.map((book) => {
      try {
        // Safely access nested properties
        const reviews = book.reviews || [];
        const totalReviews = Array.isArray(reviews) ? reviews.length : 0;

        // Handle bookImage safely
        let bookImageData = null;
        if (book.bookImage && book.bookImage.data) {
          try {
            bookImageData = book.bookImage.data.toString("base64");
          } catch (imgError) {
            console.error("Error converting image data:", imgError);
            bookImageData = null;
          }
        }

        return {
          _id: book._id,
          title: book.title || "Untitled",
          author: book.author || "Unknown Author",
          genre: book.genre || "Uncategorized",
          category: book.category || "Uncategorized",
          bookCount: book.bookCount || 0,
          totalReviews,
          bookImage: book.bookImage
            ? {
                contentType: book.bookImage.contentType || "image/jpeg",
                data: bookImageData,
              }
            : null,
        };
      } catch (bookError) {
        console.error("Error processing book:", bookError, book);
        // Return a minimal valid book object if processing fails
        return {
          _id: book._id || "unknown-id",
          title: "Error Processing Book",
          author: "Unknown",
          genre: "Unknown",
          category: "Unknown",
          bookCount: 0,
          totalReviews: 0,
          bookImage: null,
        };
      }
    });

    res.status(200).json({
      success: true,
      count: booksWithRatings.length,
      data: booksWithRatings,
    });
  } catch (error) {
    console.error("Error fetching most available books:", error);
    // Provide more detailed error information
    res.status(500).json({
      success: false,
      message: "Failed to fetch most available books",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});
module.exports = router;
