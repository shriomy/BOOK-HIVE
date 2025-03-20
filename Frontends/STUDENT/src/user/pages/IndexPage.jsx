import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";
import CustomAlert from "../components/CustomAlert"; // Import the CustomAlert component
import "../../index.css";

export default function IndexPage() {
  const { user } = useContext(UserContext);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
  const { name, email } = user || {};

  // Debug: Check if user is available
  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  // Check for first-time login
  useEffect(() => {
    if (user && !showWelcomeAlert) {
      const userIdentifier = email || user._id || user.username || name;
      console.log("User Identifier:", userIdentifier); // Debug: Check user identifier

      if (userIdentifier) {
        const storageKey = `bookhive_user_${userIdentifier}_logged_in`;
        const hasLoggedInBefore = localStorage.getItem(storageKey);
        console.log("Has Logged In Before:", hasLoggedInBefore); // Debug: Check localStorage

        // Check if the user has logged in before
        if (!hasLoggedInBefore) {
          console.log("First-time login detected"); // Debug: Confirm first-time login
          setShowWelcomeAlert(true);
          localStorage.setItem(storageKey, "true");
        } else {
          console.log("User has logged in before"); // Debug: Confirm returning user
        }
      }
    }
  }, [user, showWelcomeAlert, name, email]);

  // Handle welcome alert close
  const handleWelcomeAlertClose = () => {
    setShowWelcomeAlert(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] 30% h-screen overflow-hidden relative text-white">
      {/* Welcome Alert for first-time login */}
      <CustomAlert
        variant="success"
        message={`Welcome to BookHive, ${
          name || "Book Lover"
        }! Thank you for joining our community. Discover amazing books and connect with fellow readers.`}
        show={showWelcomeAlert}
        onClose={handleWelcomeAlertClose}
        autoClose={true}
        duration={7000} // Show for 7 seconds
      />

      <div>index page</div>
    </div>
  );
}
