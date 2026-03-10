# V1 Custom Logic Reference

Dit document bevat een overzicht van de custom logica die aanwezig is in versie 1 van het project.

## 1. Core Attributen & Modifiers
- **Locatie**: `src/helpers/characterHelpers.js`
- **Logica**: `Math.floor((score - 10) / 2)`

## 2. Proficiency Bonus
- **Logica**:
  - Level 1-4: +2
  - Level 5-8: +3
  - Level 9-12: +4
  - Level 13-16: +5
  - Level 17-20: +6

## 3. Passive Perception
- **Logica**: `10 + Wisdom Modifier + (Proficiency Bonus indien getraind in Perception)`

## 4. Armor Class (AC)
- **Logica**: `Base AC + Dex Modifier (gecapped) + Shield + Misc`
- **Dex Modifier per Armor Type**:
  - **Light**: Volledige Dex modifier.
  - **Medium**: Maximaal +2.
  - **Heavy**: 0.

## 5. Spellcasting
- **Spell Save DC**: `8 + Spellcasting Ability Modifier + Proficiency Bonus`
- **Spell Attack Bonus**: `Spellcasting Ability Modifier + Proficiency Bonus`

## 6. Hit Points & Hit Dice
- **V1 Logica**: `Base HP + Constitution Modifier + Misc`
- **V2 Verbetering (Nieuw)**:
    - **Constitution Bonus**: `Level * Constitution Modifier` (zodat HP meeschaalt als de modifier later in het spel verandert).
    - **Per-Level Tracking**: HP opslaan in een **array of dictionary** per level. Zo kan bij level-ups of level-downs exact de juiste waarde worden beheerd en teruggevonden.
- **Max Hit Dice**: Gelijk aan het Character Level.

## 7. Initiative
- **Logica**: `Dexterity Modifier + Misc Initiative`

## 8. Resting (Long Rest)
- **Acties**:
  1. Reset HP naar Max HP.
  2. Herstel Hit Dice: Huidige + helft van max (naar beneden afgerond).
  3. Reset verbruikte Spell Slots.

## 9. Valuta Conversie (Coins)
- **Rates (t.o.v. Copper)**:
  - Silver: 10
  - Electrum: 50
  - Gold: 100
  - Platinum: 1000

## 10. Historische Database (V2 Nieuw)
- **Concept**: Bijhouden van alle wijzigingen aan een character over tijd.
- **Implementatie**:
    - Gebruik een subcollectie `history` onder elk character document.
    - Sla snapshots of delta's op bij belangrijke wijzigingen.
    - Maak het mogelijk om een tijdlijn te genereren voor de speler/DM.
