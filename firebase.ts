import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFr--na-wJGHMdev7vUhPufAJHlyP3GNQ",
  authDomain: "school-9d3db.firebaseapp.com",
  projectId: "school-9d3db",
  storageBucket: "school-9d3db.firebasestorage.app",
  messagingSenderId: "429673694272",
  appId: "1:429673694272:web:43390c4fdfa5bce4744ba5",
  measurementId: "G-8YSDYV9VBN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);