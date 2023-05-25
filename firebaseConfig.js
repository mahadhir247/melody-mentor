import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0oRGRLhfnZdQtsweJ1Q7VG1fHDLid5ws",
  authDomain: "orbitalapp-4da0d.firebaseapp.com",
  projectId: "orbitalapp-4da0d",
  storageBucket: "orbitalapp-4da0d.appspot.com",
  messagingSenderId: "991219715789",
  appId: "1:991219715789:web:7edb6e7a1f9adf6d8a2384",
  measurementId: "G-7WV1X1TPMS"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
