import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const bookRefs = useRef([]);

  useEffect(() => {
    // Fetch books data from the backend
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/books");
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching books");
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    // Initialize the Intersection Observer after books are loaded
    if (books.length > 0) {
      bookRefs.current = bookRefs.current.slice(0, books.length);

      const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: "0px",
        threshold: 0.2, // Trigger when 20% of the element is visible/hidden
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // When entering viewport
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-card-visible");
            entry.target.classList.remove("animate-card-hidden");
          }
          // When exiting viewport
          else {
            entry.target.classList.remove("animate-card-visible");
            entry.target.classList.add("animate-card-hidden");
          }
        });
      }, observerOptions);

      // Start observing each book card
      bookRefs.current.forEach((ref) => {
        if (ref) {
          observer.observe(ref);
          // Initialize all cards as hidden
          ref.classList.add("book-card");
        }
      });

      return () => observer.disconnect();
    }
  }, [books]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#edbf6d] text-xl">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <style jsx>{`
        /* Entry animation */
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Exit animation */
        @keyframes fadeSlideDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(30px);
          }
        }

        /* Base state */
        .book-card {
          opacity: 0;
          transform: translateY(30px);
          will-change: opacity, transform;
        }

        /* Visible state */
        .animate-card-visible {
          animation: fadeSlideUp 0.5s forwards;
        }

        /* Hidden state */
        .animate-card-hidden {
          animation: fadeSlideDown 0.5s forwards;
        }

        /* Staggered delays for entry animation */
        .animate-card-visible:nth-child(5n + 1) {
          animation-delay: 0.1s;
        }
        .animate-card-visible:nth-child(5n + 2) {
          animation-delay: 0.2s;
        }
        .animate-card-visible:nth-child(5n + 3) {
          animation-delay: 0.3s;
        }
        .animate-card-visible:nth-child(5n + 4) {
          animation-delay: 0.4s;
        }
        .animate-card-visible:nth-child(5n + 5) {
          animation-delay: 0.5s;
        }

        /* Staggered delays for exit animation */
        .animate-card-hidden:nth-child(5n + 1) {
          animation-delay: 0s;
        }
        .animate-card-hidden:nth-child(5n + 2) {
          animation-delay: 0.05s;
        }
        .animate-card-hidden:nth-child(5n + 3) {
          animation-delay: 0.1s;
        }
        .animate-card-hidden:nth-child(5n + 4) {
          animation-delay: 0.15s;
        }
        .animate-card-hidden:nth-child(5n + 5) {
          animation-delay: 0.2s;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        {/* Category Navigation */}
        <div className="flex justify-center mb-12 overflow-x-auto py-2 border-b border-amber-100">
          <div className="flex space-x-1 md:space-x-3 px-2">
            {[
              "All",
              "Best Sellers",
              "Fantasy",
              "History",
              "Art",
              "Love Stories",
            ].map((category) => (
              <button
                key={category}
                className={`
          px-4 md:px-6 py-3 text-sm md:text-base font-medium
          transition-all duration-300 ease-in-out
          rounded-lg relative overflow-hidden
          ${
            activeCategory === category
              ? "text-white shadow-lg transform scale-105"
              : "text-[#2c1f19] hover:text-[#edbf6d] hover:scale-105"
          }
          before:content-[''] before:absolute before:inset-0 before:rounded-lg
          ${
            activeCategory === category
              ? "before:bg-gradient-to-br before:from-[#2c1f19] before:to-[#5a3e30]"
              : "before:bg-white hover:before:bg-[#faf6f0]"
          }
          before:transition-all before:duration-300
        `}
                onClick={() => handleCategoryChange(category)}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {activeCategory === category && (
                    <span className="inline-block w-1.5 h-1.5 bg-[#edbf6d] rounded-full mr-2 animate-pulse"></span>
                  )}
                  {category}
                </span>

                {activeCategory === category && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-[#edbf6d] rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {books.map((book, index) => (
            <div
              key={book._id}
              ref={(el) => (bookRefs.current[index] = el)}
              className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              {/* Book Image */}
              <div className="h-64 overflow-hidden relative">
                <img
                  src={`http://localhost:4000/api/books/${book._id}/image`}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-book.png"; // Fallback image
                  }}
                />

                {/* Gradient filling overlay that scales from bottom to top */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 origin-bottom transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out opacity-0 group-hover:opacity-90"></div>

                {/* Content that appears on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                  <h2 className="text-xl font-serif mb-2 text-white text-center px-4">
                    {book.title}
                  </h2>
                  <Link
                    to={`/books/${book._id}`}
                    className="text-white font-semibold hover:text-[#2c1f19] transition duration-200 mt-2 border border-white px-4 py-2 hover:border-[#2c1f19]"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Book Information (visible when not hovering) */}
              <div className="p-4 bg-white">
                <p className="text-[#edab3b] uppercase text-xs tracking-wider mb-1">
                  {book.author}
                </p>
                <h2 className="text-xl font-serif mb-2 text-[#2c1f19]">
                  {book.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
