const Contact = require("../models/Contact");

exports.submitContact = async (req, res) => {
  try {
    const { name, itNumber, email, faculty, specialisation, mobile, message } =
      req.body;

    if (
      !name?.trim() ||
      !itNumber?.trim() ||
      !email?.trim() ||
      !faculty?.trim() ||
      !specialisation?.trim() ||
      !mobile?.trim()
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    const newContact = new Contact({
      name: name.trim(),
      itNumber: itNumber.trim(),
      email: email.trim(), // Added email field
      faculty: faculty.trim(),
      specialisation: specialisation.trim(),
      mobile: mobile.trim(),
      message: message?.trim() || "",
      donerId: req.userId, // Link to signed-in user
    });

    await newContact.save();
    res.status(201).json({ message: "Contact recorded successfully!" });
  } catch (error) {
    console.error("Contact Submission Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

exports.getContacts = async (req, res) => {
  try {
    let contacts;

    if (req.isAdmin) {
      contacts = await Contact.find();
    } else {
      contacts = await Contact.find({ donerId: req.user.id });
    }

    if (contacts.length === 0) {
      return res.status(404).json({ message: "No contacts found." });
    }

    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

// Fetch donation details by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(contact);
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a donation by ID (Only for unverified donations or admins)
// Delete a contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    // Fetch the contact by ID
    const contact = await Contact.findById(contactId); // Changed from donationId to contactId

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Allow deletion if the user is the creator or an admin
    if (contact.donerId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this contact entry",
      });
    }

    // Delete the contact
    await Contact.findByIdAndDelete(contactId);
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Please try again later." });
  }
};

// Add this to your contactController.js
exports.updateContactMessage = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Check if the user is authorized to update this contact
    if (contact.donerId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this contact" });
    }

    // Check if the contact has already been replied to
    if (contact.replied) {
      return res
        .status(403)
        .json({ message: "Cannot update a ticket that has been replied to" });
    }

    // Update the message
    contact.message = message.trim();
    await contact.save();

    res.status(200).json({ message: "Message updated successfully", contact });
  } catch (error) {
    console.error("Error updating contact message:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Please try again later." });
  }
};
