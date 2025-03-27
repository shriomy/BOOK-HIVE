import React, { useState, useEffect } from "react";
import axios from "axios";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for filters
  const [nameFilter, setNameFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");

  // Unique faculties for dropdown
  const [uniqueFaculties, setUniqueFaculties] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/api/teachers", {
          headers: {
            Accept: "application/json",
          },
        });

        const fetchedTeachers = response.data.teachers || [];
        setTeachers(fetchedTeachers);
        setFilteredTeachers(fetchedTeachers);

        // Extract unique faculties
        const faculties = [
          ...new Set(fetchedTeachers.map((teacher) => teacher.faculty)),
        ];
        setUniqueFaculties(faculties);

        setIsLoading(false);
      } catch (err) {
        console.error("Detailed error fetching teachers:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        setError(
          err.response?.data || { message: "An unexpected error occurred" }
        );
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filter effect
  useEffect(() => {
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (facultyFilter === "" || teacher.faculty === facultyFilter)
    );
    setFilteredTeachers(filtered);
  }, [nameFilter, facultyFilter, teachers]);

  // Handler for opening email client
  const handleEmailClick = (e, email) => {
    e.stopPropagation(); // Prevent any parent click events
    window.location.href = `mailto:${email}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl text-gray-600">
        Loading teachers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-xl text-red-500">
        Error: {error.message || "Failed to fetch teachers"}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filters Container */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Name Filter */}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Faculty Filter */}
        <div className="flex-grow">
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Faculties</option>
            {uniqueFaculties.map((faculty, index) => (
              <option key={`${faculty}-${index}`} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teachers Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          University Teachers
        </h2>
        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
          Total Teachers: {filteredTeachers.length}
        </span>
      </div>

      {/* Teachers List */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-lg">
          No teachers found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {teacher.name}
              </h3>
              <p
                className="text-gray-600 mb-1 cursor-pointer hover:text-blue-600"
                onClick={(e) => handleEmailClick(e, teacher.email)}
              >
                <span className="font-medium">Email:</span> {teacher.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Faculty:</span>
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {teacher.faculty}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeachersList;
