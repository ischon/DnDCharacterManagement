# V2 Core Logic Engine

## Philosophy
The core logic is decoupled from the UI and resides in pure functional services and Pinia stores. It adheres to the **"Override-First"** principle, meaning any calculated value can be manually overridden by the user.

## Core Math (DndMath.ts)
Provides atomic calculations for modifiers, proficiency, AC, and passive stats.

- **Modifier**: `(Score - 10) / 2` (rounded down).
- **Proficiency**: Scales with level (2 to 6).
- **AC**: Flexible calculation supporting light, medium, and heavy armor rules.

## Derived Stats (CharacterStats.ts)
Handles the reduction of the **Delta Model** into effective scores.

1. **Effective Score**: Base Stat + Sum of Deltas (up to current level).
2. **Effective Modifier**: Calculated from Effective Score **UNLESS** an `overrideMod` exists in the character state.
3. **Skill Value**: Effective Modifier + Proficiency/Expertise bonus **UNLESS** an `overrideValue` exists.

## Future Extensions
- Automated save calculations.
- Spell DC and Attack bonus integration.
- Encumbrance triggers.
