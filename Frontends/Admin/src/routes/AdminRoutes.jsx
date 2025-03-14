import { Routes, Route } from "react-router-dom";

import RegisterPage from "../pages/RegisterPage"; 
import ProfilePage from "../pages/ProfilePage"; 
import Dashboard from "../pages/dashboard/dashboard";
import LoginPage from "../pages/adminLogin/adminLogin";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="/" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="users" element={<ProfilePage />} />
      
    </Routes>
  );
};

export default AdminRoutes;
