import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import CustomAlert from "../components/CustomAlert"; // Adjust the path as needed

const DonationSinglePage = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom alert states
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    message: "",
    variant: "danger",
    onConfirm: null,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/donations/donation/${donationId}`)
      .then((response) => {
        setDonation(response.data);
        setLoading(false);
      })
      .catch(() => {
        setAlertConfig({
          show: true,
          message: "Failed to load donation details.",
          variant: "danger",
          onConfirm: null,
        });
        setError("Failed to load donation details.");
        setLoading(false);
      });
  }, [donationId]);

  const handleDelete = () => {
    // Show confirmation alert
    setAlertConfig({
      show: true,
      message: "Are you sure you want to delete this donation?",
      variant: "warning",
      onConfirm: async () => {
        try {
          await axios.delete(
            `http://localhost:4000/api/donations/donation/${donationId}`
          );
          navigate("/account/donations");
        } catch (err) {
          // Show error alert
          setAlertConfig({
            show: true,
            message: "Failed to delete donation. Please try again.",
            variant: "danger",
            onConfirm: null,
          });
        }
      },
    });
  };

  // Hide the alert
  const handleCloseAlert = () => {
    setAlertConfig({
      ...alertConfig,
      show: false,
    });
  };

  // Confirm button for alerts that need confirmation
  const handleConfirmAlert = () => {
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    handleCloseAlert();
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 text-lg">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] text-white flex items-center justify-center py-12 px-4">
      {/* Custom Alert for confirmations and notifications */}
      {alertConfig.onConfirm ? (
        // Confirmation alert with buttons
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ display: alertConfig.show ? "flex" : "none" }}
        >
          <div className="bg-[#1e1b18] border border-[#edbf6d] rounded-xl p-6 max-w-md w-full">
            <p className="text-white text-lg mb-6">{alertConfig.message}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseAlert}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAlert}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Simple notification alert
        <CustomAlert
          variant={alertConfig.variant}
          message={alertConfig.message}
          show={alertConfig.show}
          onClose={handleCloseAlert}
          autoClose={true}
          duration={5000}
        />
      )}

      <div className="max-w-3xl w-full bg-[#1e1b18] rounded-2xl shadow-2xl p-8 border border-[#edbf6d]">
        <h1 className="text-4xl font-extrabold text-[#edbf6d] text-center mb-6">
          Donation Details
        </h1>

        {/* Two-column layout until the message part */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <DetailRow label="Book Title" value={donation.bookTitle} />
          <DetailRow label="Author" value={donation.author} />
          <DetailRow label="Genre" value={donation.genre} />
          <DetailRow label="Condition" value={donation.condition} />
          <DetailRow label="Donor Name" value={donation.donorName} />
          <DetailRow label="Donor Contact" value={donation.donorContact} />
        </div>

        {/* Message and status in single-column format */}
        <div className="mt-6 space-y-6">
          {donation.message && (
            <DetailRow label="Message" value={donation.message} />
          )}

          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Status:</span>
            <span
              className={`px-4 py-2 rounded-full text-white text-sm font-bold ${
                donation.verified ? "bg-green-600" : "bg-orange-500"
              }`}
            >
              {donation.verified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <Link
            to="/account/donations"
            className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] px-6 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            Back to My Donations
          </Link>

          {/* Show Delete button only if the donation is unverified */}
          {!donation.verified && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-2xl font-bold transition-all duration-300"
            >
              Delete Donation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable DetailRow component
const DetailRow = ({ label, value }) => (
  <div className="flex flex-col border-b border-gray-600 pb-4">
    <span className="text-lg font-semibold text-[#edbf6d]">{label}:</span>
    <p className="text-gray-300 text-lg">{value}</p>
  </div>
);

export default DonationSinglePage;
