const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // Extract Schema from mongoose

const reviewSchema = new Schema({
  reviewText: String,
  reviewer: String,
  date: { type: Date, default: Date.now },
});

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  category: { type: String, required: true },
  bookCount: { type: Number, required: true },
  bookImage: { type: String }, // Store image URL or base64
  reviews: [reviewSchema], // Using a dedicated schema for reviews
}, 
{ timestamps: true });

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

module.exports = Book;
