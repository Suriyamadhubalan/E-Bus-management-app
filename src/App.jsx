import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DriverDashboard from "./pages/dashboards/DriverDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import PassengerDashboard from "./pages/dashboards/PassengerDashboard";
import DriverRequestPage from "./pages/DriverRequestPage";
import AddBusPage from "./pages/AddBusPage";
import PassengerTrackingPage from "./pages/PassengerTrackingPage";
import JourneyHistory from "./pages/JourneyHistory";
import ManageDrivers from "./pages/ManageDrivers";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); // Get current path

  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/DriverRequest" element={<DriverRequestPage />} />
        

        {/* Protected Routes */}
        <Route
          path="/Driver-Dashboard"
          element={
            <ProtectedRoute role="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-Dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Passenger-Dashboard"
          element={
            <ProtectedRoute role="passenger">
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Journey-History"
          element={
            <ProtectedRoute role="driver">
              <JourneyHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageDrivers"
          element={
            <ProtectedRoute role="admin">
              <ManageDrivers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-bus"
          element={
            <ProtectedRoute role="driver">
              <AddBusPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
