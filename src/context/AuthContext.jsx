import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("✅ User Logged In:", currentUser.uid);
        setUser(currentUser);
  
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const roleData = userDoc.data().role;
            console.log("🟢 Role Fetched:", roleData);
            setRole(() => roleData); // ✅ Ensures React updates correctly
          } else {
            console.warn("⚠️ No user document found in Firestore!");
            setRole(null);
          }
        } catch (error) {
          console.error("❌ Error fetching user document:", error);
          setRole(null);
        }
      } else {
        console.log("🔴 No user logged in.");
        setUser(null);
        setRole(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    // const navigate = useNavigate(); 
    await signOut(auth);
    setUser(null);
    setRole(null);
    // navigate("/"); 
  };

  return (
    <AuthContext.Provider value={{ user, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
