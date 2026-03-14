import { defineStore } from 'pinia';
import type { Character, LevelDelta } from '../types/dnd_types';
import { getEffectiveStatStore, calculateEffectiveModifier, calculateSkillValue } from '../services/CharacterStats';
import { calculateProficiencyBonus } from '../services/DndMath';
import { auditService } from '../services/AuditService';

export const useCharacterStore = defineStore('character', {
  state: () => ({
    currentCharacter: null as Character | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    proficiencyBonus: (state) => {
      if (!state.currentCharacter) return 2;
      return calculateProficiencyBonus(state.currentCharacter.core.currentLevel);
    },

    effectiveStats: (state) => {
      if (!state.currentCharacter) return {};
      const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
      const result: Record<string, { score: number; modifier: number }> = {};
      
      stats.forEach(s => {
        result[s] = {
          score: getEffectiveStatStore(state.currentCharacter!, s),
          modifier: calculateEffectiveModifier(state.currentCharacter!, s)
        };
      });
      return result;
    },

    skills: (state) => {
      if (!state.currentCharacter) return {};
      const char = state.currentCharacter!;
      const bonus = calculateProficiencyBonus(char.core.currentLevel);
      
      const result: Record<string, number> = {};
      // Skill to Stat mapping
      const skillMap: Record<string, string> = {
        athletics: 'strength',
        acrobatics: 'dexterity',
        sleightOfHand: 'dexterity',
        stealth: 'dexterity',
        arcana: 'intelligence',
        history: 'intelligence',
        investigation: 'intelligence',
        nature: 'intelligence',
        religion: 'intelligence',
        insight: 'wisdom',
        medicine: 'wisdom',
        perception: 'wisdom',
        survival: 'wisdom',
        deception: 'charisma',
        intimidation: 'charisma',
        performance: 'charisma',
        persuasion: 'charisma'
      };

      Object.keys(skillMap).forEach(skill => {
        result[skill] = calculateSkillValue(char, skill, skillMap[skill], bonus);
      });

      return result;
    }
  },

  actions: {
    setCharacter(char: Character) {
      this.currentCharacter = char;
    },

    addLevelDelta(delta: LevelDelta) {
      if (!this.currentCharacter) return;
      
      // Ensure sequential leveling
      const nextLevel = this.currentCharacter.levelDeltas.length;
      if (delta.level !== nextLevel) {
        throw new Error(`Invalid level. Expected level ${nextLevel}, received ${delta.level}`);
      }

      this.currentCharacter.levelDeltas.push(delta);
      this.currentCharacter.core.currentLevel = delta.level;

      auditService.log({
        entityId: this.currentCharacter.id,
        category: 'character',
        action: `Leveled up to ${delta.level}`,
        metadata: { hpGain: delta.hpGain }
      });
    },

    popLevel() {
      if (!this.currentCharacter || this.currentCharacter.levelDeltas.length <= 1) return;
      
      this.currentCharacter.levelDeltas.pop();
      this.currentCharacter.core.currentLevel = this.currentCharacter.levelDeltas.length - 1;
    },

    updateBaseStat(stat: string, value: number) {
      if (!this.currentCharacter) return;
      const oldVal = (this.currentCharacter.baseStats as any)[stat];
      (this.currentCharacter.baseStats as any)[stat] = value;

      auditService.log({
        entityId: this.currentCharacter.id,
        category: 'character',
        action: `Updated base ${stat}`,
        changes: { [stat]: { old: oldVal, new: value } }
      });
    }
  }
});
