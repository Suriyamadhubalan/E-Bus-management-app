import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import DriverRequestCard from "../../components/DriverRequestCard";
import AlertMessage from "../../components/AlertMessage";

export default function AdminDashboard() {
  const [driverRequests, setDriverRequests] = useState([]);
  const [alert, setAlert] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    fetchDriverRequests();
  }, []);

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 3000); // Auto-hide after 3s
  };

  const fetchDriverRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "driverRequests"));
    const requestsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDriverRequests(requestsList);
  };

  const acceptDriver = async (request) => {
    const { id, ...requestData } = request;
    const currentAdmin = auth.currentUser; // Store logged-in admin

    // console.log("Current Admin:", currentAdmin ? currentAdmin.email : "No admin logged in");

    try {
        // Step 1: Get Admin's Password from Firestore
        // console.log(`Fetching admin password from Firestore..., admin UID ${currentAdmin.uid}`);
        const adminDoc = await getDoc(doc(db, "users", currentAdmin.uid));

        if (!adminDoc.exists()) {
            // console.error("Admin credentials not found in Firestore!");
            showAlert("Admin credentials not found!", "red");
            return;
        }

        // console.log("Admin Document Data:", adminDoc.data());

        const adminPassword = adminDoc.data().password;
        // console.log("Admin Password Retrieved:", adminPassword ? "Yes" : "No");

        // Step 2: Create Driver Account
        // console.log(`Creating driver account for ${requestData.email}...`);
        const userCredential = await createUserWithEmailAndPassword(auth, requestData.email, "temporaryPassword123");
        const user = userCredential.user;
        // console.log("Driver account created successfully:", user.email);

        // Step 3: Store Driver Details in Firestore
        // console.log("Saving driver details in Firestore...");
        await setDoc(doc(db, "users", user.uid), { ...requestData, role: "driver" });

        // Step 4: Send Password Reset Email to Driver
        // console.log(`Sending password reset email to ${requestData.email}...`);
        await sendPasswordResetEmail(auth, requestData.email);

        // Step 5: Remove Driver Request from Firestore
        // console.log("Deleting driver request from Firestore...");
        await deleteDoc(doc(db, "driverRequests", id));

        // Step 6: Update UI
        setDriverRequests(driverRequests.filter(req => req.id !== id));
        // console.log("Driver request list updated.");

        // Step 7: Re-login Admin Automatically
        // console.log("Re-authenticating admin...");
        await signInWithEmailAndPassword(auth, currentAdmin.email, adminPassword);
        // console.log("Admin successfully re-authenticated.");

        showAlert("Driver accepted successfully! A password reset email has been sent.", "green");
    } catch (error) {
        console.error("Error accepting driver:", error);
        showAlert("Failed to accept driver. Please try again.", "red");
    }
};


  const rejectDriver = async (id) => {
    await deleteDoc(doc(db, "driverRequests", id));
    // showAlert("", "red")
    setDriverRequests(driverRequests.filter(req => req.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Driver Requests</h2>

      {driverRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {driverRequests.map(request => (
            <DriverRequestCard key={request.id} request={request} onAccept={acceptDriver} onReject={rejectDriver} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No pending driver requests.</p>
      )}

      {alert && <AlertMessage {...alert} />}
    </div>

  );
}
