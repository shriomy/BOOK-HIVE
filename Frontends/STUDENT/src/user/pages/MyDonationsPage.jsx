import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/donations/alldonations")
      .then((response) => {
        setDonations(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load donations.");
        setLoading(false);
      });
  }, []);

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
          <title>My Donations</title>
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
            .verified-row { 
              background-color: rgba(76, 175, 80, 0.5); 
            }
            .unverified-row { 
              background-color: rgba(255, 165, 0, 0.5); 
            }
            .status {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>My Donations</h1>
          <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
          <table>
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${donations
                .map(
                  (donation) => `
                <tr class="${
                  donation.verified ? "verified-row" : "unverified-row"
                }">
                  <td>${donation.bookTitle}</td>
                  <td>${donation.author}</td>
                  <td>${donation.genre}</td>
                  <td class="status">${
                    donation.verified ? "Verified" : "Unverified"
                  }</td>
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
            src="/images/donation_banner.jpg"
            alt="Donations Banner"
            className="w-full h-56 object-cover rounded-lg shadow-lg"
          />
          <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white bg-black/50 rounded-lg">
            My Donations
          </h1>
        </div>

        {loading && <div className="text-center text-lg">Loading...</div>}
        {error && (
          <div className="text-center text-red-500 text-lg">{error}</div>
        )}

        {!loading && !error && donations.length === 0 && (
          <div className="text-center text-lg">No donations available.</div>
        )}

        {!loading && !error && donations.length > 0 && (
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
                    <th className="py-3 px-6 text-left">Book Name</th>
                    <th className="py-3 px-6 text-left">Author</th>
                    <th className="py-3 px-6 text-left">Genre</th>
                    <th className="py-3 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr
                      key={donation._id}
                      onClick={() => navigate(`/donations/${donation._id}`)}
                      className={`border-b border-gray-600 cursor-pointer ${
                        donation.verified ? "bg-[#4CAF50]" : "bg-[#FFA500]"
                      } hover:bg-opacity-80 transition-all duration-200`}
                    >
                      <td className="py-4 px-6 text-white">
                        {donation.bookTitle}
                      </td>
                      <td className="py-4 px-6 text-white">
                        {donation.author}
                      </td>
                      <td className="py-4 px-6 text-white">{donation.genre}</td>
                      <td className="py-4 px-6 text-white">
                        {donation.verified ? (
                          <span className="font-medium">Verified</span>
                        ) : (
                          <span className="font-medium">Unverified</span>
                        )}
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

export default MyDonationsPage;
