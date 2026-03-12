# V2 Leveling & Delta Model Specification

## The "Delta" Concept
Unlike V1, which likely stored only the final state, V2 stores the **changes** (deltas) at each level. This provides:
1. **Auditability**: Track exactly when a stat changed or a feature was gained.
2. **Reversibility**: Safe de-leveling by popping the last delta.
3. **Consistency**: Derived values are always calculated from the sum of deltas.

## Data Structure
Each level-up creates a `LevelDelta` object:
```typescript
{
  level: number;
  hpGain: number; // The amount of HP added at this specific level
  conModifierAtLevel: number; // Captured Con mod (important for retroactive HP logic)
  baseStats?: Partial<Record<string, number>>; // Any ASI or feats affecting base scores
  featuresGained?: string[];
}
```

## The Reducer Pattern
The `characterStore.ts` acts as a reducer that iterates over the `levelDeltas` array to compute the current "Effective State".

### 1. Stats Calculation
`Effective Score = Base Score + Sum(delta.baseStats)`

### 2. HP Logic (Issue #161 Preview)
`Max HP = Sum(delta.hpGain) + (CurrentLevel * CurrentConModifier)`
Note: As per D&D rules, Constitution modifier changes are retroactive. By capturing the con modifier at the time of leveling but using the *current* modifier for the total, we maintain full transparency.

## Sequential Integrity
The store enforces that deltas are added in sequential order (`delta.level === currentDeltas.length`). This prevents "Level Gaps" in the database.
