# 📄 Project Context & Master Specification: D&D Flex Char-Manager V1

## 1. Project Visie & Kernfilosofie
**Titel:** D&D Flex Char-Manager V1
**Doel:** Een webapplicatie voor D&D character management (spelers) en party-overzicht (Dungeon Masters).
**De Kernfilosofie (Cruciaal voor AI-Agents):** Balans tussen automatisering en absolute vrijheid. Het systeem berekent basiswaarden (zoals modifiers op basis van stats), maar **elke berekende waarde moet door de gebruiker overschreven kunnen worden**. We enforcen géén rigide D&D rulesets of hardcoded classes/races. Homebrew moet out-of-the-box mogelijk zijn via vrije tekstvelden.

## 2. Tech Stack & Architectuur
* **Frontend:** Vue 3 (Composition API) + TypeScript.
* **State Management:** Pinia (gescheiden van UI-componenten).
* **Backend/Database:** Firebase Auth, Cloud Firestore (Database), Firebase Cloud Storage (voor Avatars).
* **Hosting:** Cloudflare Pages.
* **Offline Support:** Firestore ingebouwde offline persistentie (`enableIndexedDbPersistence`).
* **Externe API (Optioneel):** `https://www.dnd5eapi.co/` (alleen voor autocomplete suggesties, altijd overschrijfbaar).

## 3. User Persona's & Features

### De Speler
* Heeft volledige autonomie over eigen characters.
* **Karaktercreatie:** Vrij invulbare velden voor Naam, Level, Base Stats.
* **Calculatie & Overrides:** Systeem berekent stat modifiers (`Math.floor((stat - 10) / 2)`) en skill waarden (Stat Mod + Proficiency). UI bevat een expliciete 'override' mogelijkheid.
* **Resources:** Spell slots en class abilities hebben Max/Current tellers met snelle 'Use' knoppen.
* **Party:** Kan een party joinen via een 8-karakter hexadecimale `partyId`. Bepaalt zelf of de DM edit-rechten krijgt via een `dmEditable` toggle.

### De Dungeon Master (DM)
* **Party Dashboard:** Realtime overzicht van alle characters in de party via Firestore `onSnapshot` listeners.
* **Interactie:** Read-only by default. Als speler `dmEditable` op `true` zet, kan de DM waarden (zoals HP) live aanpassen.
* **NPC's:** Kan tijdelijke NPC-kaarten (Naam, HP, AC, Notes) toevoegen aan het lokale party-overzicht.

## 4. Datamodel (Cloud Firestore)

*   **Root Structure:** `{appId}/...` (where `appId` acts as the environment/instance identifier, e.g., `1:12345:web:abcde/...`)
*   **Collection `users`** -> `doc {uid}`: `{ email, displayName }`
*   **Collection `parties`** -> `doc {partyId}`: `{ dmUid, name, createdAt }`
    * **Subcollection `npcs`** -> `doc {npcId}`: `{ name, hp, ac, notes }`
* **Collection `characters`** -> `doc {charId}`:
    ```json
    {
      "ownerUid": "string",
      "partyId": "string (optioneel)",
      "dmEditable": false,
      "core": { "name": "string", "avatarUrl": "string", "proficiencyBonus": 3 },
      "stats": {
        "strength": { "score": 16, "overrideMod": null }
      },
      "skills": {
        "athletics": { "isProficient": true, "isExpertise": false, "overrideValue": null }
      },
      "resources": {
        "spellSlots_level_1": { "max": 4, "current": 3 }
      },
      "freeform": { "inventory": "string", "customFeatures": "string" }
    }
    ```

## 5. Security Rules (Firestore & Storage)
*Geïmplementeerd in Firebase console om datalekken te voorkomen.*

**Firestore:**
* Spelers kunnen alleen eigen characters aanmaken/verwijderen.
* DM's kunnen karakters in hun party inzien.
* DM's kunnen karakters in hun party updaten MITS `dmEditable == true`.
* DM's hebben volledige controle over hun `parties` document en de `npcs` subcollectie.

**Storage (Avatars):**
* Alleen ingelogde gebruikers. Max 5MB per upload. Alleen `image/.*` content types. Pad: `avatars/{userId}/{fileName}`.

## 6. UI/UX & Componenten Hiërarchie (Vue 3)
Het frontend design volgt een Atomic Design structuur in de `src/components/` map:

* **Atoms:** `BaseButton`, `IconButton`, `BaseInput`, `OverrideInput` (visueel onderscheid tussen berekende vs. handmatige waarden), `ProficiencyToggle`, `Avatar`.
* **Molecules:** `StatBlock` (Label + Calc Mod + OverrideInput), `SkillRow`, `ResourceCounter` (Current/Max + Use btn), `HealthBar` (grote +/- knoppen voor snelle combat edits).
* **Organisms:** `CharacterHeader`, `StatGrid`, `SkillList`, `DmPlayerCard` (compacte weergave voor DM), `NpcCard`.
* **Views:** `PlayerDashboard`, `DmDashboard`, `GlobalLayout` (inclusief offline warning indicator).

## 7. AI-Agent Executie Instructies
**Aan de AI Code Agent die dit bestand leest:**
1. **Iteratief bouwen:** Bouw niet alles in één keer. Vraag goedkeuring na het opzetten van de basisstructuur en types (Fase 1), voordat je overgaat op state management en UI.
2. **Geen aannames:** Hardcode geen D&D rulesets (zoals vaste spell lists of class features) tenzij expliciet gevraagd. Focus op de datastructuur en override-mogelijkheden.
3. **Types:** Baseer je TypeScript interfaces strikt op het in sectie 4 gedefinieerde Firestore datamodel.
4. **Modulariteit:** Plaats alle Firebase logica in `src/services/` en state in `src/stores/`. De componenten mogen alleen Pinia stores aanroepen, geen directe Firebase queries.
