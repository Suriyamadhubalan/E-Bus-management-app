import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // For hamburger icon
import busIcon from "../assets/E-Bus-logo.png"

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Sidebar state

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Toggle Sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-600 text-white py-2 border-b border-blue-400/50 shadow-lg"
      >
        <div className="container mx-auto flex justify-between items-center px-6 whitespace-nowrap">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-wide hover:text-blue-300 transition duration-300">
            {/* Logo Image */}
            <img src={busIcon} alt="Ebus Logo" className="h-8 w-16 object-contain scale-250" />
            <span>Ebus System</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-lg">
            <NavLinks role={role} user={user} handleLogout={handleLogout} />
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button className="md:hidden text-white focus:outline-none" onClick={toggleSidebar}>
            <Menu size={32} />
          </button>
        </div>
      </motion.nav>

      {/* Sidebar Navigation (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-blue-700 shadow-xl z-50 flex flex-col p-6"
            >
              {/* Close Button */}
              <button className="text-white mb-4 self-end" onClick={toggleSidebar}>
                <X size={32} />
              </button>

              {/* Navigation Links */}
              <NavLinks role={role} user={user} handleLogout={handleLogout} isSidebar toggleSidebar={toggleSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Component to render navigation links
const NavLinks = ({ role, user, handleLogout, isSidebar, toggleSidebar }) => {
  return (
    <>
      {role === "passenger" && <NavItem to="/Passenger-Dashboard" text="Passenger Dashboard" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />}
      {role === "driver" && (
        <>
          <NavItem to="/Driver-Dashboard" text="Driver Dashboard" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />
          <NavItem to="/Journey-History" text="Journey History" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />
        </>
      )}
      {role === "admin" && (
        <>
          <NavItem to="/Admin-Dashboard" text="Manage Requests" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />
          <NavItem to="/ManageDrivers" text="Manage Drivers" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />
        </>
      )}
      {!user && (
        <>
          <NavItem to="/login" text="Login" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />
          <NavItem to="/register" text="Register" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />
          <NavItem to="/DriverRequest" text="Driver Register" isSidebar={isSidebar} toggleSidebar={toggleSidebar} />
        </>
      )}
      {user && (
        <button
          onClick={() => {
            handleLogout();
            if (isSidebar) toggleSidebar();
          }}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300 w-auto"
        >
          Logout
        </button>
      )}
    </>
  );
};

// Reusable NavItem Component
const NavItem = ({ to, text, isSidebar, toggleSidebar }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={isSidebar ? toggleSidebar : null}
      className={`relative px-4 py-2 font-medium transition duration-300 block 
        ${isActive ? "text-white font-bold border-b-2 border-white" : "hover:text-blue-300"}
        ${isSidebar ? "text-lg text-white py-3 border-b border-blue-400" : ""}`}
    >
      {text}
    </Link>
  );
};
