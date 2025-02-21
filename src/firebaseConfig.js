import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC1zgf6NErtbMGzu0SHSkzD1QDxQW97UaQ",
    authDomain: "rfid-attendance-system-e2420.firebaseapp.com",
    projectId: "rfid-attendance-system-e2420",
    storageBucket: "rfid-attendance-system-e2420.firebasestorage.app",
    messagingSenderId: "463927715418",
    appId: "1:463927715418:web:469a2af17d7f602ea91a63"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };