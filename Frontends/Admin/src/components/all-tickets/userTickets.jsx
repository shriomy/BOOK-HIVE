import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply"; // Using MUI icons instead of SVG
import InfoIcon from "@mui/icons-material/Info"; // Using MUI icons instead of SVG
import "./userTickets.scss"; // You'll need to create this file with the styles

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [viewMessageOpen, setViewMessageOpen] = useState(false);

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/contacts", {
          withCredentials: true, // Ensure cookies (JWT) are sent
        });
        setContacts(response.data); // Set the contacts in the state
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleViewMessage = (contact) => {
    setCurrentContact(contact);
    setViewMessageOpen(true);
  };

  const handleOpenReplyDialog = (contact) => {
    setCurrentContact(contact);
    setReplyMessage(contact.reply || ""); // Pre-fill with existing reply if any
    setReplyDialogOpen(true);
  };

  const handleSubmitReply = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/contacts/${currentContact._id}/reply`,
        {
          reply: replyMessage,
        },
        {
          withCredentials: true,
        }
      );

      // Update the contacts list with the updated contact
      setContacts(
        contacts.map((contact) =>
          contact._id === currentContact._id
            ? { ...contact, replied: true, reply: replyMessage }
            : contact
        )
      );

      setReplyDialogOpen(false);
      setReplyMessage("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <Box>
      <Box className="contacts-head">
        <Typography>All Contact Requests</Typography>
        <Typography>Recent first</Typography>
      </Box>
      <div className="table-container">
        <table className="responsive-table">
          <thead>
            <tr className="tab-hed">
              <th className="table-name">Name</th>
              <th>IT Number</th>
              <th>Email</th>
              <th>Faculty</th>
              <th>Specialisation</th>
              <th>Mobile</th>
              <th>Date Submitted</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr
                key={contact._id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>
                  <Typography className="name-field">{contact.name}</Typography>
                </td>
                <td>
                  <Typography className="it-number-field">
                    {contact.itNumber}
                  </Typography>
                </td>
                <td>
                  <Typography className="email-field">
                    {contact.email}
                  </Typography>
                </td>
                <td>
                  <Typography className="faculty-field">
                    {contact.faculty}
                  </Typography>
                </td>
                <td>
                  <Typography className="specialisation-field">
                    {contact.specialisation}
                  </Typography>
                </td>
                <td>
                  <Typography className="mobile-field">
                    {contact.mobile}
                  </Typography>
                </td>
                <td>
                  <Typography className="date-field">
                    {new Date(contact.createdAt).toDateString()}
                  </Typography>
                </td>
                <td>
                  <Box
                    className="message-field"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewMessage(contact)}
                  >
                    <Typography>View Message</Typography>
                    <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                  </Box>
                </td>
                <td>
                  <Typography
                    className={`status-field ${
                      contact.replied ? "replied" : "pending"
                    }`}
                  >
                    {contact.replied ? "Replied" : "Pending"}
                  </Typography>
                </td>
                <td>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenReplyDialog(contact)}
                    size="small"
                  >
                    <ReplyIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Message Dialog */}
      <Dialog
        open={viewMessageOpen}
        onClose={() => setViewMessageOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Contact Message</DialogTitle>
        <DialogContent>
          {currentContact && (
            <Box>
              <Typography variant="h6">From: {currentContact.name}</Typography>
              <Typography variant="subtitle1" mb={2}>
                IT Number: {currentContact.itNumber}
              </Typography>
              <Typography variant="body1" paragraph>
                {currentContact.message}
              </Typography>

              {currentContact.replied && (
                <Box mt={3}>
                  <Typography variant="h6">Your Reply:</Typography>
                  <Typography variant="body1" paragraph>
                    {currentContact.reply}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewMessageOpen(false)} color="primary">
            Close
          </Button>
          {currentContact && !currentContact.replied && (
            <Button
              onClick={() => {
                setViewMessageOpen(false);
                handleOpenReplyDialog(currentContact);
              }}
              color="primary"
              variant="contained"
            >
              Reply
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Reply to Contact</DialogTitle>
        <DialogContent>
          {currentContact && (
            <Box>
              <Typography variant="h6" mb={2}>
                Replying to: {currentContact.name}
              </Typography>
              <Typography variant="subtitle1" mb={2}>
                Original message:
              </Typography>
              <Typography variant="body2" mb={3} color="textSecondary">
                {currentContact.message}
              </Typography>
              <TextField
                label="Your Reply"
                multiline
                rows={6}
                fullWidth
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReply}
            color="primary"
            variant="contained"
            disabled={!replyMessage.trim()}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactTable;
