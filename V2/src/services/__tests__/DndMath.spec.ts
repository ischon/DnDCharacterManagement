import { describe, it, expect } from 'vitest';
import {
  calculateModifier,
  calculateProficiencyBonus,
  calculatePassivePerception,
  calculateInitiative,
  calculateAC
} from '../DndMath';

describe('DndMath', () => {
  describe('calculateModifier', () => {
    it('returns correct modifier for all scores from 1 to 30', () => {
      const expectedModifiers: Record<number, number> = {
        1: -5, 2: -4, 3: -4, 4: -3, 5: -3, 6: -2, 7: -2, 8: -1, 9: -1, 
        10: 0, 11: 0, 12: 1, 13: 1, 14: 2, 15: 2, 16: 3, 17: 3, 18: 4, 19: 4, 
        20: 5, 21: 5, 22: 6, 23: 6, 24: 7, 25: 7, 26: 8, 27: 8, 28: 9, 29: 9, 30: 10
      };

      for (let score = 1; score <= 30; score++) {
        expect(calculateModifier(score)).toBe(expectedModifiers[score]);
      }
    });
  });

  describe('calculateProficiencyBonus', () => {
    it('returns +2 for levels 1-4', () => {
      expect(calculateProficiencyBonus(1)).toBe(2);
      expect(calculateProficiencyBonus(4)).toBe(2);
    });
    it('returns +3 for levels 5-8', () => {
      expect(calculateProficiencyBonus(5)).toBe(3);
      expect(calculateProficiencyBonus(8)).toBe(3);
    });
    it('returns +4 for levels 9-12', () => {
      expect(calculateProficiencyBonus(9)).toBe(4);
      expect(calculateProficiencyBonus(12)).toBe(4);
    });
    it('returns +5 for levels 13-16', () => {
      expect(calculateProficiencyBonus(13)).toBe(5);
      expect(calculateProficiencyBonus(16)).toBe(5);
    });
    it('returns +6 for levels 17-20+', () => {
      expect(calculateProficiencyBonus(17)).toBe(6);
      expect(calculateProficiencyBonus(20)).toBe(6);
      expect(calculateProficiencyBonus(25)).toBe(6); // Edge case handling
    });
  });

  describe('calculatePassivePerception', () => {
    it('calculates passive perception without proficiency', () => {
      expect(calculatePassivePerception(2, 3, false)).toBe(12);
      expect(calculatePassivePerception(-1, 2, false)).toBe(9);
    });
    it('calculates passive perception with proficiency', () => {
      expect(calculatePassivePerception(2, 3, true)).toBe(15);
      expect(calculatePassivePerception(5, 6, true)).toBe(21);
    });
  });

  describe('calculateInitiative', () => {
    it('calculates standard initiative', () => {
      expect(calculateInitiative(3)).toBe(3);
      expect(calculateInitiative(-1)).toBe(-1);
    });
    it('calculates initiative with misc bonus', () => {
      expect(calculateInitiative(3, 5)).toBe(8); // e.g., Alert feat
      expect(calculateInitiative(0, 2)).toBe(2); // e.g., Jack of all Trades
    });
  });

  describe('calculateAC', () => {
    it('calculates standard unarmored AC', () => {
      expect(calculateAC(10, 3)).toBe(13); // Base 10 + 3 Dex
    });
    it('calculates AC with armor that limits Dex bonus', () => {
      expect(calculateAC(14, 3, 2)).toBe(16); // Medium armor max dex 2: 14 + 2
      expect(calculateAC(18, 2, 0)).toBe(18); // Heavy armor max dex 0: 18 + 0
    });
    it('calculates AC with a shield', () => {
      expect(calculateAC(10, 2, null, 2)).toBe(14); // 10 Base + 2 Dex + 2 Shield
      expect(calculateAC(15, 3, 2, 2)).toBe(19); // 15 Base + 2 Dex (cap) + 2 Shield
    });
    it('handles negative dex correctly even if capped', () => {
      expect(calculateAC(14, -1, 2)).toBe(13); // Dexterity penalty still applies even with cap
      expect(calculateAC(18, -2, 0)).toBe(16); // Heavy armor doesn't normally take dex penalty per raw rule, but by pure math function it does.
    });
  });
});
