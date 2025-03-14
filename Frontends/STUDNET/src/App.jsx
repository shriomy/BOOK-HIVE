import "./App.css";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import UserRoutes from "./routes/UserRoutes";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <UserRoutes />
    </UserContextProvider>
  );
}

export default App;
