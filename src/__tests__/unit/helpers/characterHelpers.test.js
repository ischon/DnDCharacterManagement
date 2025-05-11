import { describe, it, expect } from 'vitest'
import { calculateCoins, toCopperCoins, calculateAbilityModifier, longRest } from '@/helpers/characterHelpers.js'

describe('characterHelpers', () => {
  describe('calculateCoins', () => {
    it('converts coins correctly', () => {
      const input = { cp: 100, sp: 10, gp: 1 }
      const expected = {
        cp: 100 + 10 * 10 + 1 * 100,
        sp: 100 * 0.1 + 10 + 1 * 10,
        ep: 100 * 0.02 + 10 * 0.2 + 1 * 2,
        gp: 100 * 0.01 + 10 * 0.1 + 1,
        pp: 100 * 0.001 + 10 * 0.01 + 1 * 0.1
      }
      expect(calculateCoins(input)).toEqual(expected)
    })

    it('handles zero values', () => {
      const input = { cp: 0, sp: 10, gp: 0 }
      const expected = {
        cp: 10 * 10,
        sp: 10,
        ep: 10 * 0.2,
        gp: 10 * 0.1,
        pp: 10 * 0.01
      }
      expect(calculateCoins(input)).toEqual(expected)
    })
  })

  describe('toCopperCoins', () => {
    it('converts COPPER correctly', () => {
      expect(toCopperCoins(100, 'COPPER')).toBe(100)
    })
    it('converts SILVER correctly', () => {
      expect(toCopperCoins(10, 'SILVER')).toBe(100)
    })
    it('converts ELECTRUM correctly', () => {
      expect(toCopperCoins(10, 'ELECTRUM')).toBe(500)
    })
    it('converts GOLD correctly', () => {
      expect(toCopperCoins(10, 'GOLD')).toBe(1000)
    })
    it('converts PLATINUM correctly', () => {
      expect(toCopperCoins(10, 'PLATINUM')).toBe(10000)
    })
  })

  describe('calculateAbilityModifier', () => {
    it('calculates modifier for score 10', () => {
      expect(calculateAbilityModifier(10)).toBe(0)
    })
    it('calculates modifier for score 12', () => {
      expect(calculateAbilityModifier(12)).toBe(1)
    })
    it('calculates modifier for score 8', () => {
      expect(calculateAbilityModifier(8)).toBe(-1)
    })
  })

  describe('longRest', () => {
    it('resets hit points and hit dice on full rest', () => {
      const character = {
        statHitPointsCurrent: 50,
        statHitPointMaximumValue: 100,
        statCurrentAmountHitDice: 2,
        statMaxHitDice: 5,
        spellcastingSpells: {
          1: { slotsUsed: 2 },
          2: { slotsUsed: 1 }
        }
      }
      longRest(character, true)
      expect(character.statHitPointsCurrent).toBe(100)
      expect(character.statCurrentAmountHitDice).toBe(5)
      expect(character.spellcastingSpells[1].slotsUsed).toBe(0)
      expect(character.spellcastingSpells[2].slotsUsed).toBe(0)
    })

    it('resets hit points and partially restores hit dice on partial rest', () => {
      const character = {
        statHitPointsCurrent: 50,
        statHitPointMaximumValue: 100,
        statCurrentAmountHitDice: 2,
        statMaxHitDice: 5,
        spellcastingSpells: {
          1: { slotsUsed: 2 },
          2: { slotsUsed: 1 }
        }
      }
      longRest(character, false)
      expect(character.statHitPointsCurrent).toBe(100)
      expect(character.statCurrentAmountHitDice).toBe(4) // 2 + Math.floor(5/2) = 4
      expect(character.spellcastingSpells[1].slotsUsed).toBe(0)
      expect(character.spellcastingSpells[2].slotsUsed).toBe(0)
    })
  })
})
