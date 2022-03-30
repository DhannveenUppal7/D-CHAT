import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// Real Config
const firebaseConfig = {
    apiKey: "AIzaSyCAeKraVAVc3Rw7WBpZR8oNWB-Pn87W6e8",
    authDomain: "d-chat-da95e.firebaseapp.com",
    projectId: "d-chat-da95e",
    storageBucket: "d-chat-da95e.appspot.com",
    messagingSenderId: "827144366474",
    appId: "1:827144366474:web:5229f7dc41132a58068073",
    measurementId: "G-9YBZ97HB85"
};


//Test Config
// const firebaseConfig = {
//     apiKey: "AIzaSyDfCCMlN4qImVZQuQQwVXuhU9TmAqu8GJY",
//     authDomain: "receiver-cd307.firebaseapp.com",
//     projectId: "receiver-cd307",
//     storageBucket: "receiver-cd307.appspot.com",
//     messagingSenderId: "94376945288",
//     appId: "1:94376945288:web:fd4763b0fc7806ba1d613d"
// };


let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage }