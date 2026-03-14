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
  members: PartyEntity[];
}

// ==========================================
// TEMPLATE & INSTANCE SYSTEM (DM Level -> Party Level)
// ==========================================

export interface EntityTemplate {
  id: string;
  dmUid: string;
  type: 'monster' | 'npc';
  name: string;
  maxHp: number;
  ac: number;
  notes: string;
}

export interface PartyEntity {
  id: string;
  templateOriginId: string | null;
  type: 'monster' | 'npc';
  name: string;
  hp: Resource;
  ac: number;
  notes: string;
}

// ==========================================
// INITIATIVE TRACKER TYPES
// ==========================================

export type InitiativeEntityType = 'player' | 'monster' | 'npc';

export interface InitiativeEntity {
  id: string; // Unique identifier in the tracker
  sourceId?: string | null; // ID to a Party member or Monster Repo entity (nullable for quick-adds)
  type: InitiativeEntityType;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  conditions: string[]; // e.g., ["poisoned", "prone"]
  isSurprised?: boolean;
}

export interface InitiativeState {
  entities: InitiativeEntity[];
  activeTurnIndex: number;
  round: number;
}
