import React, { useState, useEffect } from "react";
import axios from "axios";
import "./userTable.scss";
import Profile from "../../assets/images/profile.png";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import UserDelete from "../../assets/svg/UserDelete.svg";
import ViewInfo from "../../assets/svg/info.svg";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [idCardImage, setIdCardImage] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user", {
          withCredentials: true, // Ensure cookies (JWT) are sent
        });
        setUsers(response.data); // Set the users in the state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to fetch the ID card image and open the modal
  const handleViewIdCard = async (userId) => {
    setOpenModal(true);
    console.log("View ID Card clicked for user:", userId); // Debugging

    try {
      const response = await axios.get(
        `http://localhost:3000/user/${userId}/idcard`, // API endpoint for ID card
        {
          responseType: "arraybuffer", // Important for binary image data
        }
      );

      // Convert the binary data to base64 string
      const base64Image = arrayBufferToBase64(response.data);

      setIdCardImage(base64Image); // Set the image data for rendering
    } catch (error) {
      console.error("Error fetching ID card:", error);
    }
  };

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary); // Convert binary string to base64
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setIdCardImage(null); // Clear the image data
  };

  return (
    <Box>
      <Box className="users-head">
        <Typography>All Users</Typography>
        <Typography>A-Z</Typography>
      </Box>
      <div className="table-container">
        <table className="responsive-table">
          <thead>
            <tr className="tab-hed">
              <th className="table-name">Name</th>
              <th>Date Joined</th>
              <th>Role</th>
              <th>Books Borrowed</th>
              <th>University ID</th>
              <th>University ID Card</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>
                  <Box className="name-cont">
                    <img src={Profile} alt="profile" className="profile-img" />
                    <Box>
                      <Typography className="name-profile">
                        {user.name}
                      </Typography>
                      <Typography className="email-profile">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </td>
                <td>
                  <Typography className="date-field">
                    {new Date(user.createdAt).toDateString()}
                  </Typography>
                </td>
                <td>
                  <Typography className="role-field">{user.role}</Typography>
                </td>
                <td>
                  <Typography className="date-field">
                    {user.booksBorrowed || 0}
                  </Typography>
                </td>
                <td>
                  <Typography className="date-field">
                    {user.idnumber}
                  </Typography>{" "}
                  {/* Displaying ID number */}
                </td>
                <td>
                  <Typography
                    className="id-card-field"
                    onClick={() => handleViewIdCard(user._id)}
                  >
                    View ID Card <img src={ViewInfo} alt="info" />
                  </Typography>
                </td>
                <td>
                  <img src={UserDelete} alt="delete" className="delete-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for showing ID card */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>University ID Card</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center">
            {idCardImage ? (
              <img
                src={`data:image/png;base64,${idCardImage}`} // Ensure the image source is correctly formatted
                alt="ID Card"
                style={{ maxWidth: "100%", maxHeight: "500px" }}
              />
            ) : (
              <Typography>Loading ID Card...</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
