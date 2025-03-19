import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import axios from "axios";
import NavigationBar from "./NavigationBar"; // Import the new component

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
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

  // Handle scroll event to set sticky state
  useEffect(() => {
    const handleScroll = () => {
      // Set sticky when scrolled 100px or more
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
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
              <a
                href="mailto:bookhive925@gmail.com?subject=Subject&body=Body%20of%20email"
                className="flex items-center gap-2"
              >
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
                bookhive925@gmail.com
              </a>
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
        <NavigationBar
          user={user}
          name={name}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
          logout={logout}
          navigate={navigate}
        />
      </div>

      {/* Sticky Navigation - Shows when scrolled */}
      {isSticky && (
        <div className="fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 ease-in-out">
          <NavigationBar
            user={user}
            name={name}
            toggleDropdown={toggleDropdown}
            isDropdownOpen={isDropdownOpen}
            logout={logout}
            navigate={navigate}
          />
        </div>
      )}
    </>
  );
}
