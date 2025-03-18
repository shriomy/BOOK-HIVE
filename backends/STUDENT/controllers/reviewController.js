const Book = require("../models/Book"); // Import the Book model

// Delete review by ID
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params; // Extract the reviewId from the URL

  try {
    // Find the book with the review and pull the review out of the reviews array
    const book = await Book.findOneAndUpdate(
      { "reviews._id": reviewId }, // Find book with reviewId
      { $pull: { reviews: { _id: reviewId } } }, // Remove the review from the array
      { new: true } // Return the updated book
    );

    // If no book was found with that review, return 404
    if (!book) {
      return res.status(404).json({ message: "Review not found in any book" });
    }

    res.status(200).json({ message: "Review deleted successfully", book });
  } catch (err) {
    console.error("Error deleting review:", err);
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
};

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { reviewText, reviewer } = req.body;

  try {
    // Find the book by ID and update its reviews
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add the new review to the reviews array
    book.reviews.push({ reviewText, reviewer });

    // Save the book with the new review
    await book.save();

    res.status(200).json(book.reviews[book.reviews.length - 1]); // Return the new review
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding review" });
  }
};

// Edit review by ID
exports.editReview = async (req, res) => {
  const { reviewId } = req.params; // Extract the reviewId from the URL
  const { reviewText } = req.body; // Extract the new review text from the request body

  try {
    // Find the book containing the review and update the review text
    const book = await Book.findOneAndUpdate(
      { "reviews._id": reviewId }, // Find book with reviewId
      { $set: { "reviews.$.reviewText": reviewText } }, // Update the review text
      { new: true } // Return the updated book
    );

    // If no book was found with that review, return 404
    if (!book) {
      return res.status(404).json({ message: "Review not found in any book" });
    }

    res.status(200).json({ message: "Review updated successfully", book });
  } catch (err) {
    console.error("Error editing review:", err);
    res
      .status(500)
      .json({ message: "Error editing review", error: err.message });
  }
};
