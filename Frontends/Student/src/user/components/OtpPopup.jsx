import { useState } from "react";
import axios from "axios";

export default function OtpPopup({ userId, onClose, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verifyOtp = async (ev) => {
    ev.preventDefault();

    if (!userId) {
      setError("User ID is missing. Please restart the registration process.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/verify-otp", {
        userId,
        otp,
      });

      if (response.data.message === "Email verified successfully!") {
        alert("OTP verified successfully!");
        localStorage.removeItem("userId"); // Remove user ID after verification
        onSuccess(); // Close popup & redirect to dashboard
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Error verifying OTP.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#362927] p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Verify OTP
        </h2>
        <form onSubmit={verifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(ev) => setOtp(ev.target.value)}
            className="w-full p-3 rounded-xl bg-[#4a3936] text-white placeholder-gray-300 focus:ring-2 focus:ring-[#edbf6d] focus:outline-none"
          />
          {error && <div className="text-red-500 text-center">{error}</div>}

          <button className="w-full p-3 rounded-2xl font-semibold text-lg bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] transition-all shadow-md">
            Verify OTP
          </button>
        </form>

        <button
          className="mt-4 w-full p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
