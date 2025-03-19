import { useContext, useState } from "react";

import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";


import { AdminContext } from "../AdminContext.jsx";

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(AdminContext);
  let { subpage = "profile" } = useParams();
  const [redirect, setRedirect] = useState(null);

  async function logout() {
    try {
      await axios.post("http://localhost:3000/logout");
      setRedirect("/");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (!ready) {
    return "loading...";
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}
