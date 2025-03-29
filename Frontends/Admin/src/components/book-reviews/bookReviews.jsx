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
  TextField,
  InputAdornment,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";

const BookReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/reviews", {
          withCredentials: true,
        });
        setReviews(response.data);
        setFilteredReviews(response.data);
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

  useEffect(() => {
    // Filter reviews based on search term and filter option
    const filtered = reviews.filter((review) => {
      const matchesSearch =
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterOption === "all") return matchesSearch;
      if (filterOption === "positive")
        return matchesSearch && review.rating >= 4;
      if (filterOption === "neutral")
        return matchesSearch && review.rating === 3;
      if (filterOption === "negative")
        return matchesSearch && review.rating < 3;
      return matchesSearch;
    });

    setFilteredReviews(filtered);
  }, [searchTerm, filterOption, reviews]);

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
        `http://localhost:3000/api/${bookId}/review/${reviewId}`,
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

  const generatePDF = () => {
    if (!selectedReview) return;

    // Create new PDF document
    const doc = new jsPDF();

    // Set font styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    // Add title
    doc.text("Book Review Details", 20, 20);

    // Set normal font for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Add book details
    doc.text(`Book Title: ${selectedReview.title}`, 20, 40);
    doc.text(`Reviewer: ${selectedReview.reviewer}`, 20, 50);
    doc.text(
      `Review Date: ${new Date(selectedReview.date).toLocaleDateString()}`,
      20,
      60
    );

    if (selectedReview.rating !== undefined) {
      doc.text(`Rating: ${selectedReview.rating}/5`, 20, 70);
    }

    // Add review text with word wrapping
    doc.setFontSize(14);
    doc.text("Review:", 20, 90);

    const splitText = doc.splitTextToSize(selectedReview.reviewText, 170);
    doc.setFontSize(12);
    doc.text(splitText, 20, 100);

    // Save the PDF
    doc.save(`${selectedReview.title.replace(/\s+/g, "_")}_review.pdf`);
  };

  const getRatingColor = (rating) => {
    if (!rating) return "default";
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "error";
  };

  if (loading) return <Typography>Loading reviews...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Box className="books-head" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          All Book Reviews
        </Typography>
      </Box>

      <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search reviews"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "250px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <InputLabel>Filter by</InputLabel>
          <Select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            label="Filter by"
          >
            <MenuItem value="all">All Reviews</MenuItem>
            <MenuItem value="positive">Positive</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="negative">Negative</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredReviews.length === 0 ? (
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
              {filteredReviews.map((review) => (
                <tr key={review.reviewId} className="review-row">
                  <td className="book-title">{review.title}</td>
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
                      variant="contained"
                      size="small"
                      sx={{ mr: 1, borderRadius: "20px" }}
                    >
                      View
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteReview(review.bookId, review.reviewId)
                      }
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "20px" }}
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
        PaperProps={{
          sx: {
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>
          Review Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedReview && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                {selectedReview.title}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Chip
                  label={`Reviewer: ${selectedReview.reviewer}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Date: ${new Date(
                    selectedReview.date
                  ).toLocaleDateString()}`}
                  variant="outlined"
                  size="small"
                />
                {selectedReview.rating !== undefined && (
                  <Chip
                    label={`Rating: ${selectedReview.rating}/5`}
                    color={getRatingColor(selectedReview.rating)}
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="body1" sx={{ mt: 2, fontWeight: "medium" }}>
                Review:
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  mt: 1,
                  p: 2,
                  bgcolor: "#f9f9f9",
                  borderRadius: "4px",
                  borderLeft: "4px solid #1976d2",
                }}
              >
                {selectedReview.reviewText}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {selectedReview && (
            <>
              <Button
                onClick={generatePDF}
                color="primary"
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{ borderRadius: "20px", mr: 1 }}
              >
                Download PDF
              </Button>
              <Button
                onClick={() =>
                  handleDeleteReview(
                    selectedReview.bookId,
                    selectedReview.reviewId
                  )
                }
                color="error"
                variant="outlined"
                sx={{ borderRadius: "20px" }}
              >
                Delete Review
              </Button>
            </>
          )}
          <Button
            onClick={handleCloseModal}
            color="primary"
            variant="contained"
            sx={{ borderRadius: "20px" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookReviews;
