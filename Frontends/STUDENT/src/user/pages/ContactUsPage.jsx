import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function ContactUs() {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    studentNumber: "",
    email: "",
    phone: "",
    faculty: "",
    specialisation: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to the backend to save the form data
      const response = await fetch("http://localhost:4000/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Your message has been sent successfully!");
        setFormData({
          name: "",
          studentNumber: "",
          email: "",
          phone: "",
          faculty: "",
          specialisation: "",
          message: "",
        });
      } else {
        alert("There was an issue submitting your message.");
      }
    } catch (error) {
      alert("There was an error with the request.");
    }
  };

  return (
    <div
      className="bg-gradient-to-r from-blue-500 to-indigo-600 py-20 px-5 bg-cover bg-center"
      style={{ backgroundImage: "url(/images/contact_bg.jpg)" }}
    >
      <div className="flex justify-center gap-8 mb-16">
        {/* Contact Card for Phone */}
        <div className="flex items-center bg-black text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
          <FaPhoneAlt className="text-4xl mr-5" />
          <div>
            <h3 className="text-2xl font-semibold">Talk to Us</h3>
            <p>Toll Free: 1224 2234 ARKITEK</p>
            <p>Fax: 1224 2235 225</p>
          </div>
        </div>

        {/* Contact Card for Email */}
        <a
          href="mailto:admin@gmail.com, support@gmail.com"
          className="flex items-center bg-[#edbf6d] text-black p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <FaEnvelope className="text-4xl mr-5" />
          <div>
            <h3 className="text-2xl font-semibold">Mail Us @</h3>
            <p>admin@gmail.com</p>
            <p>support@gmail.com</p>
          </div>
        </a>

        {/* Contact Card for Location */}
        <a
          href="https://www.google.com/maps/place/Sri+Lanka+Institute+of+Information+Technology/data=!4m2!3m1!1s0x0:0x2c63e344ab9a7536?sa=X&ved=1t:2428&ictx=111"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-black text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <FaMapMarkerAlt className="text-4xl mr-5" />
          <div>
            <h3 className="text-2xl font-semibold">Our Location</h3>
            <p>SLIIT Malabe Campus</p>
            <p>New Kandy Rd, Malabe 10115</p>
          </div>
        </a>
      </div>

      {/* Heading Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-6">Get in Touch...</h2>
        <p className="text-white text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          commodo ligula eget dolor.
        </p>
        <p className="text-white text-lg">
          Cum sociis natoque penatibus et magnis dis parturient montes.
        </p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap justify-center gap-10 mb-12">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border-b-2 w-64 p-3 text-lg focus:outline-none focus:border-[#2c1f19]"
          />
          <input
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleChange}
            placeholder="Student Number"
            className="border-b-2 w-64 p-3 text-lg focus:outline-none focus:border-[#2c1f19]"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-10 mb-12">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border-b-2 w-64 p-3 text-lg focus:outline-none focus:border-[#2c1f19]"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border-b-2 w-64 p-3 text-lg focus:outline-none focus:border-[#2c1f19]"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-10 mb-12">
          <input
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            placeholder="Faculty"
            className="border-b-2 w-64 p-3 text-lg focus:outline-none focus:border-[#2c1f19]"
          />
          <input
            name="specialisation"
            value={formData.specialisation}
            onChange={handleChange}
            placeholder="Specialisation"
            className="border-b-2 w-64 p-3 text-lg focus:outline-none focus:border-[#2c1f19]"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-10 mb-12">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="border-b-2 w-full max-w-3xl p-3 text-lg focus:outline-none focus:border-[#2c1f19]"
          ></textarea>
        </div>

        <div className="flex justify-center mb-12">
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-md text-lg shadow-lg hover:bg-[#edbf6d] transition-all duration-300"
          >
            Send Message
          </button>
        </div>
      </form>

      {/* Button to navigate to submissions */}
      <div className="flex justify-center mb-12">
        <Link to="./tickets">
          <button className="bg-black text-white px-8 py-3 rounded-md text-lg shadow-lg hover:bg-[#edbf6d] transition-all duration-300">
            Go to Your Tickets
          </button>
        </Link>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 text-white">
        <FaFacebook className="text-3xl hover:text-[#2c1f19] transition-all duration-300" />
        <FaInstagram className="text-3xl hover:text-[#2c1f19] transition-all duration-300" />
        <FaPinterest className="text-3xl hover:text-[#2c1f19] transition-all duration-300" />
        <FaTwitter className="text-3xl hover:text-[#2c1f19] transition-all duration-300" />
      </div>
    </div>
  );
}
