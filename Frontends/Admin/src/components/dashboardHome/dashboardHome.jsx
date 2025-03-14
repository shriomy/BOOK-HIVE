import React, { useState } from "react";
import { Line, Bar, Pie, Doughnut, Radar } from "react-chartjs-2";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  RadialLinearScale 
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const Dashboard = () => {
  const [data] = useState({
    availableBooks: 500,
    borrowedBooks: 200,
    members: 1000,
    booksAdded: [10, 20, 30, 40, 50, 60, 70],
    bookBorrowedData: [10, 50, 30, 70, 60, 80, 90],
  });

  // Line Chart: Books Added Over Time
  const booksAddedData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Books Added",
        data: data.booksAdded,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.3)",
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  // Bar Chart: Books Borrowed Over Time
  const booksBorrowedData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Books Borrowed",
        data: data.bookBorrowedData,
        backgroundColor: "#FF7043",
      },
    ],
  };

  // Pie Chart: Member Status
  const memberStatusData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [700, 300],
        backgroundColor: ["#42A5F5", "#FF5252"],
      },
    ],
  };

  // Doughnut Chart: Book Categories Distribution
  const bookCategoriesData = {
    labels: ["Fiction", "Non-fiction", "Sci-Fi", "Romance", "Others"],
    datasets: [
      {
        data: [150, 100, 50, 70, 130],
        backgroundColor: ["#42A5F5", "#FFD54F", "#AB47BC", "#EC407A", "#26A69A"],
      },
    ],
  };

  // Radar Chart: Top Borrowed Genres
  const genreBorrowingData = {
    labels: ["Mystery", "Thriller", "Romance", "Sci-Fi", "Fantasy", "Horror"],
    datasets: [
      {
        label: "Borrowed Books",
        data: [30, 50, 90, 60, 70, 40],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box sx={{ padding: 4, bgcolor: "#F7F9FC", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#37474F", textAlign: "center" }}>
        📚 Library Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {[
          { title: "Books Available", value: data.availableBooks, color: "#42A5F5" },
          { title: "Books Borrowed", value: data.borrowedBooks, color: "#FF7043" },
          { title: "Total Members", value: data.members, color: "#66BB6A" },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                textAlign: "center", 
                bgcolor: "white",
                color: item.color, 
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" }
              }}
            >
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Charts Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, bgcolor: "white", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <Typography variant="h6">📈 Books Added Over Time</Typography>
            <Line data={booksAddedData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, bgcolor: "white", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <Typography variant="h6">📊 Books Borrowed Over Time</Typography>
            <Bar data={booksBorrowedData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, bgcolor: "white", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <Typography variant="h6">📌 Member Status</Typography>
            <Pie data={memberStatusData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, bgcolor: "white", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <Typography variant="h6">📚 Book Categories Distribution</Typography>
            <Doughnut data={bookCategoriesData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, bgcolor: "white", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <Typography variant="h6">📖 Top Borrowed Genres</Typography>
            <Radar data={genreBorrowingData} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
