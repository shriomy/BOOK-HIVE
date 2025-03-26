const Book = require("../models/Book");

exports.getUserBorrowings = async (req, res) => {
  try {
    let borrowings;
    if (req.isAdmin) {
      // If admin, fetch all borrowings
      borrowings = await Book.find(
        {
          "borrowings.userId": { $exists: true },
        },
        {
          title: 1,
          author: 1,
          genre: 1,
          borrowings: 1,
        }
      );
    } else {
      // For regular users, fetch only their borrowings
      borrowings = await Book.find(
        {
          "borrowings.userId": req.user.id,
        },
        {
          title: 1,
          author: 1,
          genre: 1,
          borrowings: 1,
        }
      );
    }

    if (borrowings.length === 0) {
      return res.status(404).json({ message: "No borrowings found." });
    }

    // Transform the data to include all borrowings for each book
    const formattedBorrowings = [];
    borrowings.forEach((book) => {
      // Filter borrowings for the current user
      const userBorrowings = book.borrowings.filter(
        (borrowing) => borrowing.userId.toString() === req.user.id.toString()
      );

      // Add each borrowing record to the formatted list
      userBorrowings.forEach((borrowing) => {
        formattedBorrowings.push({
          bookId: book._id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          borrowing: borrowing,
        });
      });
    });

    // Sort borrowings by date (most recent first)
    formattedBorrowings.sort(
      (a, b) =>
        new Date(b.borrowing.borrowDate) - new Date(a.borrowing.borrowDate)
    );

    res.json(formattedBorrowings);
  } catch (error) {
    console.error("Error fetching borrowings:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};
