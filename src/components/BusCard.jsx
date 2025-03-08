import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

export default function BusCard({ busDetails }) {
  const [journeyState, setJourneyState] = useState(busDetails.journeyState);
  const [watchId, setWatchId] = useState(null);
  const busRef = doc(db, "busses", busDetails.id);

  useEffect(() => {
    // Listen for real-time updates on journeyState
    const unsubscribe = onSnapshot(busRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setJourneyState(docSnapshot.data().journeyState);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [busDetails.id]);

  const startJourney = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    await updateDoc(busRef, { journeyState: "ongoing" });

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log({ latitude, longitude });

        await updateDoc(busRef, { liveLocation: { latitude, longitude } });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    setWatchId(id);
  };

  const endJourney = async () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    await updateDoc(busRef, { journeyState: "completed" });
  };

  return (
    <motion.div 
    className="p-6 rounded-2xl shadow-lg w-96 bg-blue-100 border border-blue-300 mt-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-bold mb-2 text-gray-800">{busDetails.busName}</h3>
    <p className="text-gray-600"><span className="font-medium">Type:</span> {busDetails.busType}</p>
    <p className="text-gray-600"><span className="font-medium">Bus Number:</span> {busDetails.busNumber}</p>
    <p className="text-gray-600"><span className="font-medium">Route:</span> {busDetails.from} ➝ {busDetails.to}</p>
    <p className="text-gray-600"><span className="font-medium">Date:</span> {busDetails.date}</p>
    <p className="text-gray-600"><span className="font-medium">Driver Contact:</span> {busDetails.driverPhone}</p>
    <p className="text-gray-600"><span className="font-medium">Departure:</span> {busDetails.departureTime}</p>
    <p className="text-gray-600 mb-4"><span className="font-medium">Arrival:</span> {busDetails.arrivalTime}</p>

    {journeyState !== "completed" && (
      <div className="flex justify-between mt-4">
        <motion.button
          onClick={startJourney}
          disabled={journeyState === "ongoing"}
          className={`py-2 px-4 rounded-lg font-semibold shadow-md ${
            journeyState === "ongoing"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Start Journey
        </motion.button>
        <motion.button
          onClick={endJourney}
          disabled={journeyState !== "ongoing"}
          className={`py-2 px-4 rounded-lg font-semibold shadow-md ${
            journeyState === "ongoing"
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          End Journey
        </motion.button>
      </div>
    )}
  </motion.div>
  );
}
