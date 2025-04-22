// src/utils/firebaseConfig.js
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC4trkMUHbVq_F04jfeVsJnHIznNmANEtQ",
  authDomain: "foodapp-a3b3e.firebaseapp.com",
  projectId: "foodapp-a3b3e",
  storageBucket: "foodapp-a3b3e.firebasestorage.app",
  messagingSenderId: "600209739223",
  appId: "1:600209739223:web:ad6dbce39b5602b7f74f92",
  measurementId: "G-SH9CHMHPKC"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
export { storage };
