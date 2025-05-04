import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext"; // Adjust the import path as needed
import "../../index.css";

export default function MostAvailableBooks() {
  const { user } = useContext(UserContext);
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default value will be updated based on user
  const [readyToFilter, setReadyToFilter] = useState(false);

  // Define the API base URL
  const API_BASE_URL = "http://localhost:4000";

  // Define filter categories and their keywords
  const categories = {
    all: { name: "All Books", keywords: [] },
    it: { 
      name: "IT & Computing",
      keywords: [
        "programming", "computer", "software", "development", 
        "web", "database", "network", "security", "cloud", 
        "data", "IT", "information technology", "code", "coding",
        "algorithm", "artificial intelligence", "AI", "machine learning",
        "cybersecurity", "hardware", "system", "admin", "DevOps",
        "frontend", "backend", "fullstack", "javascript", "python",
        "java", "C++", "C#", "ruby", "php", "sql", "nosql",
        "react", "angular", "vue", "node", "blockchain", "crypto"
      ]
    },
    law: {
      name: "Law & Legal Studies",
      keywords: [
        "law", "legal", "legislation", "jurisprudence", "court", "judiciary",
        "criminal", "civil", "constitutional", "rights", "justice", "attorney",
        "lawyer", "advocate", "plaintiff", "defendant", "tort", "contract",
        "property law", "family law", "corporate law", "international law",
        "intellectual property", "patent", "copyright", "trademark", "litigation",
        "judicial", "statute", "regulation", "compliance", "legal case", "precedent"
      ]
    },
    business: {
      name: "Business & Management",
      keywords: [
        "business", "management", "marketing", "finance", "accounting", 
        "economics", "entrepreneur", "strategy", "leadership", "organization",
        "corporate", "startup", "innovation", "investment", "banking",
        "commerce", "trade", "retail", "market", "sales", "advertising",
        "branding", "HR", "human resources", "operations", "logistics",
        "supply chain", "MBA", "administration", "consulting", "negotiation"
      ]
    },
    engineering: {
      name: "Engineering",
      keywords: [
        "engineering", "mechanical", "electrical", "civil", "chemical",
        "industrial", "aerospace", "automotive", "robotics", "manufacturing",
        "materials", "structural", "biomedical", "environmental", "petroleum",
        "construction", "architectural engineering", "systems engineering",
        "electronics", "telecommunications", "hydraulics", "thermodynamics",
        "mechanics", "dynamics", "statics", "fluid mechanics", "circuit",
        "control system", "CAD", "design", "prototype", "testing"
      ]
    },
    architecture: {
      name: "Architecture & Design",
      keywords: [
        "architecture", "architect", "design", "urban planning", "landscape",
        "interior design", "building", "structure", "construction", "sustainable",
        "green building", "LEED", "blueprint", "floor plan", "elevation",
        "rendering", "3D modeling", "BIM", "building code", "residential",
        "commercial", "industrial architecture", "historic preservation",
        "restoration", "facade", "spatial", "architectural theory", "brutalism",
        "modernism", "postmodernism", "classical", "contemporary", "vernacular"
      ]
    }
  };

  // Helper function to determine the user's category based on ID number prefix
  const getUserCategory = (userData) => {
    if (!userData || !userData.id) return "all";
    
    // Get the ID number as a string
    const idString = userData.id.toString();
    
    // Check the prefix of the ID to determine the category
    if (idString.startsWith("IT")) return "it";
    if (idString.startsWith("LAW")) return "law";
    if (idString.startsWith("BUS")) return "business";
    if (idString.startsWith("ENG")) return "engineering";
    if (idString.startsWith("ARCH")) return "architecture";
    
    // Default to all if no match found
    return "all";
  };

  // Set initial category based on user when user data becomes available
  useEffect(() => {
    if (user) {
      const userCategory = getUserCategory(user);
      setSelectedCategory(userCategory);
    }
    setReadyToFilter(true);
  }, [user]);

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
          
          // Initial filtering will happen in another useEffect
          // when both data and user category are ready
        } else {
          console.error("Received non-array data:", data);
          setMostBorrowedBooks([]); // Set to empty array if not an array
          setFilteredBooks([]);
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

  // Function to filter books by category
  const filterBooksByCategory = (books, category) => {
    if (category === "all") {
      return books; // Return all books if "all" is selected
    }
    
    const categoryKeywords = categories[category]?.keywords || [];
    
    return books.filter(book => {
      // Convert all relevant fields to lowercase for case-insensitive matching
      const title = book.title?.toLowerCase() || "";
      const genre = book.genre?.toLowerCase() || "";
      const category = book.category?.toLowerCase() || "";
      const description = book.description?.toLowerCase() || "";
      
      // Check if any of the category keywords are in the book's details
      return categoryKeywords.some(keyword => 
        title.includes(keyword.toLowerCase()) || 
        genre.includes(keyword.toLowerCase()) || 
        category.includes(keyword.toLowerCase()) ||
        description.includes(keyword.toLowerCase())
      );
    });
  };

  // Apply filter when category changes or when books data is loaded
  useEffect(() => {
    if (readyToFilter && mostBorrowedBooks.length > 0) {
      const filtered = filterBooksByCategory(mostBorrowedBooks, selectedCategory);
      setFilteredBooks(filtered);
    }
  }, [selectedCategory, mostBorrowedBooks, readyToFilter]);

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

  // Make sure filteredBooks is an array before mapping
  const booksToDisplay = Array.isArray(filteredBooks) ? filteredBooks : [];

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {selectedCategory === "all" 
          ? "Most Popular Books" 
          : `${categories[selectedCategory].name} Popular Books`}
      </h2>

      <div className="flex justify-center mb-6 flex-wrap gap-2">
        {Object.keys(categories).map((categoryKey) => (
          <button
            key={categoryKey}
            onClick={() => setSelectedCategory(categoryKey)}
            className={`font-semibold py-2 px-4 rounded transition-colors ${
              selectedCategory === categoryKey
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {categories[categoryKey].name}
          </button>
        ))}
      </div>

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
          <p>
            {selectedCategory !== "all"
              ? `No ${categories[selectedCategory].name} books found.`
              : "No borrowing data available yet."}
          </p>
        </div>
      )}
    </div>
  );
}