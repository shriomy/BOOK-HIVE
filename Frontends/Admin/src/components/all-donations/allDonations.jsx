import React, { useState, useEffect } from "react";
import axios from "axios";
import "./donationTable.scss";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UserDelete from "../../assets/svg/UserDelete.svg";
import ViewInfo from "../../assets/svg/info.svg";

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [idCardImage, setIdCardImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/donations", {
        withCredentials: true,
      });
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleViewIdCard = async (donationId) => {
    setOpenModal(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/donations/${donationId}/idcard`,
        { responseType: "arraybuffer" }
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
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIdCardImage(null);
  };

  const handleActionClick = (event, donation) => {
    setAnchorEl(event.currentTarget);
    setSelectedDonation(donation);
  };

  const handleCloseAction = () => {
    setAnchorEl(null);
    setSelectedDonation(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedDonation) return;
    try {
      await axios.put(
        `http://localhost:5000/api/donations/${selectedDonation._id}/status`,
        { verified: newStatus === "Accepted" },
        { withCredentials: true }
      );
      fetchDonations();
    } catch (error) {
      console.error("Error updating status:", error);
    }
    handleCloseAction();
  };

  const handleDelete = async (donationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/donations/${donationId}`, {
        withCredentials: true,
      });
      fetchDonations();
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };

  return (
    <Box>
      <Box className="donations-head">
        <Typography>All Donations</Typography>
        <Typography>A-Z</Typography>
      </Box>
      <div className="table-container">
        <table className="responsive-table">
          <thead>
            <tr className="tab-hed">
              <th>Book Title</th>
              <th>Author</th>
              <th>Condition</th>
              <th>Donor Name</th>
              <th>Donor Contact</th>
              <th>Message</th>
              <th>Status</th>
              <th>University ID Card</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.bookTitle}</td>
                <td>{donation.author}</td>
                <td>{donation.condition}</td>
                <td>{donation.donorName}</td>
                <td>{donation.donorContact}</td>
                <td>{donation.message}</td>
                <td>
                  <Button
                    variant="contained"
                    color={donation.verified ? "success" : "warning"}
                    onClick={(e) => handleActionClick(e, donation)}
                  >
                    {donation.verified ? "Accepted" : "Pending"}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={
                      Boolean(anchorEl) &&
                      selectedDonation?._id === donation._id
                    }
                    onClose={handleCloseAction}
                  >
                    <MenuItem onClick={() => handleStatusChange("Accepted")}>
                      Accept
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange("Declined")}>
                      Decline
                    </MenuItem>
                  </Menu>
                </td>
                <td>
                  <Typography onClick={() => handleViewIdCard(donation._id)}>
                    View ID Card <img src={ViewInfo} alt="info" />
                  </Typography>
                </td>
                <td>
                  <IconButton onClick={() => handleDelete(donation._id)}>
                    <img
                      src={UserDelete}
                      alt="delete"
                      className="delete-icon"
                    />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    </Box>
  );
};

export default DonationTable;
