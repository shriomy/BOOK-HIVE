import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaAnglesUp } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";

export default function Footer() {
  const [isDonationHovered, setIsDonationHovered] = useState(true);
  const [isTopLeftBubbleHovered, setIsTopLeftBubbleHovered] = useState(true);
  const [isBottomLeftBubbleHovered, setIsBottomLeftBubbleHovered] =
    useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <footer className="p-8 bg-black bg-opacity-90 backdrop-blur-md shadow-xl text-white">
        {/* Existing footer content remains the same */}
        {/* ... */}
      </footer>

      {/* Top Left Bubble */}
      <Link
        to="/faq"
        className={`fixed bottom-[calc(16px+110px)] left-6 bg-[#6ddaed] text-[#00032e] hover:bg-[#56c2d9] p-5 rounded-full shadow-xl transition duration-300 flex items-center justify-center 
        ${isTopLeftBubbleHovered ? "z-40" : "z-50"}`}
        style={{ width: "70px", height: "70px" }}
        onMouseEnter={() => setIsTopLeftBubbleHovered(false)}
        onMouseLeave={() => setIsTopLeftBubbleHovered(true)}
      >
        <IoChatboxEllipses className="size-8" />
      </Link>

      {/* Bottom Left Bubble */}
      <Link
        to="/contact"
        className={`fixed bottom-16 left-6 bg-[#ed6d6d] text-[#00032e] hover:bg-[#d95656] p-5 rounded-full shadow-xl transition duration-300 flex items-center justify-center 
        ${isBottomLeftBubbleHovered ? "z-40" : "z-50"}`}
        style={{ width: "70px", height: "70px" }}
        onMouseEnter={() => setIsBottomLeftBubbleHovered(false)}
        onMouseLeave={() => setIsBottomLeftBubbleHovered(true)}
      >
        <IoIosNotifications className="size-8" />
      </Link>

      {/* Donation Bubble (Right Side) */}
      <Link
        to="/donation"
        className={`fixed bottom-16 right-6 bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-5 rounded-full shadow-xl transition duration-300 flex items-center justify-center 
        ${isDonationHovered ? "z-40" : "z-50"}`}
        style={{ width: "90px", height: "90px" }}
        onMouseEnter={() => setIsDonationHovered(false)}
        onMouseLeave={() => setIsDonationHovered(true)}
      >
        <lord-icon
          src="https://cdn.lordicon.com/bdnahcds.json"
          trigger={isDonationHovered ? "loop" : "hover"}
          style={{ width: "55px", height: "55px" }}
        ></lord-icon>
      </Link>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bg-orange-700 bg-opacity-90 text-white p-3 rounded-full shadow-xl transition-all duration-500 ease-in-out flex items-center justify-center 
    ${showScrollTop ? "top-[85vh]" : "top-0 opacity-0 pointer-events-none"}`}
        aria-label="Scroll to top"
      >
        <FaAnglesUp className="size-8" />
      </button>

      <div className="absolute bottom-0 left-0 p-4 text-white text-xs text-center w-full bg-black bg-opacity-70">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  );
}
