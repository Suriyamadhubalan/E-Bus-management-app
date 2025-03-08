import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // ✅ Ensure correct import

export default function LoginPage() {
  const { user, role } = useAuth(); // ✅ Role should update dynamically
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔹 useAuth Context Data:", { user, role });

    if (role) {
      console.log("🚀 Navigating based on role:", role);
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "driver") navigate("/Driver-Dashboard");
      else navigate("/passenger-dashboard");
    }
  }, [role, navigate]); // ✅ Now role update triggers navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    console.log("🟢 Attempting Login...");

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      console.log("🔍 Firestore Query Result:", querySnapshot.empty ? "No user found" : querySnapshot.docs.map(doc => doc.data()));

      if (querySnapshot.empty) {
        setErrorMessage("Email not registered. Please sign up first.");
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.disabled) {
        console.log("⛔ Account Disabled:", userData.email);
        setErrorMessage("Your account has been deactivated. Contact admin.");
        setLoading(false);
        return;
      }

      // Proceed with login
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("✅ Login Successful!");

    } catch (error) {
      console.error("❌ Login Error:", error.message);
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        <button
          type="submit"
          className={`w-full text-white font-semibold py-2 px-6 rounded-lg ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
