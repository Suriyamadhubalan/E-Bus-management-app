// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO7SNGxtU6-Rz8fa-LibEsSJu6Er_-ICw",
  authDomain: "e-bus-management-system-7ea30.firebaseapp.com",
  projectId: "e-bus-management-system-7ea30",
  storageBucket: "e-bus-management-system-7ea30.firebasestorage.app",
  messagingSenderId: "992977683318",
  appId: "1:992977683318:web:f0bda28139dc3c6684b057",
  measurementId: "G-FY1Q3HPDMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };