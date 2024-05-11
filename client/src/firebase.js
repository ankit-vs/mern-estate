// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mere-estate-firebase.firebaseapp.com",
  projectId: "mere-estate-firebase",
  storageBucket: "mere-estate-firebase.appspot.com",
  messagingSenderId: "864431732582",
  appId: "1:864431732582:web:ea07dff83f44c1c7227aa7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);