const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Get all questions for a specific book
router.get("/book/:bookId", async (req, res) => {
  try {
    const questions = await Question.find({ bookId: req.params.bookId }).sort({
      timestamp: -1,
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new question for a specific book
router.post("/", async (req, res) => {
  const { title, body, user, bookId } = req.body;

  if (!title || !body || !bookId) {
    return res
      .status(400)
      .json({ message: "Title, body, and bookId are required" });
  }

  const question = new Question({
    title,
    body,
    bookId,
    user: user || "Anonymous",
    timestamp: new Date(),
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add an answer to a question
router.post("/:id/answers", async (req, res) => {
  const { text, user } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Answer text is required" });
  }

  try {
    const question = await Question.findById(req.params.id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const newAnswer = {
      text,
      user: user || "Anonymous",
      votes: 0,
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Vote on an answer (upvote or downvote)
router.patch("/:questionId/answers/:answerId/vote", async (req, res) => {
  const { type } = req.body; // 'up' or 'down'

  if (type !== "up" && type !== "down") {
    return res
      .status(400)
      .json({ message: 'Vote type must be "up" or "down"' });
  }

  try {
    const question = await Question.findById(req.params.questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.votes += type === "up" ? 1 : -1;
    await question.save();

    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
