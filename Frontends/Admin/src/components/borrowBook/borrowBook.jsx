import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Check, FileText, Search, Filter, X } from 'lucide-react';

const BorrowBookTable = () => {
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortField, setSortField] = useState('borrowedDate');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: { start: '', end: '' }
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data from API
  useEffect(() => {
    fetchBooks();
  }, [sortField, sortDirection]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/books?sort=${sortField}&order=${sortDirection}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      // For demo, use sample data when API fails
      setBooks([
        {
          id: 1,
          title: 'The Great Reclamation',
          coverImage: '/api/placeholder/80/120',
          user: {
            name: 'Darrell Steward',
            email: 'steward@gmail.com',
            avatar: '/api/placeholder/40/40'
          },
          status: 'Pending',
          borrowedDate: 'Dec 19 2023',
          returnDate: 'Dec 29 2023',
          dueDate: 'Dec 31 2023'
        },
        {
          id: 2,
          title: 'Inside Evil: Inside Evil...',
          coverImage: '/api/placeholder/80/120',
          user: {
            name: 'Marc Atenson',
            email: 'marcinee@mial.com',
            avatar: '/api/placeholder/40/40'
          },
          status: 'Late Return',
          borrowedDate: 'Dec 21 2024',
          returnDate: 'Jan 17 2024',
          dueDate: 'Jan 12 2024'
        },
        {
          id: 3,
          title: 'Jayne Castle - People i...',
          coverImage: '/api/placeholder/80/120',
          user: {
            name: 'Susan Drake',
            email: 'contact@susandrake.io',
            initials: 'SD'
          },
          status: 'Returned',
          borrowedDate: 'Dec 31 2023',
          returnDate: 'Jan 15 2023',
          dueDate: 'Jan 25 2023'
        },
        {
          id: 4,
          title: 'The Great Reclamation',
          coverImage: '/api/placeholder/80/120',
          user: {
            name: 'David Smith',
            email: 'davide@yahoo.com',
            avatar: '/api/placeholder/40/40'
          },
          status: 'Borrowed',
          borrowedDate: 'Dec 19 2023',
          returnDate: 'Dec 29 2023',
          dueDate: 'Dec 31 2023'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Update book status
  const updateStatus = async (id, status) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      // Update local state
      setBooks(books.map(book =>
        book.id === id ? {...book, status} : book
      ));
    } catch (err) {
      // Handle error (could show a toast notification)
      console.error('Error updating status:', err);
      // For demo, update locally anyway
      setBooks(books.map(book =>
        book.id === id ? {...book, status} : book
      ));
    }
    setActiveDropdown(null);
  };

  // Toggle sort
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Borrowed': return 'bg-indigo-100 text-indigo-700';
      case 'Late Return': return 'bg-red-100 text-red-700';
      case 'Returned': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    // Search term filter
    const searchMatch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = filters.status === '' || book.status === filters.status;

    // Date range filter
    let dateMatch = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const borrowDate = new Date(book.borrowedDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      dateMatch = borrowDate >= startDate && borrowDate <= endDate;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Generate receipt
  const generateReceipt = async (bookId) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/books/${bookId}/receipt`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate receipt');
      }
      const receiptData = await response.json();
      // Handle receipt data (e.g., open in new tab, download, etc.)
      console.log('Receipt generated:', receiptData);
      alert('Receipt generated successfully!');
    } catch (err) {
      console.error('Error generating receipt:', err);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      dateRange: { start: '', end: '' }
    });
    setSearchTerm('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Borrow Book Requests</h1>
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('borrowedDate')}>
          <span className="text-gray-600 mr-1">Oldest to Recent</span>
          {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
            placeholder="Search books, users, or emails..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Returned">Returned</option>
                <option value="Late Return">Late Return</option>
              </select>
            </div>
            <div className="w-full md:w-auto flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">Borrow Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Book</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">User Requested</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Borrowed Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('borrowedDate')}
                >
                  Borrowed date
                  {sortField === 'borrowedDate' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('returnDate')}
                >
                  Return date
                  {sortField === 'returnDate' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date
                  {sortField === 'dueDate' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {searchTerm || filters.status || filters.dateRange.start
                    ? "No books match your search criteria"
                    : "No books available"}
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-12 h-16 object-cover mr-3 rounded"
                      />
                      <span className="text-sm font-medium text-gray-800">{book.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {book.user.avatar ? (
                        <img
                          src={book.user.avatar}
                          alt={book.user.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">{book.user.initials}</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-800">{book.user.name}</div>
                        <div className="text-xs text-gray-500">{book.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 relative">
                    <button
                      className={`py-1 px-4 rounded-full text-sm ${getStatusColor(book.status)}`}
                      onClick={() => toggleDropdown(book.id)}
                    >
                      {book.status}
                    </button>
                    {activeDropdown === book.id && (
                      <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-gray-200">
                        {['Pending', 'Borrowed', 'Returned', 'Late Return'].map((status) => (
                          <div
                            key={status}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                            onClick={() => updateStatus(book.id, status)}
                          >
                            {status === book.status && <Check size={16} className="mr-1" />}
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">{book.borrowedDate}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">{book.returnDate}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">{book.dueDate}</td>
                  <td className="py-4 px-6">
                    <button
                      className={`flex items-center text-sm ${book.status === 'Returned' || book.status === 'Pending' ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800 cursor-pointer'}`}
                      disabled={book.status === 'Returned' || book.status === 'Pending'}
                      onClick={() => (book.status !== 'Returned' && book.status !== 'Pending') && generateReceipt(book.id)}
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
      {/* Pagination could be added here */}
    </div>
  );
};

export default BorrowBookTable;