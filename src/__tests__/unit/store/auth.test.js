import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/store/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('sets user and updates authentication state', () => {
    const store = useAuthStore()
    const mockUser = { id: 1, name: 'Test User' }

    store.setUser(mockUser)

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('clears user and updates authentication state', () => {
    const store = useAuthStore()
    const mockUser = { id: 1, name: 'Test User' }

    store.setUser(mockUser)
    store.clearUser()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
