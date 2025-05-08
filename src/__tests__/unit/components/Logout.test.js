import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Logout from '@/pages/Logout.vue'

const router = {
  push: vi.fn(),
  replace: vi.fn(),
  beforeEach: vi.fn()
}

// Mock Firebase
vi.mock('@/services/firebase/config', () => ({
  auth: {
    signOut: vi.fn().mockResolvedValue()
  }
}))

describe('Logout Component', () => {
  beforeEach(() => {
    router.push.mockClear()
    router.replace.mockClear()
  })

  it('redirects to login on mount', async () => {
    const wrapper = mount(Logout, {
      global: {
        mocks: {
          $router: router
        }
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for async operations

    expect(router.replace).toHaveBeenCalledWith('/login')
  })
})
