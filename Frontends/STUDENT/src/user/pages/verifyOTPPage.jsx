import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "../components/CustomAlert"; // Import the CustomAlert component

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "danger",
  });
  const navigate = useNavigate();

  // Retrieve userId from localStorage
  const userId = localStorage.getItem("userId");

  const verifyOtp = async (ev) => {
    ev.preventDefault();

    if (!userId) {
      setAlert({
        show: true,
        message: "User ID is missing. Please restart the registration process.",
        variant: "danger",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/verify-otp",
        {
          userId,
          otp,
        }
      );

      console.log(response.data); // Check the response structure

      if (
        response.data.message ===
        "Email verified successfully! Welcome email sent."
      ) {
        setAlert({
          show: true,
          message: "OTP verified successfully! A welcome email has been sent.",
          variant: "success",
        });
        localStorage.removeItem("userId");
        setTimeout(() => {
          navigate("/login"); // Redirect after successful verification
        }, 2000); // Short delay to allow user to see the success message
      } else {
        setAlert({
          show: true,
          message: "Invalid OTP. Please try again.",
          variant: "danger",
        });
      }
    } catch (e) {
      console.error(e); // Log any error details
      setAlert({
        show: true,
        message: e.response?.data?.message || "Error verifying OTP.",
        variant: "danger",
      });
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3E2723] 70% to-[#000000] 30% h-screen overflow-hidden relative">
      <div className="z-10 relative p-10 bg-[#362927] bg-opacity-70 backdrop-blur-md rounded-2xl shadow-xl max-w-lg mx-auto">
        <h1 className="text-4xl text-center text-white font-bold">
          Verify OTP
        </h1>
        <form className="mt-6 space-y-5" onSubmit={verifyOtp}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(ev) => setOtp(ev.target.value)}
              className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
            />
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}

          <button className="w-full p-3 rounded-2xl font-semibold text-lg bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] transition-all shadow-md">
            Verify OTP
          </button>
        </form>
      </div>

      {/* Custom Alert Component */}
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.variant}
        onClose={handleAlertClose}
        autoClose={true}
        duration={5000}
      />
    </div>
  );
}
