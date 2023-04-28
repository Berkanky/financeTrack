// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRbE4rthJMX9CJgNx9lKkajIqVAYha0-E",
  authDomain: "ondokuzon-64270.firebaseapp.com",
  projectId: "ondokuzon-64270",
  storageBucket: "ondokuzon-64270.appspot.com",
  messagingSenderId: "786867335446",
  appId: "1:786867335446:web:ff98ff7b60ac561b296037"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const database = getDatabase(app);
export {
  db,
  database,
}