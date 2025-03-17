const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  category: { type: String, required: true },
  bookCount: { type: Number, required: true },
  bookImage: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
