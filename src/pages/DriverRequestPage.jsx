import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";

export default function DriverRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    busName: ""
  });
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 2000); // Auto-hide after 3s
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "driverRequests"), formData);
      // alert("Request submitted successfully!");

      showAlert("Driver Request sent successfully!", "green")

      setTimeout(() => navigate("/"), 2200);
    } catch (error) {
      showAlert(`Error registering user: ${error.message}`, "red")
      console.error("Error submitting request: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Driver Request Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded-lg" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded-lg" onChange={handleChange} required />
          {/* <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded-lg" onChange={handleChange} required /> */}
          <input type="text" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded-lg" onChange={handleChange} required />
          <input type="text" name="busName" placeholder="Bus/Travels Name" className="w-full p-2 border rounded-lg" onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">Submit Request</button>
        </form>
      </div>
      {alert && <AlertMessage {...alert} />}
    </div>
  );
} 