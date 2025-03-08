import { Link } from "react-router-dom";
import watermark from "../assets/bus-Icon.png"
import { motion } from "framer-motion";

export default function PassengerBusCard({ bus }) {
  return (
    
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative bg-white shadow-md rounded-2xl p-6 mb-4 w-full"
    >
      {/* Watermark Image */}
      <img 
        src={watermark} 
        alt="Watermark" 
        className="absolute inset-0 m-auto opacity-10 w-102 h-102"
      />

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-800 relative">
        {bus.busName} ({bus.busType})
      </h3>
      <p className="text-gray-600 mt-2 relative">
        Bus Number: <span className="font-medium">{bus.busNumber}</span>
      </p>
      <p className="text-gray-600 relative">
        Route: <span className="font-medium">{bus.from} → {bus.to}</span>
      </p>
      <p className="text-gray-600 relative">
        Date: <span className="font-medium">{bus.date}</span>
      </p>
      <p className="text-gray-600 relative">
        Departure: <span className="font-medium">{bus.departureTime}</span>
      </p>
      <p className="text-gray-600 relative">
        Arrival: <span className="font-medium">{bus.arrivalTime}</span>
      </p>
      <p className="text-gray-600 relative">
        Driver Phone: <span className="font-medium">{bus.driverPhone}</span>
      </p>

      {/* Conditionally render button or message */}
      {bus.journeyState === "ongoing" ? (
        <Link to={`/track/${bus.id}`} className="relative">
          <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
            Start Tracking
          </button>
        </Link>
      ) : (
        <p className="mt-4 text-gray-500 font-medium text-center relative">
          {bus.journeyState === "completed" ? "Journey Completed" : "Journey Not Started"}
        </p>
      )}
    </motion.div>
  );
}
