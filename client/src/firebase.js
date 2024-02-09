// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "elevateestates-e0e95.firebaseapp.com",
  projectId: "elevateestates-e0e95",
  storageBucket: "elevateestates-e0e95.appspot.com",
  messagingSenderId: "10808820735",
  appId: "1:10808820735:web:1b5123d79fd2b2cf4b9dca",
  measurementId: "G-46JJ0JX5RQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
