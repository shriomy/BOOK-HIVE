const Book = require("../models/AdminBookModel");
const multer = require("multer");
const fs = require("fs");

// Configure multer to store files in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("bookImage");

// Fetch all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().select("-bookImage"); // Exclude image data for listing
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// Fetch book cover by ID
const getBookCover = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).select("bookImage");
    if (!book || !book.bookImage || !book.bookImage.data) {
      return res.status(404).json({ message: "Book cover not found" });
    }

    // Set content type and send binary data
    res.contentType(book.bookImage.contentType);
    res.send(book.bookImage.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book cover", error });
  }
};

// Add a new book
const addBook = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }

    try {
      const { title, author, genre, category, bookCount } = req.body;

      // Ensure bookCount is a number
      const bookCountNumber = Number(bookCount);
      if (isNaN(bookCountNumber)) {
        return res.status(400).json({ message: "Invalid book count" });
      }

      // Create book object with basic info
      const newBook = new Book({
        title,
        author,
        genre,
        category,
        bookCount: bookCountNumber,
      });

      // Add image if available
      if (req.file) {
        newBook.bookImage = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      await newBook.save();
      res.status(201).json({
        message: "Book added successfully",
        newBook: {
          ...newBook.toObject(),
          bookImage: newBook.bookImage ? true : false, // Don't send binary data back
        },
      });
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
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
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

      // Update image if a new one is provided
      if (req.file) {
        updatedBookData.bookImage = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        updatedBookData,
        {
          new: true,
        }
      ).select("-bookImage.data"); // Don't return the image data

      res
        .status(200)
        .json({ message: "Book updated successfully", updatedBook });
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

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting book", error });
  }
};

module.exports = { getBooks, getBookCover, addBook, updateBook, deleteBook };
