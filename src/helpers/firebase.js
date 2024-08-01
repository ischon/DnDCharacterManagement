import {initializeApp} from "firebase/app";
import {getDoc, getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {getAnalytics} from "firebase/analytics";
import {collection, addDoc} from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import {GoogleAuthProvider, signInWithCredential} from "@firebase/auth";
import {Character} from "@/models/Character.js";
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




export class FirebaseHandler {

    app = undefined;
    auth = undefined;
    credential = undefined;
    firebaseUser = undefined;
    analytics = undefined;
    db = undefined;

    constructor() {
        this.paths = {
            user: "users/{uid}",
            character: "users/{uid}/characters/{characterId}",
        }
    }


    async setup() {
        // Initialize Firebase
        this.app = initializeApp(_firebaseConfig);

        // const provider = new GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        this.auth = getAuth(this.app);
        // auth.languageCode = 'it';
        // To apply the default browser preference instead of explicitly setting it.
        this.auth.useDeviceLanguage();

        this.credential = GoogleAuthProvider.credential(localStorage.getItem("Token"));
        await signInWithCredential(this.auth, this.credential);
        this.firebaseUser = getAuth().currentUser;
        // this.analytics = getAnalytics(app);
        // Initialize Cloud Firestore and get a reference to the service
        this.db = getFirestore(this.app);


    }

    getUserData() {

        return {}
    }

    async setData(data, path, ...pathSegments) {
        console.log("path", path);
        console.log("pathSegments", pathSegments);
        // return
        await setDoc(
            doc(this.db, path, ...pathSegments),
            data
        );
    }

    async getData(path, ...pathSegments) {
        const docRef = doc(this.db, path, ...pathSegments);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            return undefined;
        }
    }

    async setCharacterData(object) {
        try {
            let path = this.paths["character"]
                .replace("{uid}", this.firebaseUser.uid)
                .replace("{characterId}", object.id)
                .split("/");
            await this.setData(object, ...path);
            // console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async getCharacterData(characterId) {
        let path = this.paths["character"]
            .replace("{uid}", this.firebaseUser.uid)
            .replace("{characterId}", characterId)
            .split("/");
        const data = await this.getData(...path)
        return new Character(data);
    }
}

