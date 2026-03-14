# V2 Architecture Overview

## Technical Stack
- **Framework**: Vue 3 (Composition API) + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Security**: Firebase App Check (Planned)

## Directory Structure (Atomic Design Foundations)
The project follows an Atomic Design approach for UI components to ensure scalability and reusability.

- `src/components/common`: Atoms and basic building blocks (buttons, inputs).
- `src/components/character`: Character-specific molecules and organisms (stat blocks, resource trackers).
- `src/components/dm`: DM-specific components (party list, npc cards).
- `src/services`: Modularized external services (Firebase, logic engines).
- `src/stores`: Pinia stores for global state (Auth, Character, Party).
- `src/router`: Application routing and security guards with async auth initialization.
- `src/types`: Centralized TypeScript interfaces for data consistency.

## Implementation Principles
1. **Separation of Concerns**: Logic is decoupled from the UI, residing primarily in Pinia stores and services.
2. **Flexible Data Model**: System supports manual overrides for all calculated values.
3. **Offline First**: Firestore offline persistence is enabled by default.
4. **Environment Isolation**: Global `{appId}` root collection used for data isolation.
