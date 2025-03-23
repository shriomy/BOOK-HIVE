import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import QAComponent from "../../user/components/QAComponent";
import BorrowingComponent from "../../user/components/BorrowingComponent";
import ReviewComponent from "../../user/components/ReviewComponent";
import CustomAlert from "../../user/components/CustomAlert"; // Import the CustomAlert component

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [borrowStatus, setBorrowStatus] = useState("");

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "info",
  });

  const { user } = useContext(UserContext);

  // Function to show alerts
  const showAlert = (message, variant = "info", duration = 5000) => {
    setAlert({
      show: true,
      message,
      variant,
      duration,
    });
  };

  // Function to handle alert close
  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/books/${id}`);
      setBook(response.data);
      setReviews(response.data.reviews || []);

      // Check if current user has borrowed this book
      if (user && user._id) {
        let userBorrowStatus = "";

        if (response.data.borrowings && response.data.borrowings.length > 0) {
          const userBorrowing = response.data.borrowings.find(
            (b) => b.userId === user._id
          );

          if (userBorrowing) {
            userBorrowStatus = userBorrowing.status;
          }
        }

        // If we didn't find a borrowing status in the book data, check specifically for this user
        if (!userBorrowStatus) {
          try {
            const borrowStatusResponse = await axios.get(
              `http://localhost:4000/api/books/${id}/borrow-status`,
              { params: { userId: user._id } }
            );

            if (borrowStatusResponse.data && borrowStatusResponse.data.status) {
              userBorrowStatus = borrowStatusResponse.data.status;
            }
          } catch (err) {
            console.log("No specific borrow status found", err);
          }
        }

        setBorrowStatus(userBorrowStatus);
      }
    } catch (err) {
      setError("Error fetching book details");
      console.error("Error fetching book:", err);
      showAlert(
        "Failed to load book details. Please try again later.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id, user]);

  // Handle successful borrow - update parent state
  const onBorrowSuccess = (updatedBorrowings) => {
    setBook((prevBook) => ({
      ...prevBook,
      currentStatus: "pending",
      borrowings: updatedBorrowings,
    }));
    setBorrowStatus("pending");
    showAlert("Borrow request submitted successfully!", "success");
  };

  // Handle review updates - update parent state
  const onReviewsUpdate = (updatedReviews) => {
    setReviews(updatedReviews);
    showAlert("Review submitted successfully!", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] flex items-center justify-center">
        <div className="text-[#edbf6d] text-xl">Loading book details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg">
        {error}
        <CustomAlert
          variant="danger"
          message={error}
          show={true}
          onClose={() => setError("")}
          duration={6000}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] py-12">
      {/* Alert Component */}
      <CustomAlert
        variant={alert.variant}
        message={alert.message}
        show={alert.show}
        onClose={handleAlertClose}
        autoClose={true}
        duration={alert.duration || 5000}
      />

      {book && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#1e1b18] p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-[#edbf6d] mb-6 text-center">
              {book.title}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={`http://localhost:4000/api/books/${id}/image`}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-book.png";
                    showAlert("Book image couldn't be loaded", "warning");
                  }}
                />
              </div>
              <div className="text-white">
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Author:</strong>{" "}
                  {book.author}
                </p>
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Genre:</strong>{" "}
                  {book.genre}
                </p>
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Category:</strong>{" "}
                  {book.category}
                </p>
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Book Count:</strong>{" "}
                  {book.bookCount}
                </p>

                {/* Borrowing Component */}
                <BorrowingComponent
                  bookId={id}
                  borrowStatus={borrowStatus}
                  bookCount={book.bookCount}
                  borrowings={book.borrowings || []}
                  user={user}
                  onBorrowSuccess={onBorrowSuccess}
                  showAlert={showAlert} // Pass the showAlert function
                />
              </div>
            </div>

            {/* Review Component */}
            <ReviewComponent
              bookId={id}
              reviews={reviews}
              user={user}
              onReviewsUpdate={onReviewsUpdate}
              showAlert={showAlert} // Pass the showAlert function
            />

            {/* Pass bookId to QAComponent */}
            <div>
              <QAComponent
                bookId={id}
                showAlert={showAlert} // Pass the showAlert function
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
