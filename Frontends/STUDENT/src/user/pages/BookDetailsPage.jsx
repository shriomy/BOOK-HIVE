import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookDetailsPage = () => {
  const { id } = useParams(); // Get the book ID from URL params
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch book data by ID
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/books/${id}`
        );
        setBook(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching book details");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <div className="text-center text-xl text-[#edbf6d]">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] py-12">
      {book && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#1e1b18] p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-[#edbf6d] mb-6 text-center">
              {book.title}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={`http://localhost:4000/${book.bookImage}`}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="text-white">
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Author:</strong>{" "}
                  {book.author}
                </p>
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Genre:</strong>{" "}
                  {book.genre}
                </p>
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Category:</strong>{" "}
                  {book.category}
                </p>
                <p className="text-lg mb-4">
                  <strong className="text-[#edbf6d]">Book Count:</strong>{" "}
                  {book.bookCount}
                </p>
                <div className="flex justify-center">
                  <a
                    href="#"
                    className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-2 w-full rounded-2xl text-center font-semibold transition-all duration-200"
                  >
                    Borrow Book
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
