// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import firebase from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  databaseURL: "https://bond-8666f.firebaseio.com",
  apiKey: "AIzaSyDj3K-nWL1F4Mu4fkmiqeacVrHh9u8tF1k",
  authDomain: "bond-8666f.firebaseapp.com",
  projectId: "bond-8666f",
  storageBucket: "bond-8666f.appspot.com",
  messagingSenderId: "206093441022",
  appId: "1:206093441022:web:1d23bc2a2433fa61bb52af",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
//const db = getFirestore();

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { auth, db };
