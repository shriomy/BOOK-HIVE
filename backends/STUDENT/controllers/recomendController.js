const Book = require("../models/Book");

exports.getMostBorrowedBooks = async (req, res) => {
  try {
    // Aggregate to find books with the most borrowings
    const mostBorrowedBooks = await Book.aggregate([
      // Unwind the borrowings array to work with individual borrowing records
      { $unwind: "$borrowings" },
      // Group by book ID and count borrowings
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          author: { $first: "$author" },
          genre: { $first: "$genre" },
          category: { $first: "$category" },
          bookCount: { $first: "$bookCount" },
          borrowCount: { $sum: 1 }, // Count number of borrowings
        },
      },
      // Sort by borrowing count in descending order
      { $sort: { borrowCount: -1 } },
      // Limit to top 5
      { $limit: 5 },
    ]);
    // Format the results
    const formattedBooks = mostBorrowedBooks.map((book) => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      category: book.category,
      bookCount: book.bookCount,
      borrowCount: book.borrowCount,
      bookImageUrl: `/api/books/${book._id}/image`,
    }));
    res.status(200).json(formattedBooks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching most borrowed books",
      error: error.message,
    });
  }
};

// Controller method for SSE implementation
exports.getMostBorrowedBooksSSE = async (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  // Send initial data
  try {
    const books = await this.getMostBorrowedBooksData();
    res.write(`data: ${JSON.stringify(books)}\n\n`);
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  }
  // Set up interval to send updates (every 30 seconds)
  const intervalId = setInterval(async () => {
    try {
      const books = await this.getMostBorrowedBooksData();
      res.write(`data: ${JSON.stringify(books)}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    }
  }, 30000);
  // Handle client disconnect
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};

// Helper method to get the data (used by both regular and SSE endpoints)
exports.getMostBorrowedBooksData = async () => {
  const mostBorrowedBooks = await Book.aggregate([
    { $unwind: "$borrowings" },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        author: { $first: "$author" },
        genre: { $first: "$genre" },
        category: { $first: "$category" },
        bookCount: { $first: "$bookCount" },
        borrowCount: { $sum: 1 },
      },
    },
    { $sort: { borrowCount: -1 } },
    { $limit: 5 },
  ]);
  return mostBorrowedBooks.map((book) => ({
    _id: book._id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    category: book.category,
    bookCount: book.bookCount,
    borrowCount: book.borrowCount,
    bookImageUrl: `/api/books/${book._id}/image`,
  }));
};
