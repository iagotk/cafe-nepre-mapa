import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNxPpuhYOv5h8oortjO5L3FcHgUrAKTrc",
  authDomain: "cafe-nepre.firebaseapp.com",
  projectId: "cafe-nepre",
  storageBucket: "cafe-nepre.firebasestorage.app",
  messagingSenderId: "148785526423",
  appId: "1:148785526423:web:4c95e4771acb0a9817dbd2",
  measurementId: "G-KENQXJW156",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
