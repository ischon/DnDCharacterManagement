import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Logout from '@/pages/Logout.vue'

// Mock router import
vi.mock('../../../router.js', () => {
  const replace = vi.fn()
  return {
    default: {
      push: vi.fn(),
      replace
    },
    __esModule: true,
    replace
  }
})

// Mock Firebase
vi.mock('@/services/firebase/config', () => ({
  auth: {
    signOut: vi.fn().mockResolvedValue()
  }
}))

describe('Logout Component', () => {
  let routerModule
  beforeEach(async () => {
    routerModule = await import('../../../router.js')
    routerModule.replace.mockClear()
  })

  it('redirects to login on mount', async () => {
    mount(Logout)
    await new Promise(r => setTimeout(r, 0))
    expect(routerModule.replace).toHaveBeenCalledWith('/login')
  })
})
