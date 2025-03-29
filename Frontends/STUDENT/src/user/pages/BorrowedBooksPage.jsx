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

  // Function to get CSS class for status in PDF
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "row-pending";
      case "borrowed":
        return "row-borrowed";
      case "returned":
        return "row-returned";
      case "received":
        return "row-received";
      default:
        return "row-other";
    }
  };

  // Function to download PDF
  const downloadPDF = () => {
    // Create a hidden iframe to load the printable version
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();

    // Create a styled HTML document for printing
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Borrowings</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #00032e;
              text-align: center;
              margin-bottom: 10px;
            }
            .date {
              text-align: right;
              margin-bottom: 20px;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #edbf6d;
              color: #00032e;
              padding: 10px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 8px 10px;
              border-bottom: 1px solid #ddd;
              color: #000;
            }
            .row-pending { background-color: rgba(234, 179, 8, 0.5); }
            .row-borrowed { background-color: rgba(59, 130, 246, 0.5); }
            .row-returned { background-color: rgba(34, 197, 94, 0.5); }
            .row-received { background-color: rgba(168, 85, 247, 0.5); }
            .row-other { background-color: rgba(107, 114, 128, 0.5); }
            .status {
              text-transform: capitalize;
              padding: 3px 8px;
              border-radius: 4px;
              display: inline-block;
              color: white;
            }
            .status-pending { background-color: #eab308; }
            .status-borrowed { background-color: #3b82f6; }
            .status-returned { background-color: #22c55e; }
            .status-received { background-color: #a855f7; }
            .status-other { background-color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>My Borrowings History</h1>
          <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${borrowings
                .map(
                  (borrowing) => `
                <tr class="${getStatusClass(borrowing.borrowing.status)}">
                  <td>${borrowing.title}</td>
                  <td>${borrowing.author}</td>
                  <td>${borrowing.genre}</td>
                  <td>${formatDate(borrowing.borrowing.borrowDate)}</td>
                  <td>${
                    borrowing.borrowing.returnDate
                      ? formatDate(borrowing.borrowing.returnDate)
                      : "Not Returned"
                  }</td>
                  <td>
                    <span class="status status-${
                      borrowing.borrowing.status || "other"
                    }">
                      ${borrowing.borrowing.status}
                    </span>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    frameDoc.close();

    // Wait for the iframe to load, then print it to PDF
    printFrame.onload = function () {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        // Remove the iframe after printing dialog is closed
        setTimeout(() => document.body.removeChild(printFrame), 1000);
      } catch (err) {
        console.error("Failed to print:", err);
        alert("Failed to generate PDF. Please try again.");
        document.body.removeChild(printFrame);
      }
    };
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
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={downloadPDF}
                className="bg-[#edbf6d] text-[#00032e] px-4 py-2 rounded-md hover:bg-[#d9a959] transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download as PDF
              </button>
            </div>

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
                      className={`${getStatusColor(
                        borrowing.borrowing.status
                      )} border-b border-gray-600 cursor-pointer hover:bg-opacity-80 transition-all duration-200`}
                    >
                      <td className="py-4 px-6 text-white">
                        {borrowing.title}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {borrowing.author}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {borrowing.genre}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {formatDate(borrowing.borrowing.borrowDate)}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {borrowing.borrowing.returnDate
                          ? formatDate(borrowing.borrowing.returnDate)
                          : "Not Returned"}
                      </td>
                      <td className="py-4 px-6 text-white">
                        <span className="capitalize font-medium">
                          {borrowing.borrowing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBorrowingsPage;
