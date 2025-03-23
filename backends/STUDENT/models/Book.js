const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewText: String,
  reviewer: String,
  date: { type: Date, default: Date.now },
});

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    category: { type: String, required: true },
    bookCount: { type: Number, required: true },
    bookImage: {
      data: Buffer, // Binary image data
      contentType: String, // MIME type of the image
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

module.exports = Book;
