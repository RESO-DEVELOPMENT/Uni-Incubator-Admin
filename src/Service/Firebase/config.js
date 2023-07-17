import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCmoBJJzqjCmfXukcHn-XJa6kLhSFfW08",
  authDomain: "cnb-inclubbator.firebaseapp.com",
  projectId: "cnb-inclubbator",
  storageBucket: "cnb-inclubbator.appspot.com",
  messagingSenderId: "374281219673",
  appId: "1:374281219673:web:16b6704c99760468a24b48",
  measurementId: "G-2540XH6XTD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
