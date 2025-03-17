import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import axios from "axios";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const { name } = user || {};

  const logout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full bg-black bg-opacity-60 shadow-lg">
      {/* Main Navbar */}
      <div className="flex justify-between items-center py-4 px-6 border-b">
        {/* Logo and Information */}
        <div className="flex items-center gap-2">
          <div className="w-full h-full flex justify-center items-center text-white">
            <h1 className="font-bold text-center text-4xl">BOOK</h1>
            <span className="italic mt-3 text-2xl">hive</span>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#edbf6d"
                className="size-12"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Information Section in Same Line */}
        <div className="flex items-center gap-6 text-white font-medium">
          <span className="text-xl flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            9:00 AM - 6:00 PM
          </span>
          <span className="text-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            bookhive@gmail.com
          </span>
          <span className="text-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            Contact No: 0114567892
          </span>
        </div>

        {/* User Name Display */}
        <div className="text text-white font-medium">
          {user ? `Welcome, ${name}` : "Welcome to Bookhive"}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex justify-between items-center bg-[#edbf6d] py-4 px-6 shadow-md">
        <div className="flex gap-8 text-black font-semibold">
          <Link
            to="/"
            className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
              isActive("/")
                ? "bg-black text-white scale-105"
                : "hover:text-white"
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
            to="/pricing"
            className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
              isActive("/pricing")
                ? "bg-black text-white scale-105"
                : "hover:text-white"
            }`}
          >
            Pricing
            {isActive("/pricing") && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
            )}
          </Link>
          <Link
            to="/news"
            className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
              isActive("/news")
                ? "bg-black text-white scale-105"
                : "hover:text-white"
            }`}
          >
            News
            {isActive("/news") && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
            )}
          </Link>
          <Link
            to="/shop"
            className={`relative px-4 py-2 rounded-md transition-all duration-500 ease-in-out ${
              isActive("/shop")
                ? "bg-black text-white scale-105"
                : "hover:text-white"
            }`}
          >
            Shop
            {isActive("/shop") && (
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
                onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
              >
                Profile
              </Link>
              <Link
                to="/account/donations"
                className="block py-2 px-4 hover:bg-gray-200 rounded-md transition-colors duration-300"
                onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
              >
                My Donations
              </Link>
              <button
                className="block w-full text-left py-2 px-4 hover:bg-gray-200 rounded-md transition-colors duration-300"
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false); // Close dropdown after logout
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
