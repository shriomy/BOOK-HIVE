import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyTicketsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/contacts/allcontacts")
      .then((response) => {
        setContacts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load tickets.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the table comes into view
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, no need to observe anymore
          observer.disconnect();
        }
      },
      {
        root: null, // viewport
        threshold: 0.1, // Trigger when at least 10% of the element is visible
      }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) {
        observer.disconnect();
      }
    };
  }, [loading]); // Re-run when loading changes to ensure we have the table

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Banner Image */}
        <div className="relative w-full mb-8">
          <img
            src="/images/donation_banner.jpg"
            alt="Donations Banner"
            className="w-full h-56 object-cover rounded-lg shadow-lg"
          />
          <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white bg-black/50 rounded-lg">
            My Tickets
          </h1>
        </div>

        {loading && <div className="text-center text-lg">Loading...</div>}
        {error && (
          <div className="text-center text-lg text-red-500">{error}</div>
        )}

        {!loading && !error && contacts.length === 0 && (
          <div className="text-center text-lg">No tickets available.</div>
        )}

        {!loading && !error && contacts.length > 0 && (
          <div
            ref={tableRef}
            className={`overflow-x-auto transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <table className="w-full border-collapse rounded-lg shadow-lg bg-[#1e1b18]">
              <thead>
                <tr className="bg-[#edbf6d] text-[#00032e] text-lg">
                  <th className="py-3 px-6 text-left">Senders name</th>
                  <th className="py-3 px-6 text-left">Student number</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <tr
                    key={contact._id}
                    onClick={() => navigate(`/contacts/${contact._id}`)}
                    className={`border-b cursor-pointer transition-all duration-200 
                      ${
                        contact.replied
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-yellow-600 hover:bg-yellow-700"
                      }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible
                        ? "translateY(0)"
                        : "translateY(20px)",
                    }}
                  >
                    <td
                      className={`py-4 px-6 ${
                        contact.replied ? "text-white" : ""
                      }`}
                    >
                      {contact.name}
                    </td>
                    <td
                      className={`py-4 px-6 ${
                        contact.replied ? "text-white" : ""
                      }`}
                    >
                      {contact.itNumber}
                    </td>
                    <td
                      className={`py-4 px-6 ${
                        contact.replied ? "text-white" : ""
                      }`}
                    >
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-4 px-6 ${
                        contact.replied ? "text-white" : ""
                      }`}
                    >
                      {contact.replied ? (
                        <span className="inline-block px-2 py-1 bg-green-800 text-white rounded">
                          Replied
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-yellow-800 text-white rounded">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
