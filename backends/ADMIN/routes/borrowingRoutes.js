const express = require("express");
const router = express.Router();
const Book = require("../models/AdminBookModel"); // Import Book model

// GET borrowings with sorting and filtering
router.get("/", async (req, res) => {
  const { sort = "borrowDate", order = "desc" } = req.query;

  try {
    console.log("Borrowings Request - Sort:", sort, "Order:", order); // Debugging log

    // Find books with borrowings and transform the data
    const books = await Book.find({
      borrowings: { $exists: true, $not: { $size: 0 } },
    });

    // Flatten borrowings across all books
    const transformedBorrowings = books.flatMap((book) =>
      book.borrowings.map((borrowing) => ({
        _id: borrowing._id,
        book: {
          title: book.title,
          bookImage: book.bookImage
            ? {
                contentType: book.bookImage.contentType,
                data: book.bookImage.data
                  ? book.bookImage.data.toString("base64")
                  : null,
              }
            : null,
        },
        userName: borrowing.userName,
        userId: borrowing.userId,
        status: borrowing.status,
        borrowDate: borrowing.borrowDate,
        returnDate: borrowing.returnDate,
      }))
    );

    // Sort the transformed borrowings
    const sortedBorrowings = transformedBorrowings.sort((a, b) => {
      const sortValue = sort === "borrowDate" ? "borrowDate" : "status";
      return order === "desc"
        ? new Date(b[sortValue]) - new Date(a[sortValue])
        : new Date(a[sortValue]) - new Date(b[sortValue]);
    });

    res.json(sortedBorrowings);
  } catch (error) {
    console.error("Error fetching borrowings:", error);
    res.status(500).json({
      message: "Error fetching borrowings",
      error: error.message,
    });
  }
});

// Route to update borrowing status
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status, returnDate } = req.body;

  try {
    // Find the book containing the borrowing
    const book = await Book.findOne({ "borrowings._id": id });

    if (!book) {
      return res.status(404).json({ message: "Borrowing not found" });
    }

    // Find and update the specific borrowing
    const borrowingIndex = book.borrowings.findIndex(
      (b) => b._id.toString() === id
    );

    if (borrowingIndex === -1) {
      return res.status(404).json({ message: "Borrowing not found" });
    }

    // Update borrowing status and return date
    book.borrowings[borrowingIndex].status = status;
    if (returnDate) {
      book.borrowings[borrowingIndex].returnDate = returnDate;
    }

    // If the status is changed to "returned", increment the book count
    if (status === "returned") {
      book.bookCount += 1;
    }

    // Save the updated book
    await book.save();

    res.json({
      message: "Borrowing status updated successfully",
      borrowing: book.borrowings[borrowingIndex],
      bookCount: book.bookCount,
    });
  } catch (error) {
    console.error("Error updating borrowing status:", error);
    res.status(500).json({
      message: "Error updating borrowing status",
      error: error.message,
    });
  }
});

// Route to generate receipt
router.post("/:id/receipt", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the book containing the borrowing
    const book = await Book.findOne({ "borrowings._id": id });

    if (!book) {
      return res.status(404).json({ message: "Borrowing not found" });
    }

    // Find the specific borrowing
    const borrowing = book.borrowings.find((b) => b._id.toString() === id);

    if (!borrowing) {
      return res.status(404).json({ message: "Borrowing not found" });
    }

    // Generate receipt data
    const receiptData = {
      bookTitle: book.title,
      userName: borrowing.userName,
      userId: borrowing.userId,
      borrowDate: borrowing.borrowDate,
      status: borrowing.status,
    };

    res.json(receiptData);
  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).json({
      message: "Error generating receipt",
      error: error.message,
    });
  }
});

module.exports = router;
