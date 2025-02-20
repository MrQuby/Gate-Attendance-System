import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC1zgf6NErtbMGzu0SHSkzD1QDxQW97UaQ",
    authDomain: "rfid-attendance-system.firebaseapp.com",
    projectId: "rfid-attendance-system-e2420",
    storageBucket: "rfid-attendance-system.appspot.com",
    messagingSenderId: "1003624904239",
    appId: "1:1003624904239:web:0b0a3e0e0b0a3e0e0b0a3e0e",
    measurementId: "G-9E7WQ3XW1B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };