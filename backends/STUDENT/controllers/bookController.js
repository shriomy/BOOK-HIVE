const Book = require("../models/Book");

// Controller to get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().select(
      "_id title author genre category bookCount"
    );

    // Map through books to format them correctly
    const formattedBooks = books.map((book) => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      category: book.category,
      bookCount: book.bookCount,
      // We'll serve images through a separate endpoint
      bookImageUrl: `/api/books/${book._id}/image`,
    }));

    res.status(200).json(formattedBooks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
};

// Controller to get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Format the book before sending
    const formattedBook = {
      _id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      category: book.category,
      bookCount: book.bookCount,
      bookImageUrl: `/api/books/${book._id}/image`,
      reviews: book.reviews || [],
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };

    res.status(200).json(formattedBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book", error: error.message });
  }
};

// New controller to serve the book image
exports.getBookImage = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.bookImage || !book.bookImage.data) {
      return res.status(404).send("Image not found");
    }

    // Set the content type from the stored data
    res.set("Content-Type", book.bookImage.contentType);
    // Send the binary image data
    res.send(book.bookImage.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching image", error: error.message });
  }
};
