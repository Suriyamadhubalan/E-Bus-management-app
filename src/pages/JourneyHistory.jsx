import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import BusCard from "../components/BusCard";

export default function JourneyHistory() {
  const [completedJourneys, setCompletedJourneys] = useState([]);
  const driverUID = auth.currentUser?.uid;

  useEffect(() => {
    if (!driverUID) return;

    const q = query(
      collection(db, "busses"),
      where("driverUID", "==", driverUID),
      where("journeyState", "==", "completed")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedJourneys = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompletedJourneys(fetchedJourneys);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [driverUID]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Journey History</h2>
      {completedJourneys.length > 0 ? (
        completedJourneys.map((bus) => <BusCard key={bus.id} busDetails={bus} />)
      ) : (
        <p className="text-gray-500">No past journeys found.</p>
      )}
    </div>
  );
}
