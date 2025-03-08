import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function AddBusPage() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const driverUID = user ? user.uid : null;

  const [busDetails, setBusDetails] = useState({
    busName: "",
    busType: "",
    busNumber: "",
    from: "",
    to: "",
    date: "",
    driverPhone: "",
    departureTime: "",
    arrivalTime: "",
    journeyState: "pending", // Initial state before journey starts
    driverUID: driverUID, // Associate the bus with the logged-in driver
  });

  const handleChange = (e) => {
    setBusDetails({ ...busDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverUID) {
      console.error("User not logged in.");
      return;
    }

    try {
      await addDoc(collection(db, "busses"), { ...busDetails, driverUID });
      navigate("/driver-dashboard"); // Redirect back after adding bus
    } catch (error) {
      console.error("Error adding bus details:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Bus</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <input
          type="text"
          name="busName"
          placeholder="Bus Name"
          value={busDetails.busName}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="text"
          name="busType"
          placeholder="Bus Type"
          value={busDetails.busType}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="text"
          name="busNumber"
          placeholder="Bus Number"
          value={busDetails.busNumber}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="text"
          name="from"
          placeholder="From"
          value={busDetails.from}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="text"
          name="to"
          placeholder="To"
          value={busDetails.to}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="date"
          name="date"
          value={busDetails.date}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="text"
          name="driverPhone"
          placeholder="Driver Phone Number"
          value={busDetails.driverPhone}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="time"
          name="departureTime"
          value={busDetails.departureTime}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="time"
          name="arrivalTime"
          value={busDetails.arrivalTime}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
