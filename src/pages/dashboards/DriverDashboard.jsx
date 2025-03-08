// DriverDashboard.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import BusCard from "../../components/BusCard";
import { useNavigate } from "react-router-dom";
// import JourneyHistory from "../JourneyHistory";

export default function DriverDashboard() {
  const [busses, setBusses] = useState([]);
  const navigate = useNavigate();
  const driverUID = auth.currentUser?.uid;

  useEffect(() => {
    if (!driverUID) return;

    const q = query(collection(db, "busses"), where("driverUID", "==", driverUID));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedBusses = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      // Sort buses: Ongoing/Pending first, then completed
      const sortedBusses = fetchedBusses.sort((a, b) => {
        const order = { "ongoing": 1, "in-progress": 1, "pending": 1, "completed": 2 };
        return (order[a.journeyState] || 3) - (order[b.journeyState] || 3);
      });

      setBusses(sortedBusses);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [driverUID]);

  const handleAddBus = () => {
    navigate("/add-bus");
  };

  const activeJourney = busses.find(
    (bus) => bus.journeyState === "in-progress" || bus.journeyState === "ongoing" || bus.journeyState === "pending"
  );

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Driver Dashboard</h2>
      {activeJourney ? (
        <BusCard busDetails={activeJourney} />
      ) : (
        <button
          onClick={handleAddBus}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Add Bus
        </button>
      )}
      {/* <JourneyHistory busses={busses} /> */}
    </div>
  );
}
