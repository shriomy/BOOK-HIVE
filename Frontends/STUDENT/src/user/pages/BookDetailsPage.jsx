import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import QAComponent from "../../user/components/QAComponent";
import BorrowingComponent from "../../user/components/BorrowingComponent";
import ReviewComponent from "../../user/components/ReviewComponent";
import CustomAlert from "../../user/components/CustomAlert";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [borrowStatus, setBorrowStatus] = useState("");
  const [animationComplete, setAnimationComplete] = useState(false);

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
      // Start animation sequence after data is loaded
      setTimeout(() => {
        setAnimationComplete(true);
      }, 100);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-indigo-600 text-xl font-medium">
            Loading book details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          <CustomAlert
            variant="danger"
            message={error}
            show={true}
            onClose={() => setError("")}
            duration={6000}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 overflow-hidden">
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
          {/* Main Book Detail Card with animations */}
          <div
            className={`bg-white rounded-xl shadow-md overflow-hidden mb-12 transition-all duration-1000 ease-out transform ${
              animationComplete
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-12"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Left column - Book image with animations */}
              <div
                className={`md:col-span-5 lg:col-span-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 transition-all duration-1000 delay-200 ${
                  animationComplete ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative h-full w-full p-8 flex items-center justify-center">
                  <div
                    className={`transition-all duration-1000 ease-out transform delay-300 ${
                      animationComplete
                        ? "opacity-100 scale-100 rotate-0"
                        : "opacity-0 scale-90 rotate-6"
                    }`}
                  >
                    <img
                      src={`http://localhost:4000/api/books/${id}/image`}
                      alt={book.title}
                      className="w-full max-w-xs object-cover rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-book.png";
                        showAlert("Book image couldn't be loaded", "warning");
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right column - Book details with staggered animations */}
              <div className="md:col-span-7 lg:col-span-8 p-8">
                <div
                  className={`border-b border-gray-100 pb-4 mb-6 transition-all duration-700 ease-out transform delay-400 ${
                    animationComplete
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-12"
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                        {book.title}
                      </h1>
                      <p className="text-lg text-indigo-600 mb-3">
                        By <span className="font-medium">{book.author}</span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span
                        className={`bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full transition-all duration-500 delay-500 transform ${
                          animationComplete
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50"
                        }`}
                      >
                        {book.bookCount > 0 ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all duration-700 ease-out delay-600 ${
                    animationComplete
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                        Genre
                      </h3>
                      <p className="text-lg">{book.genre}</p>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                        Category
                      </h3>
                      <p className="text-lg">{book.category}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                        Available Copies
                      </h3>
                      <p className="text-lg font-medium">{book.bookCount}</p>
                    </div>
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                        Status
                      </h3>
                      <p className="text-lg">
                        {borrowStatus ? (
                          <span
                            className={`font-medium ${
                              borrowStatus === "approved"
                                ? "text-green-600"
                                : borrowStatus === "pending"
                                ? "text-amber-600"
                                : borrowStatus === "rejected"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {borrowStatus.charAt(0).toUpperCase() +
                              borrowStatus.slice(1)}
                          </span>
                        ) : (
                          "Not borrowed"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Borrowing Component */}
                <div
                  className={`mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 transition-all duration-700 ease-out transform delay-800 ${
                    animationComplete
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  }`}
                >
                  <BorrowingComponent
                    bookId={id}
                    borrowStatus={borrowStatus}
                    bookCount={book.bookCount}
                    borrowings={book.borrowings || []}
                    user={user}
                    onBorrowSuccess={onBorrowSuccess}
                    showAlert={showAlert}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for Reviews and Q&A with slide-up animation */}
          <div
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-1000 ease-out transform delay-1000 ${
              animationComplete
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-24"
            }`}
          >
            <div className="px-8 pt-8">
              <ul className="flex border-b border-gray-200">
                <li className="mr-1">
                  <a
                    href="#reviews"
                    className="inline-block py-3 px-4 text-indigo-600 font-medium border-b-2 border-indigo-600"
                  >
                    Reviews
                  </a>
                </li>
                <li className="mr-1">
                  <a
                    href="#qa"
                    className="inline-block py-3 px-4 text-gray-500 hover:text-indigo-600 font-medium"
                  >
                    Questions & Answers
                  </a>
                </li>
              </ul>
            </div>

            {/* Review Component */}
            <div id="reviews" className="p-8">
              <ReviewComponent
                bookId={id}
                reviews={reviews}
                user={user}
                onReviewsUpdate={onReviewsUpdate}
                showAlert={showAlert}
              />
            </div>

            {/* Q&A Component */}
            <div id="qa" className="p-8">
              <QAComponent bookId={id} showAlert={showAlert} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
