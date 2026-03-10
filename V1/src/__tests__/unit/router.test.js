import { describe, it, expect, vi } from 'vitest'
import router, { routes as importedRoutes } from '@/router'

// Mock de componenten
vi.mock('@/pages/Home.vue', () => ({
  default: {
    template: '<div>Home</div>'
  }
}))

vi.mock('@/pages/Login.vue', () => ({
  default: {
    template: '<div>Login</div>'
  }
}))

vi.mock('@/pages/Logout.vue', () => ({
  default: {
    template: '<div>Logout</div>'
  }
}))

vi.mock('@/pages/CharacterOverview.vue', () => ({
  default: {
    template: '<div>Character Overview</div>'
  }
}))

// Mock vue3-google-login
vi.mock('vue3-google-login', () => ({
  decodeCredential: vi.fn()
}))

describe('router.js', () => {
  it('should have the correct routes', () => {
    // Gebruik de direct geïmporteerde routes
    const routes = importedRoutes || (router && router.options && router.options.routes)
    expect(routes).toBeDefined()
    expect(routes.length).toBeGreaterThan(0)

    // Controleer specifieke routes
    const homeRoute = routes.find(route => route.path === '/')
    expect(homeRoute).toBeDefined()
    expect(homeRoute.meta.requiresAuth).toBe(true)

    const loginRoute = routes.find(route => route.path === '/login')
    expect(loginRoute).toBeDefined()
    expect(loginRoute.meta).toBeUndefined()

    const characterRoute = routes.find(route => route.path === '/character/:id')
    expect(characterRoute).toBeDefined()
    expect(characterRoute.meta.requiresAuth).toBe(true)
  })
})
