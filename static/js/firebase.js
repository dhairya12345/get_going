// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxCoOVNFRf_9APuMzsa3qdKDuwoNyFADY",
  authDomain: "car-sharing-df3cf.firebaseapp.com",
  projectId: "car-sharing-df3cf",
  storageBucket: "car-sharing-df3cf.firebasestorage.app",
  messagingSenderId: "84006336225",
  appId: "1:84006336225:web:15ae222fd3662a341429a0",
  measurementId: "G-NPB3KPYZNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.auth().languageCode = 'it';

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
  });
  
  const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);