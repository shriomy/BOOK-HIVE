import React, { useContext, useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { UserContext } from "../../UserContext.jsx";
import { Navigate, useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage = "profile" } = useParams();
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  async function logout() {
    try {
      await axios.post("/logout");
      setRedirect("/");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  async function deleteAccount() {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/auth/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(null);
        setRedirect("/login");
      } catch (error) {
        console.error("Account deletion failed:", error);
        alert("An error occurred while deleting the account.");
      } finally {
        setLoading(false);
      }
    }
  }

  function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    if (ready) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [ready]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3E2723] 70% to-[#000000] 30% z-20">
        <DotLottieReact
          src="https://lottie.host/e01dd401-545e-4152-ad07-1846b8e1ea3d/bgf5mRGQ23.lottie"
          loop
          autoplay
          style={{ width: "200px", height: "200px" }}
        />
      </div>
    );
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  // Navigate on item click
  function handleItemClick(title) {
    switch (title) {
      case "Your Donations":
        navigate("/account/donations"); // Replace with the actual route for donations
        break;
      case "Your Books":
        navigate("/books"); // Replace with the actual route for books
        break;
      case "Software":
        navigate("/software"); // Replace with the actual route for software
        break;
      case "Application":
        navigate("/applications"); // Replace with the actual route for applications
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
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <FaUserCircle className="w-40 h-40 text-white" />
          )}
          <input type="file" className="hidden" onChange={handleAvatarUpload} />
        </label>

        <h2 className="text-2xl font-semibold mt-4">{user.name}</h2>
        <p className="text-white text-sm">{user.email}</p>

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
            onClick={deleteAccount}
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
            onClick={() => handleItemClick(item.title)} // Handle navigation on click
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center border-b-4 hover:shadow-xl transition cursor-pointer"
          >
            <span className="text-4xl">{item.icon}</span>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>

            <div className={`w-full h-1 mt-4 ${item.color}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
