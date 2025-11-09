import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDea5K_LDv6UKK7jC7T0iLervN9L7R1c90",
  authDomain: "douremember-a97a7.firebaseapp.com",
  projectId: "douremember-a97a7",
  storageBucket: "douremember-a97a7.firebasestorage.app",
  messagingSenderId: "366552326381",
  appId: "1:366552326381:web:b4be3ea8e148618ec2ece4",
  measurementId: "G-P8Y84E6QTG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
