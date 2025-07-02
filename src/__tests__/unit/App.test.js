import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'

// Mock Firebase
vi.mock('@/helpers/firebase.js', () => ({
  FirebaseHandler: vi.fn().mockImplementation(() => ({
    setup: vi.fn().mockResolvedValue(true),
    firebaseUser: {
      uid: 'test-user-id-12345678'
    }
  }))
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null
  })),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Simulate auth state change
    callback({ uid: 'test-user-id-12345678' })
    return vi.fn() // Return unsubscribe function
  })
}))

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({}))
}))

vi.mock('@/services/firebase/config.js', () => ({
  firebaseConfig: {}
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle authentication state changes', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the auth state change
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.validToken).toBe(true)
    expect(wrapper.vm.uid).toBe('test-user')
  })

  it('should not setup Firebase when no token is present', async () => {
    // Mock no token
    localStorage.getItem.mockReturnValue(null)

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the watcher to run
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.uid).toBeUndefined()
  })

  it('should handle Firebase setup failure gracefully', async () => {
    // Mock token present but Firebase setup fails
    localStorage.getItem.mockReturnValue('fake-token')

    const { FirebaseHandler } = await import('@/helpers/firebase.js')
    FirebaseHandler.mockImplementation(() => ({
      setup: vi.fn().mockRejectedValue(new Error('Firebase setup failed')),
      firebaseUser: null
    }))

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the watcher to run
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should have tried to remove tokens
    expect(localStorage.removeItem).toHaveBeenCalledWith('Token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('UserData')
  })
})
