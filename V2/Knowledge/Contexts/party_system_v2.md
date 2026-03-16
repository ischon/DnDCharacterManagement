# V2 Party System & Realtime Synchronization

## HEX Code Identification
Parties are identified by an 8-character HEX code (format: `XXXX-XXXX`). This code is generated client-side but enforced as unique via the `parties` collection ID.

## Data Structure
A Party document contains the DM's UID, the party name, and a `members` array of `PartyEntity` objects. Participating player characters are linked by storing the `partyId` on their individual character documents.

## Realtime Logic
The `PartyStore` initializes two high-bandwidth listeners:
1. **Party Listener**: Syncs party metadata and the active `members` array (NPC/Monster copies).
2. **Members Listener**: A collection query for all player characters where `partyId == currentPartyId`.

This allows the DM to see realtime updates via a dedicated **DM Player Card** component.

### DM Overview Fields
- **HP**: Current, Max, and **Temp HP** visible.
- **Class Breakdown**: Full list of classes with subclasses and class-specific levels (e.g. "Fighter 5 (Champion) / Wizard 2").
- **Core Stats**: Armor Class, Passive Perception (auto-computed), and Spell Save DC per casting class.
- **Death Saves**: 3 success and 3 failure indicators, editable by the DM if `dmEditable` is enabled.
- **Status Effects**: Realtime conditions list.

## NPC & Monster Management (Template & Instance Pattern)
NPCs and Monsters are managed via a robust **Template & Instance** pattern:
- **Templates**: Reside in `{appId}/templates/{templateId}`. These are the blueprints owned by the DM (`dmUid`).
- **Instances**: When a DM adds an entity to a party, a hard *copy* of the template is placed into the party's `members` array as a `PartyEntity`. Local damage/HP mutates the instance, ensuring the base template is never modified by gameplay events.

> [!IMPORTANT]
> **Data Protection**: Security rules enforce that `templates` are strictly private to the DM. `Party` members can only be modified by the DM of that party, ensuring game integrity.

## Pathing
Adheres to the V2 Global Pathing Strategy:
`{appId}/parties/{partyCode}`
