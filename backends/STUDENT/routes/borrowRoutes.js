const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
//const auth = require("../middleware/auth"); // Assuming you have authentication middleware

// Borrow a book
router.post("/api/books/:id/borrow", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId, userName } = req.body;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is available to borrow
    if (book.bookCount <= 0) {
      return res.status(400).json({ message: "No copies available to borrow" });
    }

    // Check if user already has a pending or borrowed status for this book
    const existingBorrowing = book.borrowings.find(
      (b) =>
        b.userId.toString() === userId &&
        ["pending", "borrowed"].includes(b.status)
    );

    if (existingBorrowing) {
      return res.status(400).json({
        message: `You already have this book ${existingBorrowing.status}`,
      });
    }

    // Create new borrowing record
    const newBorrowing = {
      userId,
      userName,
      status: "pending",
      borrowDate: new Date(),
    };

    book.borrowings.push(newBorrowing);

    // Update book count
    book.bookCount -= 1;

    // Update book's overall availability status based on remaining copies
    if (book.bookCount <= 0) {
      book.currentStatus = "unavailable";
    } else {
      book.currentStatus = "available";
    }

    await book.save();

    res.status(200).json({
      message: "Book borrow request submitted successfully",
      status: "pending",
      borrowing: newBorrowing,
    });
  } catch (error) {
    console.error("Error in borrowing book:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get borrowing status for a specific user
router.get("/api/books/:id/borrow-status", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find borrowing for this user
    const userBorrowing = book.borrowings.find(
      (b) => b.userId.toString() === userId
    );

    if (!userBorrowing) {
      // Return empty status and book availability
      return res.status(200).json({
        status: "",
        bookAvailability: book.currentStatus,
        remainingCopies: book.bookCount,
      });
    }

    res.status(200).json({
      status: userBorrowing.status,
      borrowingId: userBorrowing._id,
      bookAvailability: book.currentStatus,
      remainingCopies: book.bookCount,
    });
  } catch (error) {
    console.error("Error fetching borrow status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update borrowing status (for admin or librarian)
router.put("/api/books/:id/borrow-status", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { borrowingId, newStatus } = req.body;

    // Validate status
    if (!["pending", "borrowed", "returned", "received"].includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find the borrowing record
    const borrowingIndex = book.borrowings.findIndex(
      (b) => b._id.toString() === borrowingId
    );

    if (borrowingIndex === -1) {
      return res.status(404).json({ message: "Borrowing record not found" });
    }

    // Update the status for this specific borrowing record only
    book.borrowings[borrowingIndex].status = newStatus;

    // If book is received back, increase the book count
    if (newStatus === "received") {
      book.bookCount += 1;

      // Update book's overall availability status
      if (book.bookCount > 0) {
        book.currentStatus = "available";
      }
    }

    // If status is 'returned', add return date
    if (newStatus === "returned") {
      book.borrowings[borrowingIndex].returnDate = new Date();
    }

    await book.save();

    res.status(200).json({
      message: `Borrowing status updated to ${newStatus}`,
      book: book,
    });
  } catch (error) {
    console.error("Error updating borrow status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all books with availability information
router.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();

    // Map books to include simple availability info
    const booksWithAvailability = books.map((book) => ({
      ...book.toObject(),
      isAvailable: book.bookCount > 0,
      remainingCopies: book.bookCount,
    }));

    res.status(200).json(booksWithAvailability);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
