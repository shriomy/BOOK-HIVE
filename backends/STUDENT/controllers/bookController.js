const Book = require("../models/Book");

// Controller to get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books); // Return the list of books
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// Controller to get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};
