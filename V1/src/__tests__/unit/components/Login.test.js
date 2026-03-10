import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Login from '@/pages/Login.vue'
import flushPromises from 'flush-promises'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn().mockResolvedValue({
    user: {
      email: 'test@example.com',
      displayName: 'Test User'
    }
  })
}))

// Mock Firebase app
vi.mock('@/services/firebase/app.js', () => ({
  auth: {}
}))

// Mock the router import using a relative path
vi.mock('../../../router.js', () => {
  const push = vi.fn()
  return {
    default: {
      push
    }
  }
})

describe('Login Component', () => {
  let router

  beforeEach(async () => {
    // Clear localStorage and reset mocks
    localStorageMock.clear()
    vi.clearAllMocks()

    // Reset localStorage mock implementations
    localStorageMock.getItem.mockReset()
    localStorageMock.setItem.mockReset()

    // Get the router mock using the same relative path with dynamic import
    router = (await import('../../../router.js')).default
  })

  afterAll(() => {
    // Restore original window.location
    vi.restoreAllMocks()
  })

  it('renders login button', async () => {
    const wrapper = mount(Login)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Sign in with Google')
  })

  it('handles successful login', async () => {
    // Mock window.location.href
    const originalLocation = window.location
    delete window.location
    window.location = { href: '' }

    const wrapper = mount(Login)

    // Click the login button
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Verify that window.location.href was set
    expect(window.location.href).toBe('/')

    // Restore original location
    window.location = originalLocation
  })
})
