import { calculateModifier } from './DndMath';
import type { Character } from '../types/dnd_types';

/**
 * CharacterStats
 * Service for calculating derived stats from base scores and level deltas.
 */

export const getEffectiveStatStore = (char: Character, statName: string): number => {
  // 1. Start with base score
  let score = char.baseStats[statName as keyof typeof char.baseStats] || 10;

  // 2. Add deltas from level up to current level
  char.levelDeltas.slice(0, char.core.currentLevel + 1).forEach(delta => {
    if (delta.baseStats && delta.baseStats[statName]) {
      score += delta.baseStats[statName]!;
    }
  });

  return score;
};

export const calculateEffectiveModifier = (char: Character, statName: string): number => {
  // Check for overrides first
  const statObj = char.stats[statName];
  if (statObj && statObj.overrideMod !== null) {
    return statObj.overrideMod;
  }

  const score = getEffectiveStatStore(char, statName);
  return calculateModifier(score);
};

export const calculateSkillValue = (
  char: Character, 
  skillName: string, 
  baseStatName: string, 
  proficiencyBonus: number
): number => {
  const skillObj = char.skills[skillName];
  if (!skillObj) return 0;

  // Check for overrides
  if (skillObj.overrideValue !== null) {
    return skillObj.overrideValue;
  }

  const mod = calculateEffectiveModifier(char, baseStatName);
  let finalValue = mod;

  if (skillObj.isProficient) {
    finalValue += proficiencyBonus;
  }
  if (skillObj.isExpertise) {
    finalValue += proficiencyBonus; // Expertise adds proficiency bonus again
  }

  return finalValue;
};

export const calculateMaxHP = (char: Character): number => {
  // 1. Sum up all hpGain from level deltas
  const totalRolledHP = char.levelDeltas.reduce((acc, delta) => acc + delta.hpGain, 0);
  
  // 2. Calculate HP from Constitution (Retroactive)
  // HP from Con = Current Level * Current Con Modifier
  const currentConMod = calculateEffectiveModifier(char, 'constitution');
  const hpFromCon = char.core.currentLevel * currentConMod;

  return totalRolledHP + hpFromCon;
};
