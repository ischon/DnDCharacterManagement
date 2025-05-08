import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '@/pages/Home.vue'

// Mock FirebaseHandler
vi.mock('@/helpers/firebase', () => ({
  FirebaseHandler: vi.fn().mockImplementation(() => ({
    setup: vi.fn(),
    getCharactersData: vi.fn().mockResolvedValue([])
  }))
}))

describe('Home Component', () => {
  it('renders characters heading', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toContain('Your Characters')
  })

  it('renders add character button', () => {
    const wrapper = mount(Home)
    const addButton = wrapper.find('button')
    expect(addButton.exists()).toBe(true)
    expect(addButton.text()).toContain('Add new character')
  })

  it('renders router-link to characters', () => {
    const wrapper = mount(Home)
    const routerLinks = wrapper.findAll('router-link')
    expect(routerLinks.length).toBeGreaterThan(0)
  })
})
