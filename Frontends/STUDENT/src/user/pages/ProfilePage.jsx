import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion"; // Add this import for animations

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage = "profile" } = useParams();
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Function to fetch profile picture
  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get("/api/auth/profile-picture", {
        responseType: "blob",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (response.data.size === 0) {
        console.log("No profile picture found");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(response.data);
    } catch (error) {
      console.error("Failed to fetch profile picture:", error);
      if (error.response && error.response.status === 404) {
        console.log("No profile picture exists");
      }
    }
  };

  // Handle avatar upload
  async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        await axios.post("/api/auth/upload-profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const reader = new FileReader();
        reader.onload = () => {
          setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Profile picture upload failed:", error);
        alert("Failed to upload profile picture");
      }
    }
  }

  // Comprehensive user profile and authentication handling
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setRedirect("/login");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        fetchProfilePicture();
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setRedirect("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!user && ready) {
      fetchUserProfile();
    } else if (user) {
      fetchProfilePicture();
      setLoading(false);
    }
  }, [user, ready, setUser]);

  async function logout() {
    try {
      await axios.post("/logout");
      setRedirect("/");
      setUser(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  async function confirmDeleteAccount() {
    try {
      setLoading(true);
      await axios.delete(`/api/auth/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(null);
      localStorage.removeItem("token");
      setRedirect("/login");
    } catch (error) {
      console.error("Account deletion failed:", error);
      alert("An error occurred while deleting the account.");
    } finally {
      setLoading(false);
      setShowPopup(false);
    }
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-2xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // Redirect if no user
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" />;
  }

  function handleItemClick(title) {
    switch (title) {
      case "Your Donations":
        navigate("/account/donations");
        break;
      case "Your Books":
        navigate("/books/borrowed");
        break;
      case "Software":
        navigate("/software");
        break;
      case "Application":
        navigate("/applications");
        break;
      default:
        break;
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const profileVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        duration: 0.7,
      },
    },
  };

  const avatarVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        delay: 0.3,
        duration: 0.8,
      },
    },
  };

  // Gradient colors for cards
  const gradients = [
    "from-orange-500 to-yellow-500",
    "from-blue-500 to-purple-500",
    "from-green-500 to-teal-500",
    "from-pink-500 to-red-500",
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex min-h-screen p-10"
    >
      {/* Left Panel */}
      <motion.div
        variants={profileVariants}
        className="w-1/3 bg-black text-white p-10 rounded-2xl flex flex-col items-center justify-center shadow-lg"
      >
        <motion.div variants={avatarVariants}>
          <label className="relative cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleAvatarUpload}
              accept="image/*"
            />
            {avatar ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={avatar}
                alt="Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              />
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <FaUserCircle
                  className="w-40 h-40 text-white cursor-pointer"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                />
              </motion.div>
            )}
          </label>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-2xl font-semibold mt-4"
        >
          {user?.name || "User"}
        </motion.h2>

        <motion.p variants={itemVariants} className="text-white text-sm">
          {user?.email || "No email"}
        </motion.p>

        <motion.p variants={itemVariants} className="text-lg text-center mt-4">
          I am happy to know you that 300+ projects done successfully!
        </motion.p>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
        >
          LEARN MORE
        </motion.button>

        <motion.div
          variants={itemVariants}
          className="mt-6 w-full flex flex-col gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="bg-white text-blue-600 hover:bg-gray-200 p-2 w-full rounded-2xl"
          >
            Logout
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPopup(true)}
            className="bg-gray-700 text-white hover:bg-gray-600 p-2 w-full rounded-2xl"
          >
            Delete Account
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Panel */}
      <motion.div className="w-2/3 grid grid-cols-2 gap-6 p-6">
        {[
          { title: "Your Donations", color: "border-yellow-500", icon: "💰" },
          { title: "Your Books", color: "border-blue-500", icon: "📚" },
          { title: "Software", color: "border-blue-500", icon: "💻" },
          { title: "Application", color: "border-yellow-500", icon: "📱" },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleItemClick(item.title)}
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center border-b-4 hover:shadow-xl transition cursor-pointer group relative overflow-hidden"
          >
            {/* Gradient fill animation */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} origin-bottom transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out opacity-0 group-hover:opacity-100`}
            ></div>

            {/* Card content with relative positioning to appear above the gradient */}
            <motion.span
              className="text-4xl relative z-10 group-hover:text-white transition-colors duration-300"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 1, delay: index * 0.2 + 1 }}
            >
              {item.icon}
            </motion.span>
            <h3 className="mt-4 text-lg font-semibold relative z-10 group-hover:text-white transition-colors duration-300">
              {item.title}
            </h3>
            <div
              className={`w-full h-1 mt-4 ${item.color} relative z-10`}
            ></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Delete Account Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <h2 className="text-xl font-semibold mb-4">
              Confirm Account Deletion
            </h2>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Delete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
