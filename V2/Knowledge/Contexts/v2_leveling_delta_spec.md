# V2 Leveling & Snapshot Systeem Spec (Delta Model)

## 1. Doel
Gebruikers in staat stellen om hun character progressie over 20 levels te plannen en te beheren, met een duidelijke scheiding tussen "Planning/Editing" en "Active Gameplay".

## 2. Het Delta Model
In plaats van een volledige kopie van het character per level op te slaan, gebruiken we een Delta Model:
- **Level 0 Baseline**: Bevat de absolute basis-waarden (Base Stats, Background, etc.).
- **Level Deltas (1-20)**: Elk volgend level slaat alleen de *wijzigingen* op t.o.v. het vorige level (bijv. +2 Str, een nieuwe Proficiency, of een nieuwe Spell).
- **Calculatie**: De actuele staat van een character op een specifiek level wordt berekend door de baseline te nemen en alle deltas tot en met dat level toe te passen (reducer-functie).

## 3. Level Management (LIFO/Pop)
Om de integriteit van de delta-reeks te waarborgen, gelden de volgende regels voor het toevoegen/verwijderen van levels:
- **Sequentieel**: Levels moeten in volgorde worden toegevoegd (geen gaten).
- **LIFO Verwijdering**: Alleen het hoogste level kan worden verwijderd. Je kunt level 3 niet verwijderen als level 4 en 5 nog bestaan. Dit voorkomt dat de afhankelijkheden van hogere levels gebroken worden.

## 4. Edit vs. Play Mode
- **Edit Mode (Level Editor)**: Toegankelijk via "Edit Statistics". Hier configureer je per level de "stille" data:
    - Base Stats wijzigingen.
    - Max HP winst (Fixed of Rolled).
    - Proficiencies & Features.
    - Max Spell Slots en beschikbare Spells.
- **Play Mode (Main Sheet)**: Geoptimaliseerd voor interactie tijdens sessies.
    - Stats, AC en Max HP zijn **readonly**.
    - Interactief: Huidige HP, voorbereiden van spells uit de pool, inventory beheer, en slot-tracking.

## 5. HP Scaling Logica
Bij het wisselen van het "Active Level" in Play Mode:
- **Level Up**: `Current HP += (New Max HP - Old Max HP)`.
- **Level Down**: `Current HP = min(Current HP, New Max HP)`.

## 6. Data Schema (TypeScript)
```typescript
interface Character {
  id: string;
  baseStats: { [stat: string]: number };
  levels: LevelDelta[];
  playState: {
    currentHp: number;
    activeLevel: number;
    conditions: string[];
    preparedSpells: string[];
    usedSlots: { [level: number]: number };
    inventory: string[];
  };
}

interface LevelDelta {
  level: number;
  statChanges: { [stat: string]: number };
  hpGain: { type: 'fixed' | 'rolled', value: number };
  addedProficiencies: string[];
  spellSlots: { [level: number]: number };
  addedSpells: string[];
  addedFeatures: { name: string, description: string }[];
}
```

---
*Dit document dient als bron van waarheid voor de implementatie van Issues #159, #160 en #161.*
