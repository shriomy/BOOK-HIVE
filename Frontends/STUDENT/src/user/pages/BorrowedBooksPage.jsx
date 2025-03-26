import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBorrowingsPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/borrowings/myborrowings")
      .then((response) => {
        setBorrowings(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load borrowings.");
        setLoading(false);
      });
  }, []);

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "borrowed":
        return "bg-blue-500";
      case "returned":
        return "bg-green-500";
      case "received":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Banner Image */}
        <div className="relative w-full mb-8">
          <img
            src="/images/borrowings_banner.jpg"
            alt="Borrowings Banner"
            className="w-full h-56 object-cover rounded-lg shadow-lg"
          />
          <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white bg-black/50 rounded-lg">
            My Borrowings History
          </h1>
        </div>

        {loading && <div className="text-center text-lg">Loading...</div>}
        {error && (
          <div className="text-center text-red-500 text-lg">{error}</div>
        )}

        {!loading && !error && borrowings.length === 0 && (
          <div className="text-center text-lg">No borrowings available.</div>
        )}

        {!loading && !error && borrowings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-lg bg-[#1e1b18]">
              <thead>
                <tr className="bg-[#edbf6d] text-[#00032e] text-lg">
                  <th className="py-3 px-6 text-left">Book Title</th>
                  <th className="py-3 px-6 text-left">Author</th>
                  <th className="py-3 px-6 text-left">Genre</th>
                  <th className="py-3 px-6 text-left">Borrow Date</th>
                  <th className="py-3 px-6 text-left">Return Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((borrowing, index) => (
                  <tr
                    key={`${borrowing.bookId}-${index}`}
                    onClick={() => navigate(`/books/${borrowing.bookId}`)}
                    className={`border-b border-gray-600 cursor-pointer ${getStatusColor(
                      borrowing.borrowing.status
                    )} hover:bg-[#4a2f27] transition-all duration-200`}
                  >
                    <td className="py-4 px-6">{borrowing.title}</td>
                    <td className="py-4 px-6">{borrowing.author}</td>
                    <td className="py-4 px-6">{borrowing.genre}</td>
                    <td className="py-4 px-6">
                      {formatDate(borrowing.borrowing.borrowDate)}
                    </td>
                    <td className="py-4 px-6">
                      {borrowing.borrowing.returnDate
                        ? formatDate(borrowing.borrowing.returnDate)
                        : "Not Returned"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white capitalize">
                        {borrowing.borrowing.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBorrowingsPage;
