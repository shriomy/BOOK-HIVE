import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationBar = ({
  user,
  name,
  toggleDropdown,
  isDropdownOpen,
  logout,
  navigate,
}) => {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Handle scroll events to detect when navbar separates from header
  useEffect(() => {
    const handleScroll = () => {
      // You may need to adjust this value based on your header height
      const headerHeight = 100; // Example: adjust to match your main header height

      // Check if we've scrolled past the header
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 left-0 right-0 flex justify-between items-center py-4 px-6 shadow-md w-full transition-all duration-500 ease-in-out z-50 ${
        isSticky ? "bg-white bg-opacity-50 backdrop-blur-md" : "bg-[#edbf6d]"
      }`}
    >
      <div className="flex gap-8 text-black font-semibold">
        <Link
          to="/"
          className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
            isActive("/") ? "bg-black text-white scale-105" : "hover:text-white"
          }`}
        >
          Home
          {isActive("/") && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
          )}
        </Link>
        <Link
          to="/about"
          className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
            isActive("/about")
              ? "bg-black text-white scale-105"
              : "hover:text-white"
          }`}
        >
          About Us
          {isActive("/about") && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
          )}
        </Link>
        <Link
          to="/feedback"
          className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
            isActive("/feedback")
              ? "bg-black text-white scale-105"
              : "hover:text-white"
          }`}
        >
          Feedback
          {isActive("/feedback") && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
          )}
        </Link>
        <Link
          to="/books"
          className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
            isActive("/books")
              ? "bg-black text-white scale-105"
              : "hover:text-white"
          }`}
        >
          Books
          {isActive("/books") && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
          )}
        </Link>
        <Link
          to="/contact"
          className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
            isActive("/contact")
              ? "bg-black text-white scale-105"
              : "hover:text-white"
          }`}
        >
          Contact
          {isActive("/contact") && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
          )}
        </Link>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={user ? toggleDropdown : () => navigate("/login")}
          className="bg-orange-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-black transition-all duration-300 flex items-center gap-2"
        >
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>

          {/* Text */}
          {user ? name : "Login"}
        </button>

        {isDropdownOpen && user && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
            <Link
              to="/account"
              className="block py-2 px-4 hover:bg-gray-200 rounded-md transition-colors duration-300"
              onClick={() => toggleDropdown()} // Close dropdown on click
            >
              Profile
            </Link>
            <Link
              to="/account/donations"
              className="block py-2 px-4 hover:bg-gray-200 rounded-md transition-colors duration-300"
              onClick={() => toggleDropdown()} // Close dropdown on click
            >
              My Donations
            </Link>
            <button
              className="block w-full text-left py-2 px-4 hover:bg-gray-200 rounded-md transition-colors duration-300"
              onClick={() => {
                logout();
                toggleDropdown(); // Close dropdown after logout
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
