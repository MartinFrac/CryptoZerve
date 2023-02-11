import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // apiKey: process.env.APIKEY,
  // authDomain: process.env.AUTHDOMAIN,
  // projectId: process.env.PROJECTID,
  // storageBucket: process.env.STORAGEBUCKET,
  // messagingSenderId: process.env.MESSAGINGSENDERID,
  // appId: process.env.APPID
  apiKey: "AIzaSyA_5PL7potiNYpwyu7cV_2fdg5BYEUZM24", 
  authDomain: "cryptozerve.firebaseapp.com",
  projectId: "cryptozerve",
  storageBucket: "cryptozerve.appspot.com",
  messagingSenderId: "1082011018451",
  appId: "1:1082011018451:web:636ccf46fb0afaf8102026",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);