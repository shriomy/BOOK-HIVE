const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewText: String,
  reviewer: String,
  date: { type: Date, default: Date.now },
});

const borrowingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  userName: String,
  status: {
    type: String,
    enum: ["pending", "borrowed", "returned", "late return"],
    required: true,
  },
  borrowDate: { type: Date, default: Date.now },
  returnDate: Date,
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
    borrowings: [borrowingSchema], // Track multiple borrowing records
    currentStatus: {
      type: String,
      enum: ["available", "unavailable"], // Simplified to just track availability
      default: "available",
    },
  },
  { timestamps: true }
);

// Add a virtual property to compute if the book is available
bookSchema.virtual("isAvailable").get(function () {
  return this.bookCount > 0;
});

// Add a pre-save hook to ensure currentStatus always reflects bookCount
bookSchema.pre("save", function (next) {
  if (this.bookCount <= 0) {
    this.currentStatus = "unavailable";
  } else {
    this.currentStatus = "available";
  }
  next();
});

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
module.exports = Book;
