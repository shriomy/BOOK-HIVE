import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Check,
  FileText,
  Search,
  Filter,
  X,
} from "lucide-react";

const BorrowBookTable = () => {
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortField, setSortField] = useState("borrowDate");
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    dateRange: { start: "", end: "" },
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch borrowing data from API
  const fetchBorrowings = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        `Fetching borrowings: sort=${sortField}, order=${sortDirection}`
      );

      const response = await fetch(
        `http://localhost:3000/api/borrowings?sort=${sortField}&order=${sortDirection}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      // Transform data to match component structure
      const transformedData = data.map((borrowing) => ({
        id: borrowing._id,
        title: borrowing.book.title,
        coverImage: borrowing.book.bookImage
          ? `data:${borrowing.book.bookImage.contentType};base64,${borrowing.book.bookImage.data}`
          : "http://localhost:3000/books/placeholder/80/120",
        user: {
          name: borrowing.userName,
          email: borrowing.userId,
          avatar: "/books/placeholder/40/40",
        },
        status:
          borrowing.status.charAt(0).toUpperCase() + borrowing.status.slice(1),
        borrowedDate: new Date(borrowing.borrowDate).toLocaleDateString(),
        returnDate: borrowing.returnDate
          ? new Date(borrowing.returnDate).toLocaleDateString()
          : "Not returned",
        dueDate: new Date(
          new Date(borrowing.borrowDate).setDate(
            new Date(borrowing.borrowDate).getDate() + 14
          )
        ).toLocaleDateString(),
      }));

      setBorrowings(transformedData);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setBorrowings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, [sortField, sortDirection]);

  // Toggle dropdown for status selection
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Update borrowing status
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/borrowings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status.toLowerCase(),
            returnDate: status === "Returned" ? new Date() : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Optimistically update local state
      setBorrowings(
        borrowings.map((borrowing) =>
          borrowing.id === id
            ? {
                ...borrowing,
                status: status,
                returnDate:
                  status === "Returned"
                    ? new Date().toLocaleDateString()
                    : borrowing.returnDate,
              }
            : borrowing
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
    setActiveDropdown(null);
  };

  // Generate receipt
  const generateReceipt = async (borrowingId) => {
    try {
      const response = await fetch(
        `/api/books/borrowings/${borrowingId}/receipt`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate receipt");
      }

      const receiptData = await response.json();
      console.log("Receipt generated:", receiptData);
      alert("Receipt generated successfully!");
    } catch (err) {
      console.error("Error generating receipt:", err);
      alert("Failed to generate receipt. Please try again.");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Borrowed":
        return "bg-indigo-100 text-indigo-700";
      case "Late Return":
        return "bg-red-100 text-red-700";
      case "Returned":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Filter logic
  const filteredBorrowings = borrowings.filter((borrowing) => {
    // Search term filter
    const searchMatch =
      borrowing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch =
      filters.status === "" || borrowing.status === filters.status;

    // Date range filter
    let dateMatch = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const borrowDate = new Date(borrowing.borrowedDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      dateMatch = borrowDate >= startDate && borrowDate <= endDate;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Sort function
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "",
      dateRange: { start: "", end: "" },
    });
    setSearchTerm("");
  };

  // Render loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading borrowing records...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-bold mb-4">
          Error Loading Borrowing Records
        </h2>
        <p>Details: {error}</p>
        <button
          onClick={fetchBorrowings}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry Fetching
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-6xl mx-auto">
      {/* Table header and search/filter section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Borrow Book Requests
        </h1>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("borrowedDate")}
        >
          <span className="text-gray-600 mr-1">Oldest to Recent</span>
          {sortDirection === "asc" ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search books or users..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          <span>Filters</span>
          {(filters.status || filters.dateRange.start) && (
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </button>
        {(filters.status || filters.dateRange.start) && (
          <button
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-md"
            onClick={resetFilters}
          >
            <X size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Returned">Returned</option>
                <option value="Late Return">Late Return</option>
              </select>
            </div>
            <div className="w-full md:w-auto flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrow Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: {
                        ...filters.dateRange,
                        start: e.target.value,
                      },
                    })
                  }
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full ">
          <thead className="bg-[#efe5e3] text-[#3e2723] text-left">
            <tr>
              <th className="py-4 px-6 text-left  text-gray-600">
                Book
              </th>
              <th className="py-4 px-6 text-left  text-gray-600">
                User Requested
              </th>
              <th className="py-4 px-6 text-left  text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Borrowed Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="py-4 px-6 text-left  text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("borrowedDate")}
                >
                  Borrowed date
                  {sortField === "borrowedDate" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="py-4 px-6 text-left  text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("returnDate")}
                >
                  Return date
                  {sortField === "returnDate" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="py-4 px-6 text-left  text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                  {sortField === "dueDate" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    ))}
                </div>
              </th>
              <th className="py-4 px-6 text-left  text-gray-600">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {filteredBorrowings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {searchTerm || filters.status || filters.dateRange.start
                    ? "No borrowing records match your search criteria"
                    : "No borrowing records available"}
                </td>
              </tr>
            ) : (
              filteredBorrowings.map((borrowing) => (
                <tr key={borrowing.id} className=" hover:bg-[#f9f5f4]">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img
                        src={borrowing.coverImage}
                        alt={borrowing.title}
                        className="w-12 h-16 object-cover mr-3 rounded"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {borrowing.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {borrowing.user.avatar ? (
                        <img
                          src={borrowing.user.avatar}
                          alt={borrowing.user.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">
                            {borrowing.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {borrowing.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {borrowing.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 relative">
                    <button
                      className={`py-1 px-4 rounded-full text-sm ${getStatusColor(
                        borrowing.status
                      )}`}
                      onClick={() => toggleDropdown(borrowing.id)}
                    >
                      {borrowing.status}
                    </button>
                    {activeDropdown === borrowing.id && (
                      <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-gray-200">
                        {["Pending", "Borrowed", "Returned", "Late Return"].map(
                          (status) => (
                            <div
                              key={status}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                              onClick={() => updateStatus(borrowing.id, status)}
                            >
                              {status === borrowing.status && (
                                <Check size={16} className="mr-1" />
                              )}
                              {status}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {borrowing.borrowedDate}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {borrowing.returnDate}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {borrowing.dueDate}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className={`flex items-center text-sm ${
                        borrowing.status === "Returned" ||
                        borrowing.status === "Pending"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      }`}
                      disabled={
                        borrowing.status === "Returned" ||
                        borrowing.status === "Pending"
                      }
                      onClick={() =>
                        borrowing.status !== "Returned" &&
                        borrowing.status !== "Pending" &&
                        generateReceipt(borrowing.id)
                      }
                    >
                      <FileText size={16} className="mr-1" />
                      <span>Generate</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowBookTable;
