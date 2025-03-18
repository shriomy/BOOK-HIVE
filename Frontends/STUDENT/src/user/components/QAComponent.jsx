import React, { useState } from "react";

const QuestionAndAnswers = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to implement a simple voting system in React?",
      body: "I'm trying to build a voting system in React. Any suggestions?",
      user: "User123",
      timestamp: "2025-03-18T14:00:00", // ISO timestamp format for easier sorting
      answers: [
        {
          id: 1,
          text: "You can use useState and handle voting logic with a simple counter.",
          votes: 3,
          user: "John Doe",
        },
        {
          id: 2,
          text: "Consider using Redux for better state management for large applications.",
          votes: 1,
          user: "Jane Smith",
        },
      ],
    },
    {
      id: 2,
      title: "What is the best way to optimize a React app?",
      body: "I am looking for suggestions to optimize my React app for better performance.",
      user: "DevGuy42",
      timestamp: "2025-03-18T12:00:00",
      answers: [
        {
          id: 1,
          text: "Try to use React.memo and lazy loading components for optimization.",
          votes: 5,
          user: "Alex Turner",
        },
      ],
    },
  ]);

  const [newAnswer, setNewAnswer] = useState("");
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const handleVote = (questionId, answerId, type) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId
                  ? {
                      ...answer,
                      votes: answer.votes + (type === "up" ? 1 : -1),
                    }
                  : answer
              ),
            }
          : question
      )
    );
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim() && selectedQuestionId !== null) {
      setQuestions(
        questions.map((question) =>
          question.id === selectedQuestionId
            ? {
                ...question,
                answers: [
                  ...question.answers,
                  {
                    id: question.answers.length + 1,
                    text: newAnswer,
                    votes: 0,
                    user: "Current User",
                  },
                ],
              }
            : question
        )
      );
      setNewAnswer("");
    }
  };

  const handleSubmitQuestion = () => {
    if (newQuestionTitle.trim() && newQuestionBody.trim()) {
      const newQuestion = {
        id: questions.length + 1,
        title: newQuestionTitle,
        body: newQuestionBody,
        user: "Current User",
        timestamp: new Date().toISOString(), // Sets current timestamp for the new question
        answers: [],
      };
      setQuestions([...questions, newQuestion]);
      setNewQuestionTitle("");
      setNewQuestionBody("");
    }
  };

  // Sort questions by latest first (most recent timestamp)
  const sortedQuestions = [...questions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Questions</h1>

      {/* Ask a new question form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Ask a new question
        </h2>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter question title"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Enter question details"
            value={newQuestionBody}
            onChange={(e) => setNewQuestionBody(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md mt-4"
          />
          <button
            onClick={handleSubmitQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            Post Question
          </button>
        </div>
      </div>

      {/* Displaying questions */}
      {sortedQuestions.map((question) => (
        <div
          key={question.id}
          className="bg-white shadow-md rounded-lg p-6 mb-6"
        >
          <h2
            className="text-2xl font-semibold text-gray-800 cursor-pointer"
            onClick={() =>
              setSelectedQuestionId(
                question.id === selectedQuestionId ? null : question.id
              )
            }
          >
            {question.title}
          </h2>
          <p className="text-gray-600 mt-2">{question.body}</p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Posted by:</strong> {question.user} |{" "}
            <strong>{new Date(question.timestamp).toLocaleString()}</strong>
          </p>

          {/* Show answers and submit answer form when question is clicked */}
          {selectedQuestionId === question.id && (
            <div>
              {/* Show answers */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Answers:
                </h3>
                {/* Sort answers by votes, highest first */}
                {question.answers
                  .sort((a, b) => b.votes - a.votes)
                  .map((answer) => (
                    <div
                      key={answer.id}
                      className="bg-gray-50 border border-gray-200 p-4 rounded-md mt-4"
                    >
                      <p className="text-gray-800">{answer.text}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">
                          {answer.votes} votes
                        </span>
                        <div>
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                            onClick={() =>
                              handleVote(question.id, answer.id, "up")
                            }
                          >
                            Upvote
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            onClick={() =>
                              handleVote(question.id, answer.id, "down")
                            }
                          >
                            Downvote
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Posted by: {answer.user}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Submit answer form */}
              <div className="mt-4">
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full p-4 border border-gray-300 rounded-md mt-2"
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                  onClick={handleSubmitAnswer}
                >
                  Post Answer
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionAndAnswers;
