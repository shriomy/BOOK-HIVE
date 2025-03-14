import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext({});

export function AdminContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile")
      .then(({ data }) => {
        setUser(data);
        setReady(true);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setReady(true); // Ensure `ready` is set to true even on error to avoid hanging state
      });
  }, []);

  return (
    <AdminContext.Provider value={{ user, setUser, ready }}>
      {children}
    </AdminContext.Provider>
  );
}
