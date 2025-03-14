import React, { useState } from "react";

export default function Help() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("Feedback submitted! Thank you.");
    setFeedback("");
    setIsOpen(false);
  }

  return (
    <div className="fixed right-0 top-1/3 flex flex-col items-end z-50">
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-2 px-4 rounded-l-2xl shadow-lg"
      >
        Feedback
      </button>

      {/* Feedback Form */}
      {isOpen && (
        <div className="bg-black text-[#edbf6d] w-72 p-4 rounded-2xl shadow-xl mt-2">
          <h3 className="text-lg font-semibold mb-2">Your Feedback</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-2 bg-black text-white rounded-xl border-none focus:ring-2 focus:ring-[#edbf6d]"
              rows="4"
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-2 w-full rounded-2xl mt-2"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
