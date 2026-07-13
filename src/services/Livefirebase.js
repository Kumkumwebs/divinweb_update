import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBTB6yFD8Nm3-6Lpcyt_5_7m3PC2hi1CUA",
  authDomain: "diviniq-5c0d0.firebaseapp.com",
  databaseURL: "https://diviniq-5c0d0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "diviniq-5c0d0",
  storageBucket: "diviniq-5c0d0.firebasestorage.app",
  messagingSenderId: "23211911286",
  appId: "1:23211911286:web:231a6f957fff4c72f51757",
  measurementId: "G-SGSTHWBF4D",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

// Firebase Cloud Messaging
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

export default app;