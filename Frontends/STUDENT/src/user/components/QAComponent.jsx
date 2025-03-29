import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext"; // Import UserContext for authentication

const QAComponent = ({ bookId }) => {
  const [questions, setQuestions] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQAVisible, setIsQAVisible] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  const { user } = useContext(UserContext); // Get logged-in user

  // Handle content height for animation
  useEffect(() => {
    if (contentRef.current) {
      setHeight(isQAVisible ? contentRef.current.scrollHeight : 0);
    }
  }, [isQAVisible, questions, selectedQuestionId]);

  // Fetch questions specific to this book
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/questions/book/${bookId}`
        );
        setQuestions(response.data);
        setError(null);
      } catch (err) {
        setError("Error fetching questions. Please try again later.");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchQuestions();
    }
  }, [bookId]);

  const handleVote = async (questionId, answerId, type) => {
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:4000/api/questions/${questionId}/answers/${answerId}/vote`,
        { type }
      );

      // Update the questions state with the updated question
      setQuestions(
        questions.map((q) => (q._id === questionId ? response.data : q))
      );
    } catch (err) {
      setError("Error voting on answer. Please try again.");
      console.error("Error voting:", err);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      alert("You must be logged in to submit an answer.");
      return;
    }

    if (newAnswer.trim() && selectedQuestionId !== null) {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/questions/${selectedQuestionId}/answers`,
          {
            text: newAnswer,
            user: user.name, // Use the actual user name
          }
        );

        // Update the questions state with the updated question
        setQuestions(
          questions.map((q) =>
            q._id === selectedQuestionId ? response.data : q
          )
        );
        setNewAnswer("");
      } catch (err) {
        setError("Error submitting answer. Please try again.");
        console.error("Error submitting answer:", err);
      }
    }
  };

  const handleSubmitQuestion = async () => {
    if (!user) {
      alert("You must be logged in to ask a question.");
      return;
    }

    if (newQuestionTitle.trim() && newQuestionBody.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/questions`,
          {
            title: newQuestionTitle,
            body: newQuestionBody,
            user: user.name, // Use the actual user name
            bookId: bookId, // Associate the question with this book
          }
        );

        // Add the new question to the questions state
        setQuestions([response.data, ...questions]);
        setNewQuestionTitle("");
        setNewQuestionBody("");
      } catch (err) {
        setError("Error submitting question. Please try again.");
        console.error("Error submitting question:", err);
      }
    }
  };

  const toggleQAVisibility = () => {
    setIsQAVisible(!isQAVisible);
  };

  return (
    <div className="mt-10">
      <h2
        className="text-2xl text-[#edbf6d] font-bold mb-4 cursor-pointer flex items-center"
        onClick={toggleQAVisibility}
      >
        Questions & Answers
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`ml-2 size-6 transform transition-transform duration-300 ${
            isQAVisible ? "rotate-180" : ""
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
        className="qa-content"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Ask a new question form */}
        <div className="bg-[#2c1f19] rounded-lg p-6 mb-6 animate-fadeIn">
          <h2 className="text-xl font-semibold text-[#edbf6d]">
            Ask a new question
          </h2>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter question title"
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
              className="w-full p-4 border border-[#edbf6d] bg-[#1e1b18] text-white rounded-md"
            />
            <textarea
              placeholder="Enter question details"
              value={newQuestionBody}
              onChange={(e) => setNewQuestionBody(e.target.value)}
              className="w-full p-4 border border-[#edbf6d] bg-[#1e1b18] text-white rounded-md mt-4"
            />
            <button
              onClick={handleSubmitQuestion}
              className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-2 w-full rounded-2xl text-center font-semibold transition-all duration-200 mt-4"
            >
              Post Question
            </button>
          </div>
        </div>

        {/* Displaying questions */}
        {loading ? (
          <div className="text-center text-[#edbf6d] p-4">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center text-gray-400 p-4">
            No questions yet. Be the first to ask!
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question._id}
              className="bg-[#2c1f19] rounded-lg p-6 mb-6 animate-fadeIn"
            >
              <h2
                className="text-xl font-semibold text-[#edbf6d] cursor-pointer flex justify-between items-center"
                onClick={() =>
                  setSelectedQuestionId(
                    question._id === selectedQuestionId ? null : question._id
                  )
                }
              >
                <span>{question.title}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`ml-2 size-6 transform transition-transform duration-300 ${
                    selectedQuestionId === question._id ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </h2>
              <p className="text-white mt-2">{question.body}</p>
              <p className="text-sm text-gray-400 mt-2">
                <strong>Posted by:</strong> {question.user} |{" "}
                <strong>{new Date(question.timestamp).toLocaleString()}</strong>
              </p>

              {/* Show answers and submit answer form when question is clicked */}
              {selectedQuestionId === question._id && (
                <div className="mt-6 animate-fadeIn">
                  {/* Show answers */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#edbf6d]">
                      Answers:
                    </h3>
                    {question.answers && question.answers.length > 0 ? (
                      // Sort answers by votes, highest first
                      question.answers
                        .sort((a, b) => b.votes - a.votes)
                        .map((answer, index) => (
                          <div
                            key={answer._id}
                            className="bg-[#1e1b18] border border-[#3e2723] p-4 rounded-md mt-4 animate-fadeIn"
                            style={{
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            <p className="text-white">{answer.text}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-gray-400">
                                {answer.votes} votes
                              </span>
                              <div>
                                <button
                                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 transition-colors duration-200"
                                  onClick={() =>
                                    handleVote(question._id, answer._id, "up")
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6"
                                  >
                                    <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                  </svg>
                                </button>
                                <button
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                                  onClick={() =>
                                    handleVote(question._id, answer._id, "down")
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6"
                                  >
                                    <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                                  </svg>
                                </button>
                              </div>
                              <p className="text-sm text-gray-400">
                                Posted by: {answer.user}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="mt-2 text-gray-400">No answers yet.</p>
                    )}
                  </div>

                  {/* Submit answer form */}
                  <div className="mt-4">
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full p-4 border border-[#edbf6d] bg-[#1e1b18] text-white rounded-md mt-2"
                    />
                    <button
                      className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-2 w-full rounded-2xl text-center font-semibold transition-all duration-200 mt-2"
                      onClick={handleSubmitAnswer}
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QAComponent;
