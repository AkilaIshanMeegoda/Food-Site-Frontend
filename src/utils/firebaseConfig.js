// src/utils/firebaseConfig.js
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwsve0aEqNb2PMsqP-e-fIKPId8u3n87Y",
  authDomain: "quickyshop-e41a0.firebaseapp.com",
  projectId: "quickyshop-e41a0",
  storageBucket: "quickyshop-e41a0.appspot.com",
  messagingSenderId: "479381474012",
  appId: "1:479381474012:web:8c4567e7ab6dfe2fd24219",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
export { storage };
