# V2 Party System & Realtime Synchronization

## HEX Code Identification
Parties are identified by an 8-character HEX code (format: `XXXX-XXXX`). This code is generated client-side but enforced as unique via the `parties` collection ID.

## Data Structure
A Party document contains the DM's UID, the party name, and an array of embedded NPCs. Participating characters are linked by storing the `partyId` on the individual character documents.

## Realtime Logic
The `PartyStore` initializes two high-bandwidth listeners:
1. **Party Listener**: Syncs party metadata and NPC states.
2. **Members Listener**: A collection query for all characters where `partyId == currentPartyId`.

This allows the DM to see realtime updates to player HP, status effects, and active resources.

## NPC Management
NPCs are stored directly within the Party document. This is optimized for fast access during combat without needing to fetch dozens of individual small documents.

## Pathing
Adheres to the V2 Global Pathing Strategy:
`{appId}/parties/{partyCode}`
