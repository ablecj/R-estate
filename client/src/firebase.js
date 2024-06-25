// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "r-estate-f76e1.firebaseapp.com",
  projectId: "r-estate-f76e1",
  storageBucket: "r-estate-f76e1.appspot.com",
  messagingSenderId: "862685678653",
  appId: "1:862685678653:web:2634946b22e0144dc6ae54"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);










