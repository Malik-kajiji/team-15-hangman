// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmI3F1BvTyAuoScpjIw34s-jS8mDSjr1Y",
    authDomain: "hangman-bfd8c.firebaseapp.com",
    projectId: "hangman-bfd8c",
    storageBucket: "hangman-bfd8c.appspot.com",
    messagingSenderId: "294491694204",
    appId: "1:294491694204:web:6854757f62e24a087795f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);