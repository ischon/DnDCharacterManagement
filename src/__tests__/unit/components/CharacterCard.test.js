import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock FirebaseHandler module bovenaan zodat deze vóór de import van CharacterCard actief is
let getCharacterImageMock = vi.fn().mockResolvedValue(null)
vi.mock('@/helpers/firebase', () => ({
  FirebaseHandler: vi.fn().mockImplementation(() => ({
    setup: vi.fn().mockResolvedValue(undefined),
    getCharacterImage: (...args) => getCharacterImageMock(...args)
  }))
}))

import CharacterCard from '@/components/CharacterCard.vue'

describe('CharacterCard Component', () => {
  let wrapper
  const mockCharacter = {
    id: '1',
    detailName: 'Test Character',
    detailClass: 'Fighter',
    detailRace: 'Human'
  }

  beforeEach(() => {
    wrapper = mount(CharacterCard, {
      props: {
        character: mockCharacter
      }
    })
  })

  it('renders character name', () => {
    expect(wrapper.find('h3').text()).toBe('Test Character')
  })

  it('renders character class and race', () => {
    const paragraphs = wrapper.findAll('p')
    expect(paragraphs[0].text()).toBe('Fighter')
    expect(paragraphs[1].text()).toBe('Human')
  })

  it('shows placeholder image with first letter of name', () => {
    const placeholder = wrapper.find('.placeholder-image')
    expect(placeholder.text()).toBe('T')
  })

  // Voeg flushPromises helper toe
  function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0))
  }

  it('shows profile image when available', async () => {
    const mockImageUrl = 'https://example.com/image.jpg'
    getCharacterImageMock = vi.fn().mockResolvedValueOnce(mockImageUrl)

    const wrapperWithImage = mount(CharacterCard, {
      props: {
        character: mockCharacter
      }
    })

    await flushPromises()
    await wrapperWithImage.vm.$nextTick()

    const image = wrapperWithImage.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe(mockImageUrl)
  })

  it('handles missing character details gracefully', () => {
    const minimalCharacter = {
      id: '2',
      detailName: 'Minimal Character'
    }

    const minimalWrapper = mount(CharacterCard, {
      props: {
        character: minimalCharacter
      }
    })

    expect(minimalWrapper.find('h3').text()).toBe('Minimal Character')
    expect(minimalWrapper.findAll('p').length).toBe(0)
    expect(minimalWrapper.find('.placeholder-image').text()).toBe('M')
  })
})
