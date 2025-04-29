import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../index.css";

export default function MostAvailableBooks() {
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the API base URL
  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    // Set up the SSE connection
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/books/stats/most-borrowed-sse`
    );

    // Handle incoming data
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Make sure data is an array before setting state
        if (Array.isArray(data)) {
          setMostBorrowedBooks(data);
        } else {
          console.error("Received non-array data:", data);
          setMostBorrowedBooks([]); // Set to empty array if not an array
        }
        setLoading(false);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
        setError("Failed to parse data from server");
        setLoading(false);
      }
    };

    // Handle errors
    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setError("Failed to connect to the server. Please try again later.");
      setLoading(false);
      eventSource.close();
    };

    // Cleanup function
    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading popular books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Make sure mostBorrowedBooks is an array before mapping
  const booksToDisplay = Array.isArray(mostBorrowedBooks)
    ? mostBorrowedBooks
    : [];

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Most Popular Books
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {booksToDisplay.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={`${API_BASE_URL}${book.bookImageUrl}`}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-book.jpg"; // Fallback image
                }}
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
              <p className="text-gray-600 mb-1">by {book.author}</p>
              <p className="text-sm text-gray-500 mb-2">
                {book.genre} • {book.category}
              </p>

              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  Borrowed {book.borrowCount} times
                </span>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    book.bookCount > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.bookCount > 0
                    ? `${book.bookCount} available`
                    : "Unavailable"}
                </span>
              </div>

              <Link
                to={`/books/${book._id}`}
                className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {booksToDisplay.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>No borrowing data available yet.</p>
        </div>
      )}
    </div>
  );
}
