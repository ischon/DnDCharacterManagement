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

// Mock vue3-google-login
vi.mock('vue3-google-login', () => ({
  GoogleLogin: defineComponent({
    name: 'GoogleLogin',
    props: ['callback'],
    methods: {
      async onClick() {
        console.log('Button clicked')
        await this.callback({ credential: 'mock-jwt-token' })
      }
    },
    template: '<button @click="onClick">Login with Google</button>'
  }),
  decodeCredential: vi.fn().mockReturnValue({
    email: 'test@example.com',
    name: 'Test User'
  })
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
    expect(wrapper.find('button').text()).toBe('Login with Google')
  })

  it('handles successful login', async () => {
    const wrapper = mount(Login)

    // Click the login button
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Verify that localStorage.setItem was called with the correct values
    expect(localStorageMock.setItem).toHaveBeenCalledWith('Token', 'mock-jwt-token')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'UserData',
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User'
      })
    )

    // Verify that router.push was called with the correct path
    expect(router.push).toHaveBeenCalledWith({ path: '/', replace: true })
  })
})
