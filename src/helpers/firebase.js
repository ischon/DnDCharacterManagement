"use strict"
import {initializeApp} from "firebase/app";
import {getDoc, getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getAnalytics} from "firebase/analytics";
import {doc, setDoc} from "firebase/firestore";
import {GoogleAuthProvider, signInWithCredential} from "@firebase/auth";
import {getStorage, ref, uploadString, uploadBytes, getDownloadURL} from "firebase/storage";
import {Character} from "@/models/Character.js";
import {firebaseSettings} from "@/firebase-settings.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export class FirebaseHandler {

    app = undefined;
    auth = undefined;
    credential = undefined;
    firebaseUser = undefined;
    analytics = undefined;
    db = undefined;
    storage = undefined;

    constructor() {
        this.paths = {
            user: "users/{uid}",
            character: "users/{uid}/characters/{characterId}",
        }
    }


    async setup() {
        // Initialize Firebase
        this.app = initializeApp(firebaseSettings);

        // const provider = new GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        this.auth = getAuth(this.app);
        // auth.languageCode = 'it';
        // To apply the default browser preference instead of explicitly setting it.
        this.auth.useDeviceLanguage();

        this.credential = GoogleAuthProvider.credential(localStorage.getItem("Token"));
        await signInWithCredential(this.auth, this.credential);
        this.firebaseUser = getAuth().currentUser;
        this.analytics = getAnalytics(this.app);
        // Initialize Cloud Firestore and get a reference to the service
        this.db = getFirestore(this.app);
        this.storage = getStorage(this.app);


    }

    getUserData() {

        return {}
    }

    async setData(data, path, ...pathSegments) {
        // return
        await setDoc(doc(this.db, path, ...pathSegments), data);
    }

    async getData(path, ...pathSegments) {
        const docRef = doc(this.db, path, ...pathSegments);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
            return undefined;
        }
    }

    async setCharacterData(character) {
        try {
            let path = this.paths["character"]
                .replace("{uid}", this.firebaseUser.uid)
                .replace("{characterId}", character.id)
                .split("/");
            await this.setData(character, ...path);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async getCharacterData(characterId) {
        const path = this.paths["character"]
            .replace("{uid}", this.firebaseUser.uid)
            .replace("{characterId}", characterId)
            .split("/");
        const data = await this.getData(...path)
            .catch((error) => {
                console.error(error)
            }
        )
        return new Character(data, characterId);
    }

    async getCharacterImage(characterId) {
        const path = this.paths["character"]
            .replace("{uid}", this.firebaseUser.uid)
            .replace("{characterId}", characterId)
        const storageRef = ref(this.storage, path);
        return await getDownloadURL(storageRef).catch((error) => {
            console.error("Error getting document:", error);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/object-not-found':
                    // File doesn't exist
                    break;
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect the server response
                    break;
            }
        });
    }

    async setCharacterImage(characterId, file) {
        const path = this.paths["character"]
            .replace("{uid}", this.firebaseUser.uid)
            .replace("{characterId}", characterId)
        const storageRef = ref(this.storage, path);
        await uploadBytes(storageRef, file).then((snapshot) => {
            console.debug(snapshot);
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
}

