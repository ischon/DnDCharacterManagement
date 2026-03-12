export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Stat {
  score: number;
  overrideMod: number | null;
}

export interface Skill {
  isProficient: boolean;
  isExpertise: boolean;
  overrideValue: number | null;
}

export interface Resource {
  max: number;
  current: number;
}

export interface LevelDelta {
  level: number;
  hpGain: number; // Rolled/fixed value at this level
  conModifierAtLevel: number; // Con mod active when this level was taken
  baseStats?: Partial<Record<string, number>>; // Optional if stats changed at this level (e.g., ASI)
  featuresGained?: string[];
  spellsLearned?: string[];
  maxSlotsGained?: Record<string, number>;
}

export interface Character {
  id: string;
  ownerUid: string;
  partyId: string | null;
  dmEditable: boolean;
  appId: string; // V2 Pathing Strategy requirement
  core: {
    name: string;
    avatarUrl: string | null;
    proficiencyBonus: number;
    currentLevel: number;
    race: string;
    class: string;
  };
  baseStats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  stats: Record<string, Stat>; // Calculated/Override stats
  skills: Record<string, Skill>;
  resources: Record<string, Resource>;
  levelDeltas: LevelDelta[]; // V2 Delta Model
  freeform: {
    inventory: string;
    customFeatures: string;
    notes: string;
  };
  status: {
    conditions: string[];
    isDead: boolean;
  };
}

export interface Party {
  id: string; // 8-char HEX code
  dmUid: string;
  name: string;
  createdAt: number;
  appId: string;
  npcs: NPC[];
}

export interface NPC {
  id: string;
  name: string;
  hp: Resource;
  ac: number;
  notes: string;
}
