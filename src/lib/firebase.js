import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCPBvknGRBFoiW4MUPVdW5E1_edoR15Dc",
  authDomain: "java-study-tracker.firebaseapp.com",
  projectId: "java-study-tracker",
  storageBucket: "java-study-tracker.firebasestorage.app",
  messagingSenderId: "402618643150",
  appId: "1:402618643150:web:b7210d3d41980158f9569f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
