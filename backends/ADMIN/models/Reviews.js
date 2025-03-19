const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewText: String,
  reviewer: String,
  date: { type: Date, default: Date.now },
});

const bookSchema = new Schema(
  {
    title: String,
    author: String,
    genre: String,
    category: String,
    bookCount: Number,
    bookImage: String,
    reviews: [reviewSchema], // Using a dedicated schema for reviews
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
