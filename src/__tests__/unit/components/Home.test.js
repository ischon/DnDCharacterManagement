import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '@/pages/Home.vue'

// Mock Firebase auth
vi.mock('@/services/firebase/app.js', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id'
    }
  }
}))

// Mock Firebase auth onAuthStateChanged
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Simulate auth state change
    callback({ uid: 'test-user-id' })
    return vi.fn() // Return unsubscribe function
  })
}))

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(() => ({})),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false }))
}))

// Mock router-link component
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    template: '<a class="item"><slot /></a>'
  },
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

describe('Home Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Home, {
      global: {
        stubs: {
          'character-card': {
            template: '<div class="character-card"><slot name="prefix"></slot></div>'
          }
        }
      }
    })
  })

  it('renders characters heading', () => {
    expect(wrapper.text()).toContain('Your Characters')
  })

  it('shows loading state initially', async () => {
    // Create a new wrapper that hasn't mounted yet
    const loadingWrapper = mount(Home, {
      global: {
        stubs: {
          'character-card': {
            template: '<div class="character-card"><slot name="prefix"></slot></div>'
          }
        }
      }
    })

    // Check loading state immediately after mount
    expect(loadingWrapper.text()).toContain('Loading...')
  })

  it('renders add character link', async () => {
    // Wacht tot loading verdwenen is
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    const addLink = wrapper.find('.item')
    expect(addLink.exists()).toBe(true)
    expect(addLink.text()).toContain('Add new character')
  })

  it('renders character cards when data is loaded', async () => {
    const mockCharacters = [
      { id: '1', detailName: 'Character 1' },
      { id: '2', detailName: 'Character 2' }
    ]

    // Mock the getDocs function to return mock characters
    const { getDocs } = await import('firebase/firestore')
    vi.mocked(getDocs).mockResolvedValueOnce({
      docs: mockCharacters.map(char => ({
        id: char.id,
        data: () => char
      }))
    })

    await wrapper.vm.loadCharacters()
    await wrapper.vm.$nextTick()

    const characterCards = wrapper.findAll('.character-card')
    expect(characterCards.length).toBeGreaterThan(0)
  })

  it('renders example character when no demo character exists', async () => {
    // Mock the getDocs function to return empty array
    const { getDocs } = await import('firebase/firestore')
    vi.mocked(getDocs).mockResolvedValueOnce({
      docs: []
    })

    await wrapper.vm.loadCharacters()
    await wrapper.vm.$nextTick()

    const exampleCard = wrapper.find('.example-character')
    expect(exampleCard.exists()).toBe(true)
  })
})
