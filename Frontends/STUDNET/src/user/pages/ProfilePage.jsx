import React, { useContext, useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { UserContext } from "../../UserContext.jsx";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage = "profile" } = useParams();
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);

  async function logout() {
    try {
      await axios.post("/logout");
      setRedirect("/");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function deleteAccount() {
    alert("Account deletion feature coming soon!");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3E2723] 70% to-[#000000] 30% overflow-hidden relative p-4">
      <div className="w-full max-w-md bg-[#3E2723] shadow-lg rounded-2xl p-6 text-center flex flex-col items-center text-[#edbf6d]">
        <label className="relative cursor-pointer">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#edbf6d]"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-[#edbf6d]" />
          )}
          <input type="file" className="hidden" onChange={handleAvatarUpload} />
        </label>

        <h2 className="text-2xl font-semibold mt-4">{user.name}</h2>
        <p className="text-[#d9a856] text-sm">{user.email}</p>

        <div className="mt-6 w-full flex flex-col gap-2">
          <button
            onClick={logout}
            className="bg-[#edbf6d] text-[#00032e] hover:bg-[#d9a856] p-2 w-full rounded-2xl"
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
    </div>
  );
}
