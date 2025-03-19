import React, { useState, useEffect } from "react";
import axios from "axios";
import "./bookTable.scss";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const BookReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/reviews", {
          withCredentials: true,
        });
        setReviews(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReview(null);
  };

  const handleDeleteReview = async (bookId, reviewId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/${bookId}/review/${reviewId}`,
        {
          withCredentials: true,
        }
      );
      setReviews(reviews.filter((review) => review.reviewId !== reviewId));
      if (openModal && selectedReview?.reviewId === reviewId) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review. Please try again.");
    }
  };

  if (loading) return <Typography>Loading reviews...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box className="books-head">
        <Typography variant="h5">All Book Reviews</Typography>
      </Box>

      {reviews.length === 0 ? (
        <Typography>No reviews found.</Typography>
      ) : (
        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr className="tab-hed">
                <th>Book Name</th>
                <th>Reviewer</th>
                <th>Review Date</th>
                <th>Review</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>{review.title}</td>
                  <td>{review.reviewer}</td>
                  <td>{new Date(review.date).toLocaleDateString()}</td>
                  <td>
                    {review.reviewText.length > 50
                      ? `${review.reviewText.substring(0, 50)}...`
                      : review.reviewText}
                  </td>
                  <td>
                    <Button
                      onClick={() => handleViewDetails(review)}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteReview(review.bookId, review.reviewId)
                      }
                      color="error"
                      variant="outlined"
                      size="small"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for review details */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Review Details</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Book: {selectedReview.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Reviewer: {selectedReview.reviewer}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Review Date:{" "}
                {new Date(selectedReview.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Review:</strong>
              </Typography>
              <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                {selectedReview.reviewText}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedReview && (
            <Button
              onClick={() =>
                handleDeleteReview(
                  selectedReview.bookId,
                  selectedReview.reviewId
                )
              }
              color="error"
            >
              Delete Review
            </Button>
          )}
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookReviews;
