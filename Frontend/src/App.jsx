import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./pages/DemoPages/Sidebar";
import AppRouter from "./routes/AppRouter";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: "20px" }}>
            <AppRouter />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
