/**
 * DndMath
 * Pure functional mathematical engine for D&D 5e mechanics.
 */

export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const calculateProficiencyBonus = (level: number): number => {
  if (level < 5) return 2;
  if (level < 9) return 3;
  if (level < 13) return 4;
  if (level < 17) return 5;
  return 6;
};

export const calculatePassivePerception = (
  wisdomModifier: number,
  proficiencyBonus: number,
  isProficient: boolean
): number => {
  return 10 + wisdomModifier + (isProficient ? proficiencyBonus : 0);
};

export const calculateInitiative = (dexModifier: number, miscBonus: number = 0): number => {
  return dexModifier + miscBonus;
};

export const calculateAC = (
  baseArmor: number,
  dexModifier: number,
  maxDexBonus: number | null = null,
  shieldBonus: number = 0
): number => {
  const effectiveDex = maxDexBonus !== null ? Math.min(dexModifier, maxDexBonus) : dexModifier;
  return baseArmor + effectiveDex + shieldBonus;
};
