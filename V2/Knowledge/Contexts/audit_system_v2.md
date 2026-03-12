# V2 Audit & History System

## Overview
The V2 Audit system ensures that every significant change to a character or party is tracked for historical purposes. This complements the **Delta Model** by providing a human-readable log of actions.

## Implementation Details
The `AuditService` captures:
- **Timestamp**: Exact moment of change.
- **User ID**: Account that performed the action.
- **Entity ID**: The character or party affected.
- **Category**: `character`, `party`, or `system`.
- **Action**: Description (e.g., "Leveled up to 5").
- **Changes**: A diff of modified fields (Old vs New).

## Data Storage
Logs are stored in a dedicated `audit_logs` collection:
`{appId}/audit_logs/{entityId}_{timestamp}`

This structure allows for fast querying of all logs for a specific character or party.

## Triggers
Logging is integrated directly into the Pinia stores (`characterStore.ts`, `partyStore.ts`) to ensure that every state change that persists to Firestore also generates an audit entry.
