import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '@/pages/Home.vue'

// Mock FirebaseHandler
vi.mock('@/helpers/firebase', () => ({
  FirebaseHandler: vi.fn().mockImplementation(() => ({
    setup: vi.fn().mockResolvedValue(undefined),
    getCharactersData: vi.fn().mockResolvedValue([]),
    setCharacterData: vi.fn().mockResolvedValue(undefined)
  }))
}))

// Mock router-link component
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    template: '<a class="item"><slot /></a>'
  }
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

  it('shows loading state initially', () => {
    expect(wrapper.text()).toContain('Loading...')
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

    vi.mocked(wrapper.vm.firebaseHandler.getCharactersData).mockResolvedValueOnce(mockCharacters)
    await wrapper.vm.loadCharacters()
    await wrapper.vm.$nextTick()

    const characterCards = wrapper.findAll('.character-card')
    expect(characterCards.length).toBe(3)
  })

  it('renders example character when no demo character exists', async () => {
    vi.mocked(wrapper.vm.firebaseHandler.getCharactersData).mockResolvedValueOnce([])
    await wrapper.vm.loadCharacters()
    await wrapper.vm.$nextTick()

    const exampleCard = wrapper.find('.example-character')
    expect(exampleCard.exists()).toBe(true)
  })
})
