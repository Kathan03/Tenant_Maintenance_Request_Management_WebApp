import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDhU3hRJC042ZJvhP7Z9vss8RHvz7vTAjg",
    authDomain: "cmpsc487-project-2.firebaseapp.com",
    projectId: "cmpsc487-project-2",
    storageBucket: "cmpsc487-project-2.appspot.com",
    messagingSenderId: "1061703618022",
    appId: "1:1061703618022:web:b8882ffb3c785ffb785a27",
    measurementId: "G-7KTLE3N14G"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  export {db, auth, storage};