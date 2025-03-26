import React, { useState, useEffect } from "react";
import axios from "axios";
import "./userTable.scss";
import DefaultAvatar from "../../assets/images/profile.png"; // Default avatar image
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  // Function to render profile picture or avatar
  const renderProfilePicture = (user) => {
    if (user.profilePicture) {
      return `http://localhost:3000/user/${user._id}/profile-picture`;
    }
    return DefaultAvatar;
  };

  // Existing methods remain the same...
  const handleViewIdCard = async (userId) => {
    setOpenModal(true);
    console.log("View ID Card clicked for user:", userId);

    try {
      const response = await axios.get(
        `http://localhost:3000/user/${userId}/idcard`,
        {
          responseType: "arraybuffer",
        }
      );

      const base64Image = arrayBufferToBase64(response.data);
      setIdCardImage(base64Image);
    } catch (error) {
      console.error("Error fetching ID card:", error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIdCardImage(null);
  };

  const openDeleteConfirm = (userId) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/user/${userToDelete}`, {
        withCredentials: true,
      });

      setUsers(users.filter((user) => user._id !== userToDelete));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setDeleteConfirmOpen(false);
    }
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
                  <Box className="name-cont" display="flex" alignItems="center">
                    <img
                      src={renderProfilePicture(user)}
                      alt={`${user.name}'s profile`}
                      className="profile-img"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "10px",
                        objectFit: "cover",
                      }}
                    />
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
                {/* Rest of the table row remains the same */}
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
                  </Typography>
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
                  <img
                    src={UserDelete}
                    alt="delete"
                    className="delete-icon"
                    onClick={() => openDeleteConfirm(user._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Existing Modal components remain the same */}
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
                src={`data:image/png;base64,${idCardImage}`}
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
