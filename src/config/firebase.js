import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_HMWFzpBME7PtTwqDaXOG3BHq0DRY1m0",
  authDomain: "rfid-attendance-system-9510e.firebaseapp.com",
  projectId: "rfid-attendance-system-9510e",
  storageBucket: "rfid-attendance-system-9510e.firebasestorage.app",
  messagingSenderId: "745646084466",
  appId: "1:745646084466:web:b2a418da7356198f6d4deb",
  measurementId: "G-R1BXJRVHBC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };