import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWKbNXv4dGqJXPEy4DtYT7kusD9f3F0ug",
  authDomain: "gpt-guider.firebaseapp.com",
  projectId: "gpt-guider",
  storageBucket: "gpt-guider.appspot.com",
  messagingSenderId: "200239601743",
  appId: "1:200239601743:web:58647bef88c9e476d0b23a",
  measurementId: "G-G2G88ZM5M2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app);
const analytics = getAnalytics(app);


export { auth, db, storage }