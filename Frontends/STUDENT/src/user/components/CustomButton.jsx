import React from "react";

// Button Component
const CustomButton = ({ text }) => {
  return (
    <button className="relative overflow-hidden bg-[#edab3b] text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-500 ease-in-out transform hover:scale-105 z-10 group">
      <span className="relative z-20">{text} →</span>
      <span className="absolute inset-0 bg-orange-600 origin-bottom transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-10"></span>
    </button>
  );
};

export default CustomButton;
