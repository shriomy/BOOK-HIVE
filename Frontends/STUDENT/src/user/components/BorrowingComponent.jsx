import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowingComponent = ({
  bookId,
  borrowStatus,
  bookAvailability,
  bookCount,
  borrowings,
  user,
  onBorrowSuccess,
  showAlert,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localBookCount, setLocalBookCount] = useState(bookCount);
  const [currentBorrowStatus, setCurrentBorrowStatus] = useState(borrowStatus);

  // Update local book count when prop changes
  useEffect(() => {
    setLocalBookCount(bookCount);
  }, [bookCount]);

  // Update current borrow status when borrowings change
  useEffect(() => {
    // Find the most recent borrowing for the current user
    if (borrowings && user) {
      const userBorrowings = borrowings.filter(
        (b) => b.userId.toString() === user._id.toString()
      );

      if (userBorrowings.length > 0) {
        // Sort borrowings by date in descending order
        const sortedBorrowings = userBorrowings.sort(
          (a, b) => new Date(b.borrowDate) - new Date(a.borrowDate)
        );

        // Set status of the most recent borrowing
        setCurrentBorrowStatus(sortedBorrowings[0].status);
      } else {
        // No borrowings found
        setCurrentBorrowStatus("");
      }
    }
  }, [borrowings, user]);

  // Borrow book function
  const handleBorrowBook = async () => {
    if (!user) {
      showAlert("You must be logged in to borrow a book.", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/api/books/${bookId}/borrow`,
        {
          userId: user._id,
          userName: user.name,
        }
      );

      // Get the new borrowing from the response
      const newBorrowing = response.data.borrowing;

      // Create updated borrowings array
      const updatedBorrowings = borrowings
        ? [...borrowings, newBorrowing]
        : [newBorrowing];

      // Update local book count immediately
      const newBookCount = localBookCount - 1;
      setLocalBookCount(newBookCount);

      // Call the parent callback to update state
      onBorrowSuccess(updatedBorrowings, newBookCount);

      // Show success alert
      showAlert("Book borrow request submitted successfully!", "success");
    } catch (error) {
      console.error("Error borrowing book:", error);

      // Specifically handle already borrowed scenario
      if (error.response?.data?.message?.includes("already borrowed")) {
        // Manually set the status to borrowed
        setCurrentBorrowStatus("borrowed");
      }

      showAlert(
        error.response?.data?.message || "Error borrowing book",
        "danger"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get book availability text
  const getAvailabilityText = () => {
    if (localBookCount > 0) {
      return `Available (${localBookCount} ${
        localBookCount === 1 ? "copy" : "copies"
      } left)`;
    } else {
      return "Currently Unavailable";
    }
  };

  // Get borrow button text based on user's specific status
  const getBorrowButtonText = () => {
    if (!user) return "Login to Borrow";
    if (isLoading) return "Processing...";

    switch (currentBorrowStatus) {
      case "pending":
        return "Request Pending";
      case "borrowed":
        return "Currently Borrowed";
      case "returned":
        return "Marked as Returned";
      case "received":
        return "Return Received";
      default:
        return localBookCount > 0 ? "Borrow Book" : "Unavailable";
    }
  };

  // Get borrow button style based on status
  const getBorrowButtonStyle = () => {
    const baseStyle =
      "p-2 w-full rounded-2xl text-center font-semibold transition-all duration-200";

    if (isLoading) {
      return `bg-gray-500 text-white cursor-not-allowed ${baseStyle}`;
    }

    if (!user) {
      return `bg-gray-400 text-gray-800 ${baseStyle}`;
    }

    // If no copies available and user doesn't have a status with this book
    if (localBookCount <= 0) {
      return `bg-gray-500 text-white cursor-not-allowed ${baseStyle}`;
    }

    switch (currentBorrowStatus) {
      case "pending":
        return `bg-yellow-500 text-gray-800 ${baseStyle}`;
      case "borrowed":
        return `bg-blue-500 text-white cursor-not-allowed ${baseStyle}`;
      case "returned":
        return `bg-green-400 text-gray-800 ${baseStyle}`;
      case "received":
        return `bg-green-600 text-white ${baseStyle}`;
      default:
        return `bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] ${baseStyle}`;
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = () => {
    if (isLoading) return true;
    if (localBookCount <= 0) return true;

    // If user has a recent borrowing that's not returned/received
    if (
      currentBorrowStatus &&
      !["returned", "received", ""].includes(currentBorrowStatus)
    ) {
      return true;
    }

    return false;
  };

  return (
    <>
      {/* Book Availability Status - shown to all users */}
      <p className="text-lg mb-2">
        <strong className="text-[#edbf6d]">Status:</strong>{" "}
        <span
          className={localBookCount > 0 ? "text-green-500" : "text-red-500"}
        >
          {getAvailabilityText()}
        </span>
      </p>

      {/* User's Personal Borrowing Status - only shown if they have a status */}
      {currentBorrowStatus && (
        <p className="text-lg mb-4">
          <strong className="text-[#edbf6d]">Your Request:</strong>{" "}
          <span
            className={
              currentBorrowStatus === "pending"
                ? "text-yellow-400"
                : currentBorrowStatus === "borrowed"
                ? "text-blue-400"
                : currentBorrowStatus === "returned"
                ? "text-green-400"
                : currentBorrowStatus === "received"
                ? "text-green-600"
                : ""
            }
          >
            {currentBorrowStatus.charAt(0).toUpperCase() +
              currentBorrowStatus.slice(1)}
          </span>
        </p>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleBorrowBook}
          disabled={isButtonDisabled()}
          className={getBorrowButtonStyle()}
        >
          {getBorrowButtonText()}
        </button>
      </div>
    </>
  );
};

export default BorrowingComponent;
