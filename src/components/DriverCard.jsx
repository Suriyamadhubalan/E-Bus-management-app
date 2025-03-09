import { motion } from "framer-motion";

export default function DriverCard({ driver, onRemove }) {
  console.log(driver);
  
  return (
    <motion.div 
      className="p-6 rounded-2xl shadow-lg w-96 mb-6 bg-blue-100 border border-blue-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{driver.name}</h3>
      <p className="text-gray-600 mb-1"><span className="font-medium">Phone:</span> {driver.phone}</p>
      <p className="text-gray-600 mb-1"><span className="font-medium">Email:</span> {driver.email}</p>
      <p className="text-gray-600 mb-4"><span className="font-medium">Bus/Travels:</span> {driver.busName}</p>
      
      <motion.button 
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md w-full"
        whileTap={{ scale: 0.95 }}
        onClick={() => onRemove(driver.id)}
      >
        Remove
      </motion.button>
    </motion.div>
  );
}
