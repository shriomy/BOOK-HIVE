import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../../AdminContext";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import "./adminLogin.scss";
import LibraryImage from "../../assets/images/Library.jpg";
import AlertMessage from "../../components/Alert-message/alertMessage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(AdminContext);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [emailError, setEmailError] = useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validate email format
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Handle login form submission
  const handleLoginSubmit = async (ev) => {
    ev.preventDefault();

    if (!email || !password) {
      setAlertMessage("Email and password are required.");
      setSeverity("error");
      setOpen(true);
      return;
    }

    setAlertMessage("Logging in...");
    setSeverity("info");
    setOpen(true);

    try {
      const { data } = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (data && data.name) {
        setUser(data);
        localStorage.setItem("adminName", data.name);
        localStorage.setItem("adminEmail", data.email);
        setAlertMessage("Login successful");
        setSeverity("success");
        setOpen(true);
        setTimeout(() => setRedirect(true), 2000);
      } else {
        setAlertMessage("Login failed: No user data received");
        setSeverity("error");
        setOpen(true);
      }
    } catch (e) {
      setAlertMessage("Login attempt failed.");
      setSeverity("error");
      setOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Navigate to={"dashboard"} />;
  }

  return (
    <Box className="login-wrapper">
      <Box className="login-container">
        <Box className="login-left">
          <img src={LibraryImage} alt="Library" />
        </Box>
        <Box className="login-right">
          <Box className="form-component">
            <Typography className="text-dashboard">Dashboard</Typography>
            <Box className="book-hive-logo">
              <Link to={"/"} className="flex items-center gap-1 text-[#3e2723]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#edbf6d" className="size-8">
                  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
                <span className="font-bold text-xl">BOOK</span>
                <span className="italic">hive</span>
              </Link>
            </Box>
            <Box>
              <form onSubmit={handleLoginSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                  className="login-input"
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  style={{ marginTop: "10px" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  className="login-btn"
                  style={{ marginTop: "21px" }}
                >
                  Login
                </Button>
              </form>
              <AlertMessage
                open={open}
                onClose={handleCloseAlert}
                message={alertMessage}
                severity={severity}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
