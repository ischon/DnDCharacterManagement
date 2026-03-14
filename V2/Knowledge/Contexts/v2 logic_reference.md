# Project Spec: V2 Character Dashboard & Leveling System

## 1. Doel & Persona's
Gebruikers (spelers) in staat stellen om hun character progressie over 20 levels te plannen en te beheren, met een duidelijke scheiding tussen "Planning/Editing" en "Active Gameplay".

## 2. Functional Requirements

### 2.1 Character Dashboard (V2 Home)
- **Overzicht**: Lijst van characters met V2 branding en Atomic Design componenten.
- **Creatie**: Nieuwe characters initialiseren op Level 0 (Base Stats setup).

### 2.2 Leveling & Snapshot Systeem (Delta Model)
- **Level 0 Baseline**: Opslag van de absolute basis-waarden van het character.
- **Level Deltas**: Voor level 1-20 worden alleen de *veranderingen* t.o.v. het vorige level opgeslagen (bijv. +2 Str, +1 Proficiency in Skill X).
- **Level Management**: Gebruikers kunnen levels toevoegen (append) of de hoogste levels verwijderen (**pop**). Lagere levels kunnen niet onafhankelijk verwijderd worden omdat de Delta-reeks daarvan afhankelijk is. Geen "gaten" toegestaan.
- **Active Level Selection**: In de play-interface kan de gebruiker het "huidige level" selecteren, waarna de UI de berekende stats van dat level toont.

### 2.3 Edit vs. Play Mode
- **Play Mode (Main Sheet)**: Geoptimaliseerd voor interactie tijdens een sessie. Velden zoals Base Stats, AC en Max HP zijn *readonly*. Hier vindt ook de selectie van "Voorbereide Spells" plaats en het beheer van **Inventory/Equipment**, aangezien items hoofdzakelijk tijdens gameplay worden verkregen.
- **Edit Mode (Dedicated Screen)**: Toegankelijk via een "Edit Statistics" knop. Hier kan de gebruiker per level de stats configureren, inclusief Spell Slots, beschikbare spells, en **Features & Traits** die op dit specifieke level worden verdiend.

### 2.4 HP Management & History
- **HP Build-up**: Opslag van HP winst per level (Base + Die Roll of Fixed value + berekende Con mod).
- **History Popup**: In de Play Mode HP-sectie toont een info-icon een popup met de volledige opbouw: `Level 1: 10 + 2 (Con) = 12 | Level 2: 6 + 2 (Con) = 8 | Totaal: 20`.
- **Dynamic HP Scaling**: 
    - Bij Level Up: `Current HP += (New Max HP - Old Max HP)`.
    - Bij Level Down: `Current HP = min(Current HP, New Max HP)`.

## 3. Technical Constraints & Stack
- **Framework**: React/Next.js (op basis van V2 Vibe).
- **State Management**: Zustand of React Context voor berekende stats (reductie van Delta's).
- **Database**: Firestore (Document per character met een `levels` array of sub-collectie).

## 4. Data Model
### [Character](file:///p:/DnDCharacterManagement/V1/src/models/Character.js#21-956) Document
- [id](file:///p:/DnDCharacterManagement/V1/src/models/Character.js#43-46): string
- `baseStats`: { str: number, ... }
- `levels`: array of `LevelDelta`
    - `level`: number
    - `statChanges`: { str: number, ... }
    - `hpGain`: { type: 'fixed' | 'rolled', value: number }
    - `addedProficiencies`: string[]
    - `spellSlots`: {[level: number]: number}
    - `addedSpells`: string[]
    - `addedFeatures`: { name: string, description: string }[]
- `playState`: { currentHp: number, activeLevel: number, conditions: string[], preparedSpells: string[], usedSlots: {[level: number]: number}, inventory: string[] }

## 5. Definition of Done
- [ ] Gebruiker kan een character aanmaken en levels configureren in de Editor.
- [ ] Wisselen van 'Active Level' update direct alle berekende waarden (Strength, HP, Modifiers).
- [ ] HP History popup toont correcte data per level.
- [ ] Play Mode voorkomt onbedoelde wijzigingen aan base stats.

*Deze spec is geoptimaliseerd voor AI-agents. Je kunt dit direct kopiëren naar Claude of Copilot.*
