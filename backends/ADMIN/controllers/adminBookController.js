const Book = require("../models/AdminBookModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: "./uploads/", // Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("bookImage");

// Fetch all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// Fetch book cover by ID
const getBookCover = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.bookImage) {
      return res.status(404).json({ message: "Book cover not found" });
    }
    res.json({ bookImage: book.bookImage });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book cover", error });
  }
};

// Add a new book
const addBook = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ message: "File upload failed", error: err });
    }

    try {
      const { title, author, genre, category, bookCount } = req.body;

      // Ensure bookCount is a number
      const bookCountNumber = Number(bookCount);
      if (isNaN(bookCountNumber)) {
        return res.status(400).json({ message: "Invalid book count" });
      }

      const bookImage = req.file ? req.file.path : null; // Store file path

      const newBook = new Book({
        title,
        author,
        genre,
        category,
        bookCount: bookCountNumber,
        bookImage,
      });

      await newBook.save();
      res.status(201).json({ message: "Book added successfully", newBook });
    } catch (error) {
      console.error("Error adding book:", error);
      res.status(400).json({ message: "Error adding book", error });
    }
  });
};

// Update an existing book
const updateBook = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ message: "File upload failed", error: err });
    }

    try {
      const { title, author, genre, category, bookCount } = req.body;
      const bookId = req.params.id;

      // Ensure bookCount is a number
      const bookCountNumber = Number(bookCount);
      if (isNaN(bookCountNumber)) {
        return res.status(400).json({ message: "Invalid book count" });
      }

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      let updatedBookData = {
        title,
        author,
        genre,
        category,
        bookCount: bookCountNumber,
      };

      if (req.file) {
        // Delete the old book image if it exists
        if (book.bookImage) {
          fs.unlinkSync(book.bookImage);
        }
        updatedBookData.bookImage = req.file.path;
      }

      const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, {
        new: true,
      });

      res.status(200).json({ message: "Book updated successfully", updatedBook });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(400).json({ message: "Error updating book", error });
    }
  });
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the book image if it exists
    if (book.bookImage) {
      fs.unlinkSync(book.bookImage);
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting book", error });
  }
};

module.exports = { getBooks, getBookCover, addBook, updateBook, deleteBook };
