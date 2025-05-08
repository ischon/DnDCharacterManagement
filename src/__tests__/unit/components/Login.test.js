import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '@/pages/Login.vue'

const router = {
  push: vi.fn(),
  replace: vi.fn(),
  beforeEach: vi.fn()
}

// Mock Google Login
vi.mock('vue3-google-login', () => ({
  default: {
    install: vi.fn()
  },
  googleAuthCodeLogin: vi.fn().mockResolvedValue({
    code: 'test-code',
    scope: 'test-scope'
  })
}))

describe('Login Component', () => {
  beforeEach(() => {
    router.push.mockClear()
    router.replace.mockClear()
  })

  it('renders login button', () => {
    const wrapper = mount(Login, {
      global: {
        mocks: {
          $router: router
        }
      }
    })
    const loginButton = wrapper.find('button')
    expect(loginButton.exists()).toBe(true)
    expect(loginButton.text().toLowerCase()).toContain('login')
  })

  it('handles successful login', async () => {
    const wrapper = mount(Login, {
      global: {
        mocks: {
          $router: router
        }
      }
    })
    const loginButton = wrapper.find('button')

    await loginButton.trigger('click')

    expect(router.push).toHaveBeenCalledWith('/home')
  })
})
