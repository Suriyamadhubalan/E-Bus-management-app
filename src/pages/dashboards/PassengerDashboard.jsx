import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PassengerBusCard from "../../components/PassengerBusCard";

export default function PassengerDashboard() {
  const [busses, setBusses] = useState([]);
  const [search, setSearch] = useState({ from: "", to: "" });

  useEffect(() => {
    const fetchBusses = async () => {
      const querySnapshot = await getDocs(collection(db, "busses"));
  
      const currentTime = new Date(); // Current time
  
      const sortedBusses = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(bus => {
          // ✅ Remove only if `journeyState === "completed"` AND 5+ hours have passed since arrival time
          if (bus.journeyState === "completed") {
            const arrivalTime = new Date(`1970-01-01T${bus.arrivalTime}`); // Convert to Date
            const completionTime = new Date(bus.date); // Convert bus date to Date object
            
            completionTime.setHours(arrivalTime.getHours(), arrivalTime.getMinutes()); // Set to arrival time
            completionTime.setHours(completionTime.getHours() + 5); // Add 5 hours
  
            return currentTime < completionTime; // ✅ Keep if 5 hours haven't passed yet
          }
  
          return true; // ✅ Keep ongoing journeys
        })
        .sort((a, b) => {
          // Compare by date (latest first)
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateB - dateA !== 0) return dateB - dateA;
  
          // If dates are the same, compare by departure time (latest first)
          const timeA = new Date(`1970-01-01T${a.departureTime}`);
          const timeB = new Date(`1970-01-01T${b.departureTime}`);
          return timeB - timeA;
        });
  
      setBusses(sortedBusses);
    };
  
    fetchBusses();
  }, []);
  
  

  const filteredBusses = busses.filter(bus =>
    (search.from === "" || bus.from.toLowerCase().includes(search.from.toLowerCase())) &&
    (search.to === "" || bus.to.toLowerCase().includes(search.to.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">  
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Here</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="From"
          className="p-2 border rounded-lg w-1/2"
          value={search.from}
          onChange={(e) => setSearch({ ...search, from: e.target.value })}
        />
        <input
          type="text"
          placeholder="To"
          className="p-2 border rounded-lg w-1/2"
          value={search.to}
          onChange={(e) => setSearch({ ...search, to: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusses.map(bus => (
          <PassengerBusCard key={bus.id} bus={bus} />
        ))}
      </div>
    </div>
  );
} 
