const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController"); // Import the reviewController

// Route to handle the review deletion
router.delete("/:reviewId", reviewController.deleteReview);
router.post("/:id", reviewController.addReview);
router.put("/:reviewId", reviewController.editReview);

module.exports = router;
