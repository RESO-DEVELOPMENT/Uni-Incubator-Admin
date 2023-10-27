import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtl9n8IaFaaVjTT_f03eaNfmk5iIXpCcA",
  authDomain: "uni-incubator-b9c2b.firebaseapp.com",
  projectId: "uni-incubator-b9c2b",
  storageBucket: "uni-incubator-b9c2b.appspot.com",
  messagingSenderId: "767483505907",
  appId: "1:767483505907:web:3bde15efb3c1029bbedb86",
  measurementId: "G-TG11JY3668",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
