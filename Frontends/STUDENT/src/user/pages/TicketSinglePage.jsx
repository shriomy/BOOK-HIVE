import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import CustomAlert from "../components/CustomAlert"; // Adjust the path as needed
import { jsPDF } from "jspdf"; // Import jsPDF

const TicketSinglePage = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");

  // Custom alert states
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    message: "",
    variant: "danger",
    onConfirm: null,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/contacts/contact/${contactId}`)
      .then((response) => {
        setContact(response.data);
        setEditedMessage(response.data.message); // Initialize edited message with current message
        setLoading(false);
      })
      .catch(() => {
        setAlertConfig({
          show: true,
          message: "Failed to load ticket details.",
          variant: "danger",
          onConfirm: null,
        });
        setError("Failed to load ticket details.");
        setLoading(false);
      });
  }, [contactId]);

  const handleDelete = () => {
    // Show confirmation alert
    setAlertConfig({
      show: true,
      message: "Are you sure you want to delete this ticket?",
      variant: "warning",
      onConfirm: async () => {
        try {
          await axios.delete(
            `http://localhost:4000/api/contacts/contact/${contactId}`
          );
          navigate("/contact/your-tickets");
        } catch (err) {
          // Show error alert
          setAlertConfig({
            show: true,
            message: "Failed to delete ticket. Please try again.",
            variant: "danger",
            onConfirm: null,
          });
        }
      },
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're currently editing and clicking cancel, reset the message
      setEditedMessage(contact.message);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/contacts/contact/${contactId}`,
        { message: editedMessage }
      );

      // Update the contact in state with the response
      setContact({ ...contact, message: editedMessage });
      setIsEditing(false);

      // Show success message
      setAlertConfig({
        show: true,
        message: "Your message has been updated successfully.",
        variant: "success",
        onConfirm: null,
      });
    } catch (err) {
      // Show error alert
      setAlertConfig({
        show: true,
        message: "Failed to update message. Please try again.",
        variant: "danger",
        onConfirm: null,
      });
    }
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
    if (!contact) return;

    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(62, 33, 11); // Dark brown color
    doc.text("Ticket Details", pageWidth / 2, 20, { align: "center" });

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

    // Add ticket information
    doc.setFont(undefined, "bold");
    doc.text("ID:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(contactId, 60, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Name:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(contact.name, 60, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("IT Number:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(contact.itNumber, 60, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Faculty:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(contact.faculty, 60, yPos);
    yPos += lineHeight;

    doc.setFont(undefined, "bold");
    doc.text("Specialisation:", 20, yPos);
    doc.setFont(undefined, "normal");
    doc.text(contact.specialisation, 60, yPos);
    yPos += lineHeight * 1.5;

    // Message section with wrapping
    doc.setFont(undefined, "bold");
    doc.text("Your Message:", 20, yPos);
    yPos += lineHeight;
    doc.setFont(undefined, "normal");

    // Split long message text into lines
    const messageLines = doc.splitTextToSize(contact.message, pageWidth - 40);
    doc.text(messageLines, 20, yPos);
    yPos += messageLines.length * lineHeight + 5;

    // Admin reply section if available
    if (contact.reply) {
      doc.setFont(undefined, "bold");
      doc.text("Admin Reply:", 20, yPos);
      yPos += lineHeight;
      doc.setFont(undefined, "normal");

      // Split long reply text into lines
      const replyLines = doc.splitTextToSize(contact.reply, pageWidth - 40);
      doc.text(replyLines, 20, yPos);
      yPos += replyLines.length * lineHeight + 5;
    } else {
      doc.setFont(undefined, "bold");
      doc.text("Status:", 20, yPos);
      doc.setFont(undefined, "normal");
      doc.text("Awaiting Reply", 60, yPos);
      yPos += lineHeight + 5;
    }

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
    doc.save(`Ticket_${contactId}_${contact.name.replace(/\s+/g, "_")}.pdf`);

    // Show success message
    setAlertConfig({
      show: true,
      message: "Ticket details downloaded as PDF successfully.",
      variant: "success",
      onConfirm: null,
    });
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 text-lg">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
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
          Ticket Details
        </h1>

        {/* Two-column layout until the message part */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <DetailRow label="Name" value={contact.name} />
          <DetailRow label="IT Number" value={contact.itNumber} />
          <DetailRow label="Faculty" value={contact.faculty} />
          <DetailRow label="Specialisation" value={contact.specialisation} />

          {/* Editable message section */}
          <div className="sm:col-span-2 flex flex-col border-b border-gray-600 pb-4">
            <span className="text-lg font-semibold text-[#edbf6d]">
              Your Message:
            </span>
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="w-full bg-[#2a2520] text-white border border-gray-600 rounded-lg p-3 min-h-[100px]"
                />
                <div className="flex justify-end space-x-3 mt-3">
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <p className="text-gray-300 text-lg">{contact.message}</p>
                {!contact.replied && (
                  <button
                    onClick={handleEditToggle}
                    className="self-end mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Edit Message
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Admin reply section */}
        <div className="mt-6 space-y-6">
          {contact.reply && (
            <DetailRow label="Admin Reply" value={contact.reply} />
          )}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/contact/your-tickets"
            className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] px-6 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            Back to My Tickets
          </Link>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            Download PDF
          </button>

          {/* Only show delete button if the contact hasn't been replied to */}
          {!contact.replied && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-2xl font-bold transition-all duration-300"
            >
              Delete Ticket
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

export default TicketSinglePage;
