import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.scss";
import UserTable from "../../components/user-details-table/userTable";
import Profile from "../../assets/images/profile.png";
import LogoutLogo from "../../assets/svg/logoutLogo.svg";
import AllBooks from "../../components/all-books/allBooks";
import DashboardHome from "../../components/dashboardHome/dashboardHome";
const Dashboard = () => {
  const [isActive, setIsActive] = useState("home");
  const navigate = useNavigate();
  //const [buttonName,setButtonName] = useState('Home');

  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("AdminEmail");

  useEffect(() => {
    const storedName = localStorage.getItem("adminName") || "Admin";
    const storedEmail = localStorage.getItem("adminEmail") || "AdminEmail";
    setAdminName(storedName);
    setAdminEmail(storedEmail);
  }, []);

  const handleClick = (buttonName, path) => {
    setIsActive(buttonName);
    navigate(path); // Navigate to the respective route
  };

  const logout = () => {
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    navigate("/");
  };

  return (
    <div className="abc">
      <Box className="dashboard-container">
        <Box className="menu-container">
          <Link to={"/"} className="flex items-center gap-1  text-[#3e2723]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#edbf6d"
              className="size-8"
            >
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
            <span className="font-bold text-xl">BOOK</span>
            <span className="italic">hive</span>
          </Link>

          <div className="text-[#3e2723] font-bold text-xl flex mb-10 ml-9">
            Dashboard
          </div>

          <Button
            onClick={() => handleClick("home", "")}
            className={`menu-button ${isActive === "home" ? "active" : ""}`}
          >
            Home
          </Button>
          <Button
            onClick={() => handleClick("user", "#")}
            className={`menu-button ${isActive === "user" ? "active" : ""}`}
          >
            All Users
          </Button>
          <Button
            onClick={() => handleClick("books", "#")}
            className={`menu-button ${isActive === "books" ? "active" : ""}`}
          >
            All Books
          </Button>
          <Button
            onClick={() => handleClick("borrow", "#")}
            className={`menu-button ${isActive === "borrow" ? "active" : ""}`}
          >
            Borrow Books
          </Button>
          <Button
            onClick={() => handleClick("account", "#")}
            className={`menu-button ${isActive === "account" ? "active" : ""}`}
          >
            Account Requests
          </Button>
          <Box className="logout">
            <img src={Profile} alt="" className="logout-profile" />
            <Box>
              <Typography className="logout-name">{adminName}</Typography>
              <Typography className="logout-email">{adminEmail}</Typography>
            </Box>
            <img
              src={LogoutLogo}
              alt=""
              className="logout-logo"
              onClick={logout}
            />
          </Box>
        </Box>

        <Box className="dashboard-details">
          <Box className="all-user-head">
            <Box>
              <Typography className="welcome-name">
                Welcome, {adminName}
              </Typography>
              <Typography className="sub-text">
                Monitor all of your projects and tasks here
              </Typography>
            </Box>
            <Box>
              <Typography>SearchBar</Typography>
            </Box>
          </Box>
          {isActive === "home" && <DashboardHome />}
          {isActive === "user" ? <UserTable /> : ""}
          {isActive === "books" ? <AllBooks /> : ""}
          {isActive === "borrow" ? "" : ""}
          {isActive === "account" ? "" : ""}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
