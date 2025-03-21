import { useState, useEffect } from "react";
import "../../index.css";
import axios from "axios";
import CustomAlert from "../components/CustomAlert";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

export default function ContactUsPage() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [name, setName] = useState("");
  const [itNumber, setITnumber] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [faculty, setFaculty] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [specialisationOptions, setSpecialisationOptions] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  // Faculty options
  const facultyOptions = [
    "Faculty of Computing",
    "Faculty of Humanities",
    "Engineering Faculty",
    "School of Architecture",
    "Business School",
  ];

  // Specialisation options by faculty
  const specialisationsByFaculty = {
    "Faculty of Computing": [
      "Information Technology",
      "Software Engineering",
      "Cyber Security",
      "Data Science",
      "Artificial Intelligence",
    ],
    "Faculty of Humanities": [
      "Languages",
      "Psychology",
      "Sociology",
      "History",
      "Philosophy",
    ],
    "Engineering Faculty": [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Chemical Engineering",
      "Materials Engineering",
    ],
    "School of Architecture": [
      "Architectural Design",
      "Urban Planning",
      "Interior Design",
      "Landscape Architecture",
      "Sustainable Design",
    ],
    "Business School": [
      "Finance",
      "Marketing",
      "Human Resources",
      "Operations Management",
      "International Business",
    ],
  };

  // Update specialisation options when faculty changes
  useEffect(() => {
    if (faculty) {
      setSpecialisationOptions(specialisationsByFaculty[faculty] || []);
      setSpecialisation(""); // Reset specialisation when faculty changes
    } else {
      setSpecialisationOptions([]);
    }
  }, [faculty]);

  const handleAlertClose = () => setAlert({ ...alert, show: false });

  // Function to navigate to the tickets page
  const navigateToTickets = () => {
    navigate("/contact/your-tickets");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name,
      itNumber, // Change from studentNumber to itNumber
      email,
      mobile, // Change from phone to mobile
      faculty,
      specialisation,
      message,
      createdAt: new Date().toISOString(),
    };

    if (
      !name ||
      !itNumber ||
      !faculty ||
      !specialisation ||
      !mobile ||
      !email
    ) {
      setAlert({
        show: true,
        message: "All required fields must be filled.",
        variant: "danger",
      });
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/contacts/submit", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAlert({
        show: true,
        message: "Message sent successfully!",
        variant: "success",
      });
      // Reset form after successful submission
      setName("");
      setITnumber("");
      setEmail("");
      setFaculty("");
      setSpecialisation("");
      setMobile("");
      setMessage("");
    } catch (error) {
      setAlert({
        show: true,
        message: "An error occurred while submitting your ticket.",
        variant: "danger",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url(/images/contact_bg.jpg)" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="z-10 text-center text-white w-full max-w-3xl px-6">
        <h1 className="text-3xl font-bold mb-4">Get in Touch...</h1>
        <p className="text-gray-300 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded bg-gray-100 w-full"
            />
            <input
              type="text"
              placeholder="Student Number"
              value={itNumber}
              onChange={(e) => setITnumber(e.target.value)}
              className="p-3 rounded bg-gray-100 w-full"
            />

            {/* Email input field */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded bg-gray-100 w-full"
            />

            <input
              type="text"
              placeholder="Phone"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="p-3 rounded bg-gray-100 w-full"
            />

            {/* Faculty Dropdown */}
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="p-3 rounded bg-gray-100 w-full"
            >
              <option value="">Select Faculty</option>
              {facultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Specialisation Dropdown */}
            <select
              value={specialisation}
              onChange={(e) => setSpecialisation(e.target.value)}
              className="p-3 rounded bg-gray-100 w-full"
              disabled={!faculty}
            >
              <option value="">Select Specialisation</option>
              {specialisationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded bg-gray-100 mt-4 text-black"
            rows="4"
          ></textarea>

          {/* Button container for both buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded w-full"
            >
              Send Message
            </button>

            <button
              type="button"
              onClick={navigateToTickets}
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded w-full"
            >
              View Your Tickets
            </button>
          </div>
        </form>
      </div>
      <CustomAlert
        show={alert.show}
        message={alert.message}
        variant={alert.variant}
        onClose={handleAlertClose}
        autoClose={true}
        duration={5000}
      />
    </div>
  );
}
