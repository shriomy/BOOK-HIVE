import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of Link

const MyDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate for redirection

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
                    } hover:bg-[#4a2f27] transition-all duration-200`}
                  >
                    <td className="py-4 px-6">{donation.bookTitle}</td>
                    <td className="py-4 px-6">{donation.author}</td>
                    <td className="py-4 px-6">{donation.genre}</td>
                    <td className="py-4 px-6">
                      {donation.verified ? (
                        <span className="text-white">Verified</span>
                      ) : (
                        <span className="text-white">Unverified</span>
                      )}
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

export default MyDonationsPage;
