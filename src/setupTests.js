import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Vue Router
vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    beforeEach: vi.fn(),
    currentRoute: {
      value: {
        path: '/',
        name: 'home'
      }
    }
  })),
  createWebHistory: vi.fn()
}))

// Mock Firebase
vi.mock('@/services/firebase/config', () => ({
  firebaseConfig: {
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef'
  },
  auth: {
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn()
  },
  firestore: {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn()
  }
}))

// Mock Google Login
vi.mock('vue3-google-login', () => ({
  default: {
    install: vi.fn()
  },
  googleAuthCodeLogin: vi.fn(),
  googleSdkLoaded: vi.fn(() => Promise.resolve(true)),
  googleOneTap: vi.fn(),
  googleLogout: vi.fn()
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Global test configuration
config.global.mocks = {
  $router: {
    push: vi.fn(),
    replace: vi.fn()
  },
  $route: {
    path: '/',
    name: 'home'
  }
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
