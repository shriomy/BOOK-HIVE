const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    genre: String,
    category: String,
    bookCount: Number,
    bookImage: String,
    reviews: [
      {
        reviewText: String,
        reviewer: String, // Store the name of the reviewer
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
