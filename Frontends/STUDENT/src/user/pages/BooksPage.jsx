import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch books data from the backend
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/books");
        setBooks(response.data); // Set the fetched books data
        setLoading(false);
      } catch (error) {
        setError("Error fetching books");
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] flex items-center justify-center">
        <div className="text-[#edbf6d] text-xl">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-[#edbf6d]">
          Books List
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book._id}
              className="book-card bg-[#1e1b18] p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
            >
              <img
                src={`http://localhost:4000/api/books/${book._id}/image`}
                alt={book.title}
                className="book-image w-full h-48 object-cover rounded-md mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-book.png"; // Fallback image
                }}
              />
              <h2 className="text-2xl text-[#edbf6d] font-semibold mb-2">
                {book.title}
              </h2>
              <p className="text-lg text-white mb-4">{book.author}</p>
              <Link
                to={`/books/${book._id}`}
                className="text-[#edbf6d] font-semibold hover:text-[#d9a856] transition duration-200"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
