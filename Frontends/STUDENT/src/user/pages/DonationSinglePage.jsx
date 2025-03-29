import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import CustomAlert from "../components/CustomAlert"; // Adjust the path as needed
import { jsPDF } from "jspdf"; // Import jsPDF

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

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    if (!donation) return;

    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(62, 33, 11); // Dark brown color
    doc.text("Donation Details", pageWidth / 2, 20, { align: "center" });

    // Add divider
    doc.setDrawColor(237, 191, 109); // Gold color
    doc.setLineWidth(0.5);
    doc.line(20, 25, pageWidth - 20, 25);

    // Set normal text formatting
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Add content with proper spacing
    let yPos = 35;
    const lineHeight = 7;

    // Add donation information
    doc.setFont(undefined, "bold");
    doc.text("Donation ID:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(donationId, 80, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Book Title:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(donation.bookTitle, 80, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Author:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(donation.author, 80, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Genre:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(donation.genre, 80, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Condition:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(donation.condition, 80, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Donor Name:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(donation.donorName, 80, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Donor Contact:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(donation.donorContact, 80, yPos);
    yPos += lineHeight * 1.5;

    // Message section if available
    if (donation.message) {
      doc.setFont(undefined, "bold");
      doc.text("Message:", 20, yPos);
      yPos += lineHeight;
      doc.setFont(undefined, "normal");

      // Split long message text into lines
      const messageLines = doc.splitTextToSize(
        donation.message,
        pageWidth - 40
      );
      doc.text(messageLines, 20, yPos);
      yPos += messageLines.length * lineHeight + 5;
    }

    // Status section
    doc.setFont(undefined, "bold");
    doc.text("Status:", 20, yPos);
    doc.setFont(undefined, "normal");

    // Status with color
    if (donation.verified) {
      doc.setTextColor(0, 128, 0); // Green color for verified
      doc.text("Verified", 80, yPos);
    } else {
      doc.setTextColor(255, 140, 0); // Orange color for unverified
      doc.text("Unverified", 80, yPos);
    }
    yPos += lineHeight * 1.5;

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Add footer with divider
    doc.setDrawColor(237, 191, 109); // Gold color
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += lineHeight;

    // Add download timestamp
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text(`Downloaded on: ${new Date().toLocaleString()}`, 20, yPos);

    // Save the PDF
    doc.save(
      `Donation_${donationId}_${donation.bookTitle.replace(/\s+/g, "_")}.pdf`
    );

    // Show success message
    setAlertConfig({
      show: true,
      message: "Donation details downloaded as PDF successfully.",
      variant: "success",
      onConfirm: null,
    });
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 text-lg">{error}</div>;

  return (
    <div className="min-h-screen text-white flex items-center justify-center py-12 px-4">
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
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/account/donations"
            className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] px-6 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            Back to My Donations
          </Link>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            Download PDF
          </button>

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
