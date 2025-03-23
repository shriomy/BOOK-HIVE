import React, { useState, useEffect } from "react";
import axios from "axios";
import BorrowingComponent from "./BorrowingComponent";
// ... other imports

const BookDetail = ({ bookId, user }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowStatus, setBorrowStatus] = useState("");
  const [borrowingId, setBorrowingId] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  // Function to show alerts
  const showAlert = (message, type) => {
    setAlert({ message, type });
    // Optional: Auto-dismiss after 5 seconds
    setTimeout(() => setAlert({ message: "", type: "" }), 5000);
  };

  // Fetch book data
  const fetchBookData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/books/${bookId}`
      );
      setBook(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching book:", error);
      showAlert("Error loading book details", "danger");
      return null;
    }
  };

  // Fetch user-specific borrow status
  const fetchBorrowStatus = async () => {
    if (!user) {
      setBorrowStatus("");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/books/${bookId}/borrow-status?userId=${user._id}`
      );

      setBorrowStatus(response.data.status || "");
      if (response.data.borrowingId) {
        setBorrowingId(response.data.borrowingId);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrow status:", error);
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBookData();
      await fetchBorrowStatus();
    };

    loadData();
  }, [bookId, user]);

  // Handle successful borrow
  const handleBorrowSuccess = (updatedBorrowings, newBookCount) => {
    // Update local state immediately
    setBook((prevBook) => {
      if (!prevBook) return null;

      return {
        ...prevBook,
        borrowings: updatedBorrowings,
        bookCount: newBookCount,
        currentStatus: newBookCount > 0 ? "available" : "unavailable",
      };
    });

    // Update the borrowStatus for this user
    setBorrowStatus("pending");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="book-detail-container">
      {/* Alert component */}
      {alert.message && (
        <div className={`alert alert-${alert.type} mb-4 p-3 rounded`}>
          {alert.message}
        </div>
      )}

      {/* Book details */}
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>Category: {book.category}</p>

      {/* Borrowing component */}
      <div className="borrow-section mt-6">
        <BorrowingComponent
          bookId={bookId}
          borrowStatus={borrowStatus}
          bookAvailability={book.currentStatus}
          bookCount={book.bookCount}
          borrowings={book.borrowings}
          user={user}
          onBorrowSuccess={handleBorrowSuccess}
          showAlert={showAlert}
        />
      </div>

      {/* Add other book details and components as needed */}
    </div>
  );
};

export default BookDetail;
