import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import DriverCard from "../components/DriverCard";
import AlertMessage from "../components/AlertMessage";

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 2000); // Auto-hide after 2s
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const driverList = querySnapshot.docs
      .filter((doc) => doc.data().role === "driver")
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setDrivers(driverList);
  };

  const removeDriver = async (id) => {
    try {
      await updateDoc(doc(db, "users", id), { disabled: true });
      setDrivers(drivers.filter(driver => driver.id !== id));
      // alert("Driver has been deactivated!");
      showAlert("Driver has been deactivated!", "green")
    } catch (error) {
      console.error("Error deactivating driver:", error);
      showAlert("Failed to deactivate driver. Please try again.", "red")
      // alert("Failed to deactivate driver. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Drivers</h2>

      {drivers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {drivers.map(driver => (
            <DriverCard key={driver.id} driver={driver} onRemove={removeDriver} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No drivers found.</p>
      )}

      {alert && <AlertMessage {...alert} />}
    </div>

  );
}
