import * as firebase from 'firebase';

require('@firebase/firestore');


const firebaseConfig = {
    apiKey: "AIzaSyCllhi-k5wGKoViN8-CB_BSAav6UP2ExKo",
    authDomain: "booksanta-ca6c9.firebaseapp.com",
    projectId: "booksanta-ca6c9",
    storageBucket: "booksanta-ca6c9.appspot.com",
    messagingSenderId: "1456582798",
    appId: "1:1456582798:web:a9c03b4c750e68ec7599df"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();