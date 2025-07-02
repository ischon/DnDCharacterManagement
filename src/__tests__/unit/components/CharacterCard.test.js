import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock Firebase auth
vi.mock('@/services/firebase/app.js', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id'
    }
  }
}))

// Mock Firebase storage
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(() => ({})),
  getDownloadURL: vi.fn().mockImplementation(() => {
    // Throw error to trigger placeholder image
    const error = new Error('Object not found')
    error.code = 'storage/object-not-found'
    throw error
  })
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

  it('shows placeholder image with first letter of name', async () => {
    await wrapper.vm.$nextTick()
    const placeholder = wrapper.find('.placeholder-image')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toBe('T')
  })

  // Voeg flushPromises helper toe
  function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0))
  }

  it('shows profile image when available', async () => {
    // Temporarily mock getDownloadURL to return a URL
    const { getDownloadURL } = await import('firebase/storage')
    vi.mocked(getDownloadURL).mockResolvedValueOnce('https://example.com/image.jpg')

    const wrapperWithImage = mount(CharacterCard, {
      props: {
        character: mockCharacter
      }
    })

    await flushPromises()
    await wrapperWithImage.vm.$nextTick()

    const image = wrapperWithImage.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('https://example.com/image.jpg')
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
