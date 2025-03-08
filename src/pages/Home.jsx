import bus from "../assets/bus2.jpg"
import { MapPin, User, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      navigate("/register");
    } else {
      switch (role) {
        case "passenger":
          navigate("/Passenger-Dashboard");
          break;
        case "driver":
          navigate("/Driver-Dashboard");
          break;
        case "admin":
          navigate("/Admin-Dashboard");
          break;
        default:
          navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Parallax Background */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center text-yellow-50 drop-shadow-lg px-4 py-24 bg-cover bg-fixed bg-center w-full" 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), 
            url(${bus})`,
          backgroundSize: "100% auto, 100% 60%", // First for gradient, second for image
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition: "center, top",
        }}
      >
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-4xl font-bold sm:text-6xl drop-shadow-lg">
          Welcome to Ebus Management System
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 font-bold text-lg sm:text-xl drop-shadow-lg">
          Track buses in real-time and enhance your journey experience.
        </motion.p>
        <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
          onClick={handleClick}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105">
          Get Started
        </motion.button>
      </div>
  
      {/* Key Features Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Key Features</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ icon: MapPin, title: "Real-time Bus Tracking", desc: "Track your bus with live location updates." },
            { icon: User, title: "Driver Management", desc: "Efficiently manage drivers and routes." },
            { icon: Clock, title: "Journey History", desc: "View past journeys and reports." }].map((feature, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-lg shadow-md transition-transform">
              <feature.icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
  
      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-center">
        <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Register and log in to your account.",
            "Select your role and start tracking or managing buses.",
            "Get real-time updates and enjoy a smooth experience."].map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }}
              className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">Step {index + 1}</h3>
              <p className="mt-2 text-gray-600">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>
  
      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-center text-white">
        <p>&copy; {new Date().getFullYear()} Ebus Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
