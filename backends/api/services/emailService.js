const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <p>Your OTP code for verification is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #000;">${otp}</p>
        <p>This code is valid for 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully.");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = { sendVerificationEmail };
