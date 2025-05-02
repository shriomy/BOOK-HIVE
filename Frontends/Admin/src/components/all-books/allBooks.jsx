import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Chip,
  Tooltip,
  Paper,
  Fade,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import edit from "../../assets/svg/edit.svg";
import UserDelete from "../../assets/svg/UserDelete.svg";
import trash from "../../assets/svg/trash.svg";

// Styled Components
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    padding: "20px",
    borderRadius: "12px",
    background: "#f9f9f9",
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  padding: "8px 16px",
  backgroundColor: "#3e2723",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#2c1e1a",
  },
});

const SearchField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "24px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.16)",
    },
  },
});

const CategoryChip = styled(Chip)({
  margin: "0 4px",
  fontWeight: "500",
  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
});

const BookCountChip = styled(Chip)({
  backgroundColor: "#e0f2f1",
  color: "#00796b",
  fontWeight: "bold",
});

const BooksTable = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [bookCover, setBookCover] = useState(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    category: "",
    bookCount: "",
    bookImage: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, searchBy, books]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/books");
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch books. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
      return;
    }

    const query = searchQuery.toLowerCase();
    let filtered;

    if (searchBy === "all") {
      filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query)
      );
    } else {
      filtered = books.filter((book) =>
        book[searchBy].toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleViewCover = async (bookId) => {
    setOpenCoverModal(true);
    setCoverLoading(true);
    setBookCover(null);

    try {
      const response = await axios.get(
        `http://localhost:3000/books/${bookId}/cover`,
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setBookCover(imageUrl);
    } catch (error) {
      console.error("Error fetching book cover:", error);
    } finally {
      setCoverLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewBook({ ...newBook, bookImage: file });
  };

  const handleAddBook = async () => {
    try {
      // Check if a book with the same title already exists
      const existingBook = books.find(
        (book) => book.title.toLowerCase() === newBook.title.toLowerCase()
      );

      if (existingBook) {
        // If the book exists, increase its count
        const updatedBookCount =
          parseInt(existingBook.bookCount) + parseInt(newBook.bookCount || 1);

        // Update the existing book
        await axios.put(
          `http://localhost:3000/books/${existingBook._id}`,
          { bookCount: updatedBookCount },
          { headers: { "Content-Type": "application/json" } }
        );

        fetchBooks();
        setOpenAddModal(false);
        setNewBook({
          title: "",
          author: "",
          genre: "",
          category: "",
          bookCount: "",
          bookImage: "",
        });
        setSnackbar({
          open: true,
          message: "Book count updated successfully!",
          severity: "success",
        });
      } else {
        // If the book doesn't exist, create a new entry
        const formData = new FormData();
        Object.entries(newBook).forEach(([key, value]) => {
          formData.append(key, value);
        });

        await axios.post("http://localhost:3000/books", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fetchBooks();
        setOpenAddModal(false);
        setNewBook({
          title: "",
          author: "",
          genre: "",
          category: "",
          bookCount: "",
          bookImage: "",
        });
        setSnackbar({
          open: true,
          message: "Book added successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setSnackbar({
        open: true,
        message: "Failed to add book. Please try again.",
        severity: "error",
      });
    }
  };

  const handleEditClick = (book) => {
    setEditBook(book);
    setOpenEditModal(true);
  };

  const handleUpdateBook = async () => {
    try {
      const formData = new FormData();

      // Add all text fields
      formData.append("title", editBook.title);
      formData.append("author", editBook.author);
      formData.append("category", editBook.category);
      formData.append("genre", editBook.genre);
      formData.append("bookCount", editBook.bookCount);

      // Add the image file if it exists
      if (editBook.bookImage && editBook.bookImage instanceof File) {
        formData.append("bookImage", editBook.bookImage);
      }

      // Send as multipart/form-data
      await axios.put(`http://localhost:3000/books/${editBook._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchBooks();
      setOpenEditModal(false);
      setSnackbar({
        open: true,
        message: "Book updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating book:", error);
      setSnackbar({
        open: true,
        message: "Failed to update book. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/books/${bookToDelete._id}`);
      fetchBooks();
      setOpenDeleteModal(false);
      setSnackbar({
        open: true,
        message: "Book deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete book. Please try again.",
        severity: "error",
      });
    }
  };

  // Clean up object URL when modal closes
  const handleCloseCoverModal = () => {
    setOpenCoverModal(false);
    if (bookCover) {
      URL.revokeObjectURL(bookCover);
      setBookCover(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      Fiction: "#b39ddb",
      "Non-Fiction": "#90caf9",
      Biography: "#80deea",
      History: "#a5d6a7",
      Science: "#ffe082",
      Fantasy: "#ffab91",
      Mystery: "#ef9a9a",
      Romance: "#f48fb1",
      Thriller: "#ce93d8",
      Poetry: "#c5e1a5",
      Philosophy: "#9fa8da",
    };

    return colorMap[category] || "#e0e0e0";
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#3e2723] flex items-center">
          <span className="mr-2">📚</span>
          Library Collection
        </h2>
        <StyledButton variant="contained" onClick={() => setOpenAddModal(true)}>
          + Add Book
        </StyledButton>
      </div>

      {/* Search and Filter Section */}
      <Paper
        elevation={2}
        className="mb-6 p-4 rounded-xl"
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <SearchField
            fullWidth
            variant="outlined"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="text-gray-400">🔍</span>
                </InputAdornment>
              ),
            }}
          />
          <FormControl variant="outlined" sx={{ minWidth: 180 }}>
            <InputLabel id="search-by-label">
              <div className="flex items-center">
                <span className="mr-1">🔣</span>
                Search by
              </div>
            </InputLabel>
            <Select
              labelId="search-by-label"
              value={searchBy}
              onChange={handleSearchByChange}
              label="Search by"
              size="medium"
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value="all">All Fields</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="genre">Genre</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Paper>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <CircularProgress color="inherit" />
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#efe5e3] text-[#3e2723] text-left">
                <th className="p-4 rounded-tl-lg">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Category</th>
                <th className="p-4">Genre</th>
                <th className="p-4">Book Count</th>
                <th className="p-4">Book Cover</th>
                <th className="p-4 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr
                  key={book._id}
                  className={`border-b hover:bg-[#f9f5f4] transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"
                  }`}
                >
                  <td className="p-4 font-medium">{book.title}</td>
                  <td className="p-4 text-gray-700">{book.author}</td>
                  <td className="p-4">
                    <CategoryChip
                      label={book.category}
                      size="small"
                      sx={{ backgroundColor: getCategoryColor(book.category) }}
                    />
                  </td>
                  <td className="p-4 text-gray-700">{book.genre}</td>
                  <td className="p-4">
                    <Tooltip title="Books available" arrow>
                      <BookCountChip
                        label={book.bookCount}
                        size="small"
                        variant="outlined"
                      />
                    </Tooltip>
                  </td>
                  <td className="p-4">
                    <Button
                      onClick={() => handleViewCover(book._id)}
                      className="text-blue-600 hover:text-blue-800"
                      variant="text"
                      size="small"
                    >
                      View Cover
                    </Button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Tooltip title="Edit this book" arrow>
                        <div className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <img
                            src={edit}
                            alt="edit"
                            className="w-5 h-5"
                            onClick={() => handleEditClick(book)}
                          />
                        </div>
                      </Tooltip>
                      <Tooltip title="Delete this book" arrow>
                        <div className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <img
                            src={trash}
                            alt="delete"
                            className="w-5 h-5"
                            onClick={() => handleDeleteClick(book)}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Fade in={true}>
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <div className="text-6xl mb-4 opacity-70">🔍</div>
            <p className="text-lg">
              No books found matching your search criteria
            </p>
            <p className="text-sm mt-2">
              Try adjusting your search terms or filters
            </p>
          </div>
        </Fade>
      )}

      {/* Modal for book cover */}
      <Dialog
        open={openCoverModal}
        onClose={handleCloseCoverModal}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#3e2723",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Book Cover
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {coverLoading ? (
            <div className="flex justify-center items-center h-96 w-full">
              <CircularProgress color="inherit" />
            </div>
          ) : bookCover ? (
            <div className="p-4 flex justify-center">
              <img
                src={bookCover}
                alt="Book Cover"
                className="max-w-full h-auto rounded-md"
                style={{ maxHeight: "600px" }}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 p-8">
              <p>No cover available for this book</p>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseCoverModal}
            variant="contained"
            sx={{
              borderRadius: "8px",
              backgroundColor: "#3e2723",
              "&:hover": { backgroundColor: "#2c1e1a" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Book Modal */}
      <StyledDialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#3e2723",
            fontSize: "1.5rem",
          }}
        >
          📚 Add New Book
        </DialogTitle>
        <DialogContent>
          <StyledTextField
            label="Title"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            placeholder="Enter book title"
            autoFocus
          />
          <StyledTextField
            label="Author"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            fullWidth
            placeholder="Enter author name"
          />
          <StyledTextField
            label="Category"
            name="category"
            value={newBook.category}
            onChange={handleInputChange}
            fullWidth
            placeholder="e.g. Fiction, Non-Fiction, Biography"
          />
          <StyledTextField
            label="Genre"
            name="genre"
            value={newBook.genre}
            onChange={handleInputChange}
            fullWidth
            placeholder="e.g. Mystery, Romance, Science Fiction"
          />
          <StyledTextField
            label="Book Count"
            name="bookCount"
            type="number"
            value={newBook.bookCount}
            onChange={handleInputChange}
            fullWidth
            placeholder="Number of copies available"
          />
          <div className="mt-4 mb-2">
            <p className="mb-2 text-gray-700 font-medium">Book Cover Image:</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", padding: "16px", gap: "16px" }}
        >
          <Button
            onClick={() => setOpenAddModal(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#3e2723",
              color: "#3e2723",
              "&:hover": { borderColor: "#2c1e1a", backgroundColor: "#f9f5f4" },
            }}
          >
            Cancel
          </Button>
          <StyledButton onClick={handleAddBook} variant="contained">
            Add Book
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Edit Book Modal */}
      {editBook && (
        <StyledDialog
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              color: "#3e2723",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            ✏️ Edit Book
          </DialogTitle>
          <DialogContent>
            <StyledTextField
              label="Title"
              name="title"
              value={editBook.title}
              onChange={(e) =>
                setEditBook({ ...editBook, title: e.target.value })
              }
              fullWidth
              autoFocus
            />
            <StyledTextField
              label="Author"
              name="author"
              value={editBook.author}
              onChange={(e) =>
                setEditBook({ ...editBook, author: e.target.value })
              }
              fullWidth
            />
            <StyledTextField
              label="Category"
              name="category"
              value={editBook.category}
              onChange={(e) =>
                setEditBook({ ...editBook, category: e.target.value })
              }
              fullWidth
            />
            <StyledTextField
              label="Genre"
              name="genre"
              value={editBook.genre}
              onChange={(e) =>
                setEditBook({ ...editBook, genre: e.target.value })
              }
              fullWidth
            />
            <StyledTextField
              label="Book Count"
              name="bookCount"
              type="number"
              value={editBook.bookCount}
              onChange={(e) =>
                setEditBook({ ...editBook, bookCount: e.target.value })
              }
              fullWidth
            />

            <div className="mt-4">
              <p className="mb-2 text-gray-700 font-medium">
                Update Book Cover:
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditBook({ ...editBook, bookImage: file });
                  }
                }}
                className="w-full border p-2 rounded-md"
              />
            </div>
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "center", padding: "16px", gap: "16px" }}
          >
            <Button
              onClick={() => setOpenEditModal(false)}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                borderColor: "#3e2723",
                color: "#3e2723",
                "&:hover": {
                  borderColor: "#2c1e1a",
                  backgroundColor: "#f9f5f4",
                },
              }}
            >
              Cancel
            </Button>
            <StyledButton onClick={handleUpdateBook} variant="contained">
              Update Book
            </StyledButton>
          </DialogActions>
        </StyledDialog>
      )}

      {/* Delete Confirmation Modal */}
      <StyledDialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#d32f2f",
            textAlign: "center",
          }}
        >
          ⚠️ Confirm Delete
        </DialogTitle>
        <DialogContent>
          <p className="text-center mb-4">Are you sure you want to delete:</p>
          {bookToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
              <p className="font-bold text-lg">"{bookToDelete.title}"</p>
              <p className="text-gray-600">by {bookToDelete.author}</p>
            </div>
          )}
          <p className="text-red-500 text-center font-medium mt-4">
            This action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", padding: "16px", gap: "16px" }}
        >
          <Button
            onClick={() => setOpenDeleteModal(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "#9e9e9e",
              color: "#616161",
              "&:hover": { borderColor: "#757575", backgroundColor: "#f5f5f5" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ borderRadius: "8px", padding: "8px 16px" }}
          >
            Delete Book
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BooksTable;
