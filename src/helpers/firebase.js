"use strict"
import {initializeApp} from "firebase/app";
import {collection, doc, setDoc, getDoc, getDocs, getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import {getAnalytics} from "firebase/analytics";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {Character} from "@/models/Character.js";
import { firebaseConfig } from "@/services/firebase/config.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export class FirebaseHandler {
    constructor() {
        this.paths = {
            user: "users/{uid}",
            characters: "users/{uid}/characters",
            character: "users/{uid}/characters/{characterId}",
        }
        this.app = null;
        this.auth = null;
        this.credential = null;
        this.firebaseUser = null;
        this.analytics = null;
        this.db = null;
        this.storage = null;
    }

    async setup() {
        try {
            // Initialize Firebase
            this.app = initializeApp(firebaseConfig);
            this.auth = getAuth(this.app);
            this.auth.useDeviceLanguage();

            // Get stored token
            const token = localStorage.getItem("Token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            // Initialize credential and sign in
            this.credential = GoogleAuthProvider.credential(token);
            await signInWithCredential(this.auth, this.credential);
            this.firebaseUser = getAuth().currentUser;

            if (!this.firebaseUser) {
                throw new Error("Failed to get current user after sign in");
            }

            // Initialize other Firebase services
            this.analytics = getAnalytics(this.app);
            this.db = getFirestore(this.app);
            this.storage = getStorage(this.app);

            return true;
        } catch (error) {
            console.error("Error in Firebase setup:", error);
            throw error;
        }
    }

    async setData(data, path, ...pathSegments) {
        try {
            await setDoc(doc(this.db, path, ...pathSegments), data);
        } catch (error) {
            console.error("Error setting data:", error);
            throw error;
        }
    }

    async getData(path, ...pathSegments) {
        try {
            const docRef = doc(this.db, path, ...pathSegments);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            }

            console.warn("No document found at path:", path, ...pathSegments);
            return undefined;
        } catch (error) {
            console.error("Error getting data:", error);
            throw error;
        }
    }

    async getCharactersData() {
        try {
            const path = this.paths.characters.replace("{uid}", this.firebaseUser.uid);
            const collectionRef = collection(this.db, path);
            const charactersData = await getDocs(collectionRef);

            return charactersData.docs.map(doc => new Character(doc.data(), doc.id));
        } catch (error) {
            console.error("Error getting characters data:", error);
            throw error;
        }
    }

    async setCharacterData(character) {
        try {
            const path = this.paths.character
                .replace("{uid}", this.firebaseUser.uid)
                .replace("{characterId}", character.id)
                .split("/");
            await this.setData(character, ...path);
        } catch (error) {
            console.error("Error setting character data:", error);
            throw error;
        }
    }

    async getCharacterData(characterId) {
        try {
            const path = this.paths.character
                .replace("{uid}", this.firebaseUser.uid)
                .replace("{characterId}", characterId)
                .split("/");
            const data = await this.getData(...path);
            return new Character(data, characterId);
        } catch (error) {
            console.error("Error getting character data:", error);
            throw error;
        }
    }

    async getCharacterImage(characterId) {
        try {
            const path = this.paths.character
                .replace("{uid}", this.firebaseUser.uid)
                .replace("{characterId}", characterId);
            const storageRef = ref(this.storage, path);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Error getting character image:", error);
            // Handle specific storage errors
            switch (error.code) {
                case 'storage/object-not-found':
                    console.warn("Character image not found");
                    return null;
                case 'storage/unauthorized':
                    console.error("Unauthorized to access character image");
                    throw error;
                case 'storage/canceled':
                    console.warn("Character image download canceled");
                    return null;
                default:
                    throw error;
            }
        }
    }

    async setCharacterImage(characterId, file) {
        try {
            const path = this.paths.character
                .replace("{uid}", this.firebaseUser.uid)
                .replace("{characterId}", characterId);
            const storageRef = ref(this.storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            console.debug("Image upload successful:", snapshot);
            return snapshot;
        } catch (error) {
            console.error("Error setting character image:", error);
            throw error;
        }
    }
}
