import "./App.css";
import axios from "axios";
import { AdminContextProvider } from "./AdminContext"; // Change to AdminContext
import AdminRoutes from "./routes/AdminRoutes"; // Change to AdminRoutes

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <AdminContextProvider>
      {" "}
      {/* Use AdminContextProvider instead of UserContextProvider */}
      <AdminRoutes /> {/* Use AdminRoutes instead of UserRoutes */}
    </AdminContextProvider>
  );
}

export default App;
