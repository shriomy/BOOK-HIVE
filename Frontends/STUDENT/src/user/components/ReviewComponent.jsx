import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../index.css";

const ReviewComponent = ({ bookId, reviews, user, onReviewsUpdate }) => {
  const [newReview, setNewReview] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);
  const [isReviewsVisible, setIsReviewsVisible] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isReviewsVisible ? contentRef.current.scrollHeight : 0);
    }
  }, [isReviewsVisible, reviews, editReviewId]); // Recalculate when these change

  const toggleReviewsVisibility = () => {
    setIsReviewsVisible(!isReviewsVisible);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/reviews/${bookId}`,
        {
          reviewText: newReview,
          reviewer: user.name,
        }
      );

      // Update the reviews state via parent callback
      const updatedReviews = [...reviews, response.data];
      onReviewsUpdate(updatedReviews);

      setNewReview(""); // Clear the review input
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/reviews/${reviewId}`
      );

      // Update the reviews state via parent callback
      const updatedReviews = reviews.filter(
        (review) => review._id !== reviewId
      );
      onReviewsUpdate(updatedReviews);

      alert(response.data.message);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review.");
    }
  };

  const handleEditReview = (reviewId, currentReviewText) => {
    setEditReviewId(reviewId);
    setEditReviewText(currentReviewText);
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editReviewText.trim()) return;
    try {
      await axios.put(`http://localhost:4000/api/reviews/${reviewId}`, {
        reviewText: editReviewText,
      });

      // Update the reviews state via parent callback
      const updatedReviews = reviews.map((review) =>
        review._id === reviewId
          ? { ...review, reviewText: editReviewText }
          : review
      );
      onReviewsUpdate(updatedReviews);

      setEditReviewId(null);
      setEditReviewText("");
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="mt-10">
      <h2
        className="text-2xl text-[#edbf6d] font-bold mb-4 cursor-pointer flex items-center"
        onClick={toggleReviewsVisibility}
      >
        Reviews
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`ml-2 size-6 transform transition-transform duration-300 ${
            isReviewsVisible ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </h2>

      <div
        ref={contentRef}
        style={{
          height: `${height}px`,
          overflow: "hidden",
          transition: "height 0.3s ease-in-out",
        }}
        className="review-content"
      >
        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="mt-6">
          <textarea
            className="w-full p-3 text-white bg-[#2c1f19] border border-[#edbf6d] rounded-lg focus:outline-none"
            rows="3"
            placeholder="Write your review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-2 w-full rounded-2xl text-center font-semibold transition-all duration-200 mt-2"
          >
            Submit Review
          </button>
        </form>
        {reviews.length > 0 ? (
          <div className="space-y-4 mt-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#2c1f19] p-4 rounded-lg animate-fadeIn"
              >
                <p className="text-white">
                  <strong className="text-[#edbf6d]">
                    {review.reviewer || "Anonymous"}:
                  </strong>{" "}
                  {editReviewId === review._id ? (
                    <textarea
                      className="w-full p-3 text-white bg-[#2c1f19] border border-[#edbf6d] rounded-lg focus:outline-none"
                      rows="3"
                      value={editReviewText}
                      onChange={(e) => setEditReviewText(e.target.value)}
                    />
                  ) : (
                    review.reviewText
                  )}
                </p>

                {/* Show Edit and Delete buttons only if the logged-in user is the reviewer */}
                {user && review.reviewer === user.name && (
                  <div className="mt-2">
                    {editReviewId === review._id ? (
                      <button
                        onClick={() => handleUpdateReview(review._id)}
                        className="text-green-500 hover:text-green-700 bg-transparent"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleEditReview(review._id, review.reviewText)
                        }
                        className="text-blue-500 hover:text-blue-700 bg-transparent"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                          <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 ml-4 hover:text-red-700 bg-transparent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-4">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
