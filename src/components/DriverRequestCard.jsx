import { motion } from "framer-motion";

export default function DriverRequestCard({ request, onAccept, onReject }) {
  return (
    <motion.div 
      className=" p-6 rounded-2xl shadow-lg w-96 mb-6 bg-blue-100 border border-blue-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{request.name}</h3>
      <p className="text-gray-600 mb-1"><span className="font-medium">Phone:</span> {request.phone}</p>
      <p className="text-gray-600 mb-1"><span className="font-medium">Email:</span> {request.email}</p>
      <p className="text-gray-600 mb-4"><span className="font-medium">Bus/Travels:</span> {request.busName}</p>
      
      <div className="flex justify-between">
        <motion.button 
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
          whileTap={{ scale: 0.95 }}
          onClick={() => onAccept(request)}
        >
          Accept
        </motion.button>
        <motion.button 
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
          whileTap={{ scale: 0.95 }}
          onClick={() => onReject(request.id)}
        >
          Reject
        </motion.button>
      </div>
    </motion.div>
  );
}
