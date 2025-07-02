import { describe, it, expect, vi } from 'vitest'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

// Mock Firebase
vi.mock('@/helpers/firebase.js', () => ({
  FirebaseHandler: vi.fn().mockImplementation(() => ({
    setup: vi.fn().mockResolvedValue(true),
    firebaseUser: {
      uid: 'test-user-id'
    }
  }))
}))

// Mock vue3-google-login
vi.mock('vue3-google-login', () => ({
  GoogleLogin: {
    name: 'GoogleLogin',
    template: '<div>GoogleLogin</div>'
  }
}))

// Partial mock van vue-router
vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    RouterLink: {
      name: 'RouterLink',
      template: '<a><slot /></a>'
    },
    RouterView: {
      name: 'RouterView',
      template: '<div><slot /></div>'
    }
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

describe('main.js', () => {
  it('should create a Vue app and mount it', async () => {
    // Zet een fake token in localStorage
    localStorage.getItem.mockReturnValue('fake-token')

    const app = createApp(App)
    app.use(router)
    app.use(store)
    const div = document.createElement('div')
    document.body.appendChild(div)

    // Wacht even tot Firebase setup is voltooid
    await new Promise(resolve => setTimeout(resolve, 100))

    const vm = app.mount(div)
    expect(vm).toBeDefined()
    // Check of het root component App is
    expect(vm.$.type.__name).toBe('App')
  })
})
