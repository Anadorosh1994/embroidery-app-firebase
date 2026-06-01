import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_QH5NUsoB1P3O8-EMwbqOc0GR2kiHIek",
  authDomain: "embroidery-tracker-7db86.firebaseapp.com",
  projectId: "embroidery-tracker-7db86",
  storageBucket: "embroidery-tracker-7db86.firebasestorage.app",
  messagingSenderId: "483681870888",
  appId: "1:483681870888:web:6aab5ad1228537491fc11d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);