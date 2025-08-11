import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginurbanwagon.firebaseapp.com",
  projectId: "loginurbanwagon",
  storageBucket: "loginurbanwagon.appspot.com",
  messagingSenderId: "930163099624",
  appId: "1:930163099624:web:b8e9823212f38a4ec8065d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
