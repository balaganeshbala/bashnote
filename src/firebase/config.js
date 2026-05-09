// ─────────────────────────────────────────────────────────────
//  🔥 Firebase Configuration
//  Replace the values below with your own Firebase project config.
//  Get them from: Firebase Console → Project Settings → Your Apps
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3dsad7jZSaByjaMPxy8FOeYDHY_aivMk",
  authDomain: "notebash-22f71.firebaseapp.com",
  projectId: "notebash-22f71",
  storageBucket: "notebash-22f71.firebasestorage.app",
  messagingSenderId: "331974496992",
  appId: "1:331974496992:web:ea0c1194bb669eafb1b685"
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const db       = getFirestore(app);
export const provider = new GoogleAuthProvider();
