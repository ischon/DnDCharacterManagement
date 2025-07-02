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

  it('should setup Firebase when token is present', async () => {
    // Mock token present
    localStorage.getItem.mockReturnValue('fake-token')

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the watcher to run
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.uid).toBe('test-use')
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
