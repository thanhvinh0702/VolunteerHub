import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./pages/DemoPages/Sidebar";
import AppRouter from "./routes/AppRouter";
import EventCard from "./components/Dashboard/EventCard";
import ShortCut from "./components/Dashboard/ShortCut";
import DashBoardOverview from "./components/Dashboard/DashBoardOverview";
import NavBar from "./components/Sidebar/NavBar";
import DashboardLayout from "./pages/DashBoard/DashboardLayout";
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}

export default App;
