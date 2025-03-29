const Contact = require("../models/Contacts");

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    // Get all contacts, sort by creation date (newest first)
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .populate("donerId", "name email") // Populate user info if needed
      .exec();

    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch contacts", error: error.message });
  }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("donerId", "name email")
      .exec();

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch contact", error: error.message });
  }
};

// Reply to a contact
exports.replyToContact = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        reply: reply,
        replied: true,
      },
      { new: true } // Return the updated document
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error replying to contact:", error);
    res
      .status(500)
      .json({ message: "Failed to reply to contact", error: error.message });
  }
};
