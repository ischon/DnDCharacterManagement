import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FirebaseHandler } from '@/helpers/firebase.js'
import { getDownloadURL, uploadBytes } from 'firebase/storage'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => 'app')
}))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ useDeviceLanguage: vi.fn(), currentUser: { uid: 'uid' } })),
  GoogleAuthProvider: { credential: vi.fn(() => 'credential') },
  signInWithCredential: vi.fn(() => Promise.resolve())
}))
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => 'analytics')
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'db'),
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({ foo: 'bar' }) })),
  doc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] }))
}))
vi.mock('@/models/Character.js', () => ({
  Character: vi.fn((data, id) => ({ ...data, id }))
}))
vi.mock('@/services/firebase/config.js', () => ({
  firebaseConfig: {}
}))
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => 'storage'),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn()
}))

// Voeg localStorage mock toe
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} }
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

// Pas getDocs mock aan
import * as firestore from 'firebase/firestore'
vi.spyOn(firestore, 'getDocs')

describe('FirebaseHandler', () => {
  let handler
  beforeEach(() => {
    handler = new FirebaseHandler()
    localStorage.clear()
    localStorage.setItem('Token', 'token')
  })

  it('should construct with default properties', () => {
    expect(handler.paths).toBeDefined()
    expect(handler.app).toBeNull()
    expect(handler.auth).toBeNull()
    expect(handler.credential).toBeNull()
    expect(handler.firebaseUser).toBeNull()
    expect(handler.analytics).toBeNull()
    expect(handler.db).toBeNull()
    expect(handler.storage).toBeNull()
  })

  it('should setup firebase and sign in', async () => {
    await expect(handler.setup()).resolves.toBe(true)
    expect(handler.app).toBe('app')
    expect(handler.auth).toBeDefined()
    expect(handler.analytics).toBe('analytics')
    expect(handler.db).toBe('db')
    expect(handler.storage).toBe('storage')
  })

  it('should throw if no token in setup', async () => {
    localStorage.removeItem('Token')
    await expect(handler.setup()).rejects.toThrow('No authentication token found')
  })

  it('should call setData', async () => {
    handler.db = 'db'
    const data = { foo: 'bar' }
    await expect(handler.setData(data, 'path', 'seg')).resolves.toBeUndefined()
  })

  it('should call getData and return data', async () => {
    handler.db = 'db'
    const data = await handler.getData('path', 'seg')
    expect(data).toEqual({ foo: 'bar' })
  })

  it('should getCharactersData and return array of Character', async () => {
    handler.db = 'db'
    handler.firebaseUser = { uid: 'uid' }
    const mockDocs = [
      { data: () => ({ foo: 'bar' }), id: 'id1' },
      { data: () => ({ bar: 'baz' }), id: 'id2' }
    ]
    firestore.getDocs.mockResolvedValueOnce({ docs: mockDocs })
    const result = await handler.getCharactersData()
    expect(result[0]).toMatchObject({ foo: 'bar', id: 'id1' })
    expect(result[1]).toMatchObject({ bar: 'baz', id: 'id2' })
  })

  it('should call setCharacterData', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.db = 'db'
    handler.setData = vi.fn(() => Promise.resolve())
    const character = { id: 'char1' }
    await expect(handler.setCharacterData(character)).resolves.toBeUndefined()
    expect(handler.setData).toHaveBeenCalled()
  })

  it('should call getCharacterData and return Character', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.db = 'db'
    handler.getData = vi.fn(() => Promise.resolve({ foo: 'bar' }))
    const result = await handler.getCharacterData('char1')
    expect(result).toMatchObject({ foo: 'bar', id: 'char1' })
  })

  it('should get character image url', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.storage = 'storage'
    getDownloadURL.mockResolvedValue('url')
    const result = await handler.getCharacterImage('char1')
    expect(result).toBe('url')
  })

  it('should upload character image', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.storage = 'storage'
    uploadBytes.mockResolvedValue('snapshot')
    const file = new Blob(['test'], { type: 'image/png' })
    const result = await handler.setCharacterImage('char1', file)
    expect(result).toBe('snapshot')
  })

  it('should handle storage/object-not-found error in getCharacterImage', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.storage = 'storage'
    const error = new Error('Object not found')
    error.code = 'storage/object-not-found'
    getDownloadURL.mockImplementation(() => Promise.reject(error))
    const result = await handler.getCharacterImage('char1')
    expect(result).toBeNull()
  })

  it('should handle storage/unauthorized error in getCharacterImage', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.storage = 'storage'
    const error = new Error('Unauthorized')
    error.code = 'storage/unauthorized'
    getDownloadURL.mockImplementation(() => Promise.reject(error))
    await expect(handler.getCharacterImage('char1')).rejects.toThrow('Unauthorized')
  })

  it('should handle storage/canceled error in getCharacterImage', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.storage = 'storage'
    const error = new Error('Canceled')
    error.code = 'storage/canceled'
    getDownloadURL.mockImplementation(() => Promise.reject(error))
    const result = await handler.getCharacterImage('char1')
    expect(result).toBeNull()
  })

  it('should handle error in setCharacterImage', async () => {
    handler.firebaseUser = { uid: 'uid' }
    handler.storage = 'storage'
    const error = new Error('Upload failed')
    uploadBytes.mockImplementation(() => Promise.reject(error))
    await expect(handler.setCharacterImage('char1', new Blob(['test'], { type: 'image/png' }))).rejects.toThrow('Upload failed')
  })
})
