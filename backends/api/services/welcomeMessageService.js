const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { generateQRCode } = require("./qrCodeService"); // ✅ Correct import

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (toEmail) => {
  try {
    const qrCodeData = await generateQRCode("Welcome to our service!");
    console.log("Generated QR Code Data:", qrCodeData); // Debugging

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Welcome to our Service",
      html: `
          <div style="font-family: Arial, sans-serif; text-align: center;">
            <h1>Welcome to our Service!</h1>
            <p>We are excited to have you on board.</p>
            <p>Here is your QR code for quick access:</p>
            <img src="cid:qrcode" alt="QR Code" style="width: 200px; height: 200px; border-radius: 10px;"/>
          </div>
        `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeData.split(";base64,").pop(), // Extract Base64 data
          encoding: "base64",
          cid: "qrcode", // Matches img src="cid:qrcode"
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully.");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = { sendWelcomeEmail }; // ✅ Correct export
