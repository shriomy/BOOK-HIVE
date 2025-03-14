import { useState } from "react";
import "../../index.css";

import axios from "axios";

export default function DonationPage() {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [condition, setCondition] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorContact, setDonorContact] = useState("");
  const [message, setMessage] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Trim and validate form data
    const formData = {
      bookTitle: bookTitle.trim(),
      author: author.trim(),
      genre: genre.trim(),
      condition: condition.trim(),
      donorName: donorName.trim(),
      donorContact: donorContact.trim(),
      message: message.trim() || "", // Optional field
    };

    // Check if any required fields are empty after trimming
    if (
      !formData.bookTitle ||
      !formData.author ||
      !formData.genre ||
      !formData.condition ||
      !formData.donorName ||
      !formData.donorContact
    ) {
      setErrorMessage("All required fields must be filled.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/donations/donate",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        }
      );

      if (response.data) {
        setDonationSuccess(true);
        setErrorMessage(""); // Clear error message if donation is successful
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("You need to log in before donating a book.");
        window.location.href = "/login"; // Redirect to login page
      } else {
        console.error("Error occurred during donation submission:", error);
        setErrorMessage("An error occurred while submitting your donation.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3E2723] 70% to-[#000000] 30% h-screen overflow-hidden relative">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src="/images/library.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl overflow-hidden gap-20 z-10 relative">
        <div className="mb-30 mt-15 p-10 flex flex-col justify-center bg-[#362927] bg-opacity-70 backdrop-blur-md rounded-2xl shadow-xl max-w-lg mx-auto">
          <h1 className="text-4xl text-center text-white font-bold">
            Donate a Book
          </h1>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Book Title"
                value={bookTitle}
                onChange={(ev) => setBookTitle(ev.target.value)}
                className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(ev) => setAuthor(ev.target.value)}
                className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
              />

              <select
                value={genre}
                onChange={(ev) => setGenre(ev.target.value)}
                className="w-full p-3 rounded-xl bg-[#4a3936] text-white focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Biography">Biography</option>
                <option value="Self-Help">Self-Help</option>
                <option value="History">History</option>
              </select>

              <select
                value={condition}
                onChange={(ev) => setCondition(ev.target.value)}
                className="w-full p-3 rounded-xl bg-[#4a3936] text-white focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
              >
                <option value="">Select Book Condition</option>
                <option value="New">New</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Acceptable">Used - Acceptable</option>
              </select>

              <input
                type="text"
                placeholder="Your Name"
                value={donorName}
                onChange={(ev) => setDonorName(ev.target.value)}
                className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Your Contact Number"
                value={donorContact}
                onChange={(ev) => setDonorContact(ev.target.value)}
                className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
              />

              <textarea
                placeholder="Additional Message"
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-3 w-full rounded-2xl font-medium shadow-md transition-all"
            >
              Submit Donation
            </button>
            {donationSuccess && (
              <div className="text-center text-green-500 mt-4">
                Thank you for your donation!
              </div>
            )}
            {errorMessage && (
              <div className="text-center text-red-500 mt-4">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
