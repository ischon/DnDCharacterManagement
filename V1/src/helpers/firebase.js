'use strict'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { auth } from '@/services/firebase/app.js'
import { Character } from '@/models/Character.js'

export class FirebaseHandler {
  constructor() {
    this.paths = {
      user: 'users/{uid}',
      characters: 'users/{uid}/characters',
      character: 'users/{uid}/characters/{characterId}'
    }
    this.db = null
    this.storage = null
    this.auth = auth
  }

  async setup() {
    try {
      this.db = getFirestore()
      this.storage = getStorage()
      console.log('Firebase services initialized successfully')
    } catch (error) {
      console.error('Error initializing Firebase services:', error)
      throw error
    }
  }

  // Method to check if user is authenticated
  isAuthenticated() {
    return this.auth && this.auth.currentUser !== null
  }

  // Method to get current user
  getCurrentUser() {
    return this.auth?.currentUser || null
  }

  // Method to sign out
  async signOut() {
    if (this.auth) {
      await this.auth.signOut()
    }
  }

  async setData(data, path, ...pathSegments) {
    try {
      await setDoc(doc(this.db, path, ...pathSegments), data)
    } catch (error) {
      console.error('Error setting data:', error)
      throw error
    }
  }

  async getData(path, ...pathSegments) {
    try {
      const docRef = doc(this.db, path, ...pathSegments)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data()
      }

      console.warn('No document found at path:', path, ...pathSegments)
      return undefined
    } catch (error) {
      console.error('Error getting data:', error)
      throw error
    }
  }

  async getCharactersData() {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('No authenticated user found')
      }

      const path = this.paths.characters.replace('{uid}', currentUser.uid)
      const collectionRef = collection(this.db, path)
      const charactersData = await getDocs(collectionRef)

      return charactersData.docs.map(doc => new Character(doc.data(), doc.id))
    } catch (error) {
      console.error('Error getting characters data:', error)
      throw error
    }
  }

  async setCharacterData(character) {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('No authenticated user found')
      }

      const path = this.paths.character
        .replace('{uid}', currentUser.uid)
        .replace('{characterId}', character.id)
        .split('/')
      await this.setData(character, ...path)
    } catch (error) {
      console.error('Error setting character data:', error)
      throw error
    }
  }

  async getCharacterData(characterId) {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('No authenticated user found')
      }

      const path = this.paths.character
        .replace('{uid}', currentUser.uid)
        .replace('{characterId}', characterId)
        .split('/')
      const data = await this.getData(...path)
      return new Character(data, characterId)
    } catch (error) {
      console.error('Error getting character data:', error)
      throw error
    }
  }

  async getCharacterImage(characterId) {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('No authenticated user found')
      }

      const path = this.paths.character
        .replace('{uid}', currentUser.uid)
        .replace('{characterId}', characterId)
      const storageRef = ref(this.storage, path)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error('Error getting character image:', error)
      // Handle specific storage errors
      switch (error.code) {
        case 'storage/object-not-found':
          console.warn('Character image not found')
          return null
        case 'storage/unauthorized':
          console.error('Unauthorized to access character image')
          throw error
        case 'storage/canceled':
          console.warn('Character image download canceled')
          return null
        default:
          throw error
      }
    }
  }

  async setCharacterImage(characterId, file) {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('No authenticated user found')
      }

      const path = this.paths.character
        .replace('{uid}', currentUser.uid)
        .replace('{characterId}', characterId)
      const storageRef = ref(this.storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      console.debug('Image upload successful:', snapshot)
      return snapshot
    } catch (error) {
      console.error('Error setting character image:', error)
      throw error
    }
  }
}
