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
/*
// Fetch donation details by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(donation);
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
/*
// Delete a donation by ID (Only for unverified donations or admins)
exports.deleteDonation = async (req, res) => {
  try {
    const donationId = req.params.id;

    // Fetch the donation by ID
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Check if the donation is verified
    if (donation.verified) {
      return res.status(403).json({
        message: "Cannot delete a verified donation",
      });
    }

    // Allow deletion if the user is the donor or an admin
    if (donation.donorId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this donation",
      });
    }

    // Delete the donation
    await Donation.findByIdAndDelete(donationId);

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Please try again later." });
  }
};*/
