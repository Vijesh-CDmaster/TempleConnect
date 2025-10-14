
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import * as admin from 'firebase-admin';

// Your web app's Firebase configuration
// This is for client-side initialization
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCiCvJmRY1jBxfOFLNZggBkvOHK-4NS41k",
  authDomain: "studio-2441954507-47728.firebaseapp.com",
  projectId: "studio-2441954507-47728",
  storageBucket: "studio-2441954507-47728.appspot.com",
  messagingSenderId: "778379522597",
  appId: "1:778379522597:web:d9264918eab7b07ed705cc"
};

// Initialize Firebase for client-side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
export type { User } from 'firebase/auth';
export type { DocumentData } from 'firebase/firestore';
