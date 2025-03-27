import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000]">
        <div className="text-white text-2xl">Loading...</div>
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#2c1f19] via-[#3e2723] to-[#000000] p-10">
      {/* Left Panel */}
      <div className="w-1/3 bg-black text-white p-10 rounded-2xl flex flex-col items-center justify-center shadow-lg">
        <label className="relative cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleAvatarUpload}
            accept="image/*"
          />
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            />
          ) : (
            <FaUserCircle
              className="w-40 h-40 text-white cursor-pointer"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            />
          )}
        </label>

        <h2 className="text-2xl font-semibold mt-4">{user?.name || "User"}</h2>
        <p className="text-white text-sm">{user?.email || "No email"}</p>

        <p className="text-lg text-center mt-4">
          I am happy to know you that 300+ projects done successfully!
        </p>
        <button className="mt-6 px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition">
          LEARN MORE
        </button>

        <div className="mt-6 w-full flex flex-col gap-2">
          <button
            onClick={logout}
            className="bg-white text-blue-600 hover:bg-gray-200 p-2 w-full rounded-2xl"
          >
            Logout
          </button>
          <button
            onClick={() => setShowPopup(true)}
            className="bg-gray-700 text-white hover:bg-gray-600 p-2 w-full rounded-2xl"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 grid grid-cols-2 gap-6 p-6">
        {[
          { title: "Your Donations", color: "border-yellow-500", icon: "💰" },
          { title: "Your Books", color: "border-blue-500", icon: "📚" },
          { title: "Software", color: "border-blue-500", icon: "💻" },
          { title: "Application", color: "border-yellow-500", icon: "📱" },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item.title)}
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center border-b-4 hover:shadow-xl transition cursor-pointer"
          >
            <span className="text-4xl">{item.icon}</span>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <div className={`w-full h-1 mt-4 ${item.color}`}></div>
          </div>
        ))}
      </div>

      {/* Delete Account Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Confirm Account Deletion
            </h2>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={confirmDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
