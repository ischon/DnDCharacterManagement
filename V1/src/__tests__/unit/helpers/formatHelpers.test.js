import { describe, it, expect } from 'vitest'
import { formatScore, formatWeight, formatLength } from '@/helpers/formatHelpers.js'

describe('formatHelpers', () => {
  describe('formatScore', () => {
    it('formats positive scores with + prefix', () => {
      expect(formatScore(5)).toBe('+5')
      expect(formatScore(10)).toBe('+10')
    })

    it('formats negative scores with - prefix', () => {
      expect(formatScore(-5)).toBe('-5')
      expect(formatScore(-10)).toBe('-10')
    })

    it('returns - for zero', () => {
      expect(formatScore(0)).toBe('-')
    })
  })

  describe('formatWeight', () => {
    it('returns - for zero weight', () => {
      expect(formatWeight(0)).toBe('-')
    })

    it('formats weights in pounds and kilograms', () => {
      expect(formatWeight(1)).toBe('1 lb | 0,5 kg')
      expect(formatWeight(10)).toBe('10 lb | 4,5 kg')
    })

    it('formats small weights in ounces and grams', () => {
      expect(formatWeight(0.05)).toBe('0,8 oz | 22,7 g')
    })

    it('removes trailing zeros', () => {
      expect(formatWeight(1.0)).toBe('1 lb | 0,5 kg')
    })
  })

  describe('formatLength', () => {
    it('returns - for zero length', () => {
      expect(formatLength(0)).toBe('-')
    })

    it('formats lengths in feet and centimeters', () => {
      expect(formatLength(1)).toBe('1 ft | 30,5 cm')
      expect(formatLength(10)).toBe('10 ft | 3 m')
    })

    it('formats small lengths in inches and centimeters', () => {
      expect(formatLength(0.5)).toBe('6 in | 15,2 cm')
    })

    it('removes trailing zeros', () => {
      expect(formatLength(1.0)).toBe('1 ft | 30,5 cm')
    })
  })
})
