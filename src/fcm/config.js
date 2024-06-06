// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANMB1LWRJqweCj0TjkkCXd2YcRF-7uaMk",
  authDomain: "foodswap-3d0a3.firebaseapp.com",
  projectId: "foodswap-3d0a3",
  storageBucket: "foodswap-3d0a3.appspot.com",
  messagingSenderId: "1072444129291",
  appId: "1:1072444129291:web:cbbe2a7f4b614a29f4c70e",
  measurementId: "G-VKJGW4YB0C"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default firebaseApp;
