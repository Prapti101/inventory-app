import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

  const firebaseConfig = {
  apiKey: "AIzaSyBwSXiLjmKqek1ClKh-XlG16aPlyo2fWv4",
  authDomain: "inventory-app-db5f0.firebaseapp.com",
  projectId: "inventory-app-db5f0",
  storageBucket: "inventory-app-db5f0.firebasestorage.app",
  messagingSenderId: "683468081937",
  appId: "1:683468081937:web:a0cd70402be59e07c45ab0",
  measurementId: "G-0D23JHDSXC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
