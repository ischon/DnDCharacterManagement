import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {getAnalytics} from "firebase/analytics";
import {collection, addDoc} from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import {GoogleAuthProvider, signInWithCredential} from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const _firebaseConfig = {
    apiKey: "AIzaSyCGqv0Va9Zsc1UQQiYZ-dV6F9yy2ADTptU",
    authDomain: "dnd-character-management.firebaseapp.com",
    projectId: "dnd-character-management",
    storageBucket: "dnd-character-management.appspot.com",
    messagingSenderId: "640359260149",
    appId: "1:640359260149:web:71a021fb14eb388535cabc",
    measurementId: "G-0327ZHFLB7"
};

console.log("before app")
const app = initializeApp(_firebaseConfig);
console.log("after app")

// const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth(app);
// auth.languageCode = 'it';
// To apply the default browser preference instead of explicitly setting it.
// auth.useDeviceLanguage();


const credential = GoogleAuthProvider.credential(localStorage.getItem("Token"));
// console.log(credential)
await signInWithCredential(auth, credential);
// console.log(userCredential)
export const firebaseUser = getAuth().currentUser;
console.log(firebaseUser)
// const auth = getAuth(app);
export const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

const userPath = "users/{uid}"

export class FirebaseHandler {


    constructor() {
        // Initialize Firebase

    }

    getUserData() {

        return {}
    }

    async setUserData() {
        try {
            // const doc = {
            //     first: "Ada",
            //     last: "Lovelace",
            //     born: 1815
            // }

            // await addDoc(
            //     collection(db, "/users", firebaseUser.uid)),
            //     doc,
            //     {merge: true}
            // );


            /*const docRef =*/ await setDoc(
                doc(db, "users", firebaseUser.uid),
                {
                    name: "Los Angeles",
                    state: "NL",
                    country: "USA"
                }
            );
            // console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

