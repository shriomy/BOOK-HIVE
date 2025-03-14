const qrcode = require("qrcode"); // Import QR code library

// Function to generate QR code
const generateQRCode = async (data) => {
  try {
    const qrCodeData = await qrcode.toDataURL(data); // Generate QR code as a Base64 URL
    return qrCodeData;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

module.exports = { generateQRCode }; // ✅ Correct export
