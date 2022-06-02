import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    // Firebase Config Here!
};



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
