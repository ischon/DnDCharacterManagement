import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getEffectiveStatStore, 
  calculateEffectiveModifier, 
  calculateSkillValue, 
  calculateMaxHP 
} from '../CharacterStats';
import type { Character } from '../../types/dnd_types';

describe('CharacterStats', () => {
  let mockChar: Character;

  beforeEach(() => {
    mockChar = {
      id: 'test-123',
      ownerUid: 'uid-123',
      partyId: null,
      dmEditable: false,
      appId: 'v2',
      core: {
        name: 'Test Character',
        avatarUrl: null,
        proficiencyBonus: 2,
        currentLevel: 1,
        race: 'Human',
        class: 'Fighter',
      },
      baseStats: {
        strength: 16, // +3
        dexterity: 14, // +2
        constitution: 14, // +2
        intelligence: 10, // +0
        wisdom: 10, // +0
        charisma: 8, // -1
      },
      stats: {
        strength: { score: 16, overrideMod: null },
        charisma: { score: 8, overrideMod: null },
      },
      skills: {
        athletics: { isProficient: true, isExpertise: false, overrideValue: null },
        acrobatics: { isProficient: true, isExpertise: true, overrideValue: null },
        stealth: { isProficient: false, isExpertise: false, overrideValue: null },
        survival: { isProficient: false, isExpertise: false, overrideValue: null },
      },
      resources: {},
      levelDeltas: [
        {
          level: 1,
          hpGain: 10, // Fighter level 1 max hp
          conModifierAtLevel: 2,
        }
      ],
      freeform: { inventory: '', customFeatures: '', notes: '' },
      status: { conditions: [], isDead: false },
    };
  });

  describe('getEffectiveStatStore', () => {
    it('returns base score when no deltas apply', () => {
      expect(getEffectiveStatStore(mockChar, 'strength')).toBe(16);
    });

    it('returns 10 if base score is missing (fallback)', () => {
      // Temporarily delete score to test fallback
      delete (mockChar.baseStats as any).strength;
      expect(getEffectiveStatStore(mockChar, 'strength')).toBe(10);
    });

    it('adds ASI from level deltas up to current level', () => {
      // Add level 2 delta with no ASI
      mockChar.levelDeltas.push({ level: 2, hpGain: 6, conModifierAtLevel: 2 });
      
      // Add level 4 delta with +2 STR
      mockChar.levelDeltas.push({
        level: 3, hpGain: 6, conModifierAtLevel: 2, baseStats: {} 
      });
      mockChar.levelDeltas.push({ 
        level: 4, hpGain: 6, conModifierAtLevel: 2, baseStats: { strength: 2 } 
      });

      // Character is still level 1
      expect(getEffectiveStatStore(mockChar, 'strength')).toBe(16);

      // Level up to 4
      mockChar.core.currentLevel = 4;
      expect(getEffectiveStatStore(mockChar, 'strength')).toBe(18);
    });
  });

  describe('calculateEffectiveModifier', () => {
    it('calculates the standard modifier based on effective stat', () => {
      expect(calculateEffectiveModifier(mockChar, 'strength')).toBe(3);
      expect(calculateEffectiveModifier(mockChar, 'charisma')).toBe(-1);
    });

    it('returns override modifier if one is set', () => {
      mockChar.stats.strength.overrideMod = 10;
      expect(calculateEffectiveModifier(mockChar, 'strength')).toBe(10);
    });

    it('handles missing stats gracefully (defaults to 10/mod 0)', () => {
      expect(calculateEffectiveModifier(mockChar, 'intelligence')).toBe(0);
    });
  });

  describe('calculateSkillValue', () => {
    it('returns 0 if skill is not found', () => {
      expect(calculateSkillValue(mockChar, 'history', 'intelligence', 2)).toBe(0);
    });

    it('returns override value if set', () => {
      mockChar.skills.athletics.overrideValue = 15;
      expect(calculateSkillValue(mockChar, 'athletics', 'strength', 2)).toBe(15);
    });

    it('calculates bare value for non-proficient skill', () => {
      // stealth -> dex: 14 (+2), no prof -> +2
      expect(calculateSkillValue(mockChar, 'stealth', 'dexterity', 2)).toBe(2);
    });

    it('adds proficiency bonus for proficient skill', () => {
      // athletics -> str 16 (+3), prof (+2) -> +5
      expect(calculateSkillValue(mockChar, 'athletics', 'strength', 2)).toBe(5);
    });

    it('adds double proficiency bonus for skill with expertise', () => {
      // acrobatics -> dex 14 (+2), expertise (+4) -> +6
      expect(calculateSkillValue(mockChar, 'acrobatics', 'dexterity', 2)).toBe(6);
    });
  });

  describe('calculateMaxHP', () => {
    it('calculates level 1 max HP correctly', () => {
      // level 1, hpGain 10 + (1 * conMod 2) = 12
      expect(calculateMaxHP(mockChar)).toBe(12);
    });

    it('calculates multi-level max HP retroactively incorporating con modifiers', () => {
      // Base: Level 1 (gain 10), Level 2 (gain 6), Level 3 (gain 6)
      mockChar.levelDeltas.push({ level: 2, hpGain: 6, conModifierAtLevel: 2 });
      mockChar.levelDeltas.push({ level: 3, hpGain: 6, conModifierAtLevel: 2 });
      mockChar.core.currentLevel = 3;

      // Unchanged Con: total rolled hp (22) + (3 levels * 2 con mod) = 28
      expect(calculateMaxHP(mockChar)).toBe(28);
      
      // Update Con modifier at level 4
      mockChar.levelDeltas.push({ level: 4, hpGain: 6, conModifierAtLevel: 3, baseStats: { constitution: 2 }}); // Con goes to 16 (+3)
      mockChar.core.currentLevel = 4;

      // Max HP = Rolled (28) + (4 levels * 3 new con mod) = 28 + 12 = 40
      expect(calculateMaxHP(mockChar)).toBe(40);
    });
  });
});
