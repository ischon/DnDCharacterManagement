Act as an Expert Full-Stack Developer specializing in Vue 3 (Composition API), TypeScript, Pinia, and Firebase (Cloud Firestore & Auth). 

I am providing you with a complete, highly detailed Project Specification for "D&D Flex Char-Manager V1". Your task is to build this application based on the provided spec.

CRITICAL INSTRUCTIONS BEFORE YOU CODE:
1. Read the entire specification carefully. Do NOT make assumptions about D&D rules; the core principle of this app is flexibility and override-ability (homebrew friendly). Do not hardcode fixed classes or races unless specified.
2. Follow the exact Folder Structure and Tech Stack outlined in the spec.
3. Implement the Cloud Firestore and Cloud Storage Security Rules exactly as provided before writing frontend queries.

EXECUTION PLAN:
Do not write the entire application at once. We will build this iteratively to ensure high quality. 

Start with PHASE 1:
- Initialize the Vue 3 + TS + Pinia project structure.
- Set up the specific Folder Structure from the spec.
- Create the TypeScript interfaces/types (`src/types/`) based on the Firestore Document Data Model provided.
- Initialize Firebase (`src/services/firebase.ts`) and prepare the basic Auth Service.

Once you have completed Phase 1, stop and ask me for permission to proceed to Phase 2 (State Management & Core Components).

Here is the Project Specification:
# **📄 Project Spec: D\&D Flex Char-Manager V1**

## **1\. Project Titel & Doel**

* **Titel:** D\&D Flex Char-Manager V1  
* **Doel:** Een webapplicatie bouwen voor D\&D character management en DM party-overzicht. Het systeem onderscheidt zich door een sterke balans tussen automatisering (berekenen van modifiers/skills) en absolute vrijheid voor de speler (custom classes, overschrijfbare waarden, homebrew support).

## **2\. User Persona's**

* **De Speler:** Beheert één of meerdere characters. Heeft volledige autonomie over de data. Wil niet vastzitten aan rigide rulesets, maar stelt automatische berekeningen van basis-stats wel op prijs.  
* **De Dungeon Master (DM):** Behoefte aan overzicht. Wil realtime de actuele status (HP, Spell Slots) van de party zien. Wil tijdelijke NPC's kunnen toevoegen aan de actieve party view.

## **3\. Tech Stack & Architectuur**

* **Frontend Framework:** Vue 3 (Composition API) \+ TypeScript.  
* **State Management:** Pinia.  
* **UI/Styling:** \[TBD door designers\] \- Gebruik voorlopig standaard CSS of een basic reset. Focus op logica, component-structuur en data-binding.  
* **Backend & Database:** Firebase Auth, **Cloud Firestore** (Database), Firebase Cloud Storage (voor character avatars).  
* **Hosting:** Cloudflare Pages (Frontend deploy).  
* **Externe API:** https://www.dnd5eapi.co/ (Alleen voor SRD autocomplete suggesties, altijd overschrijfbaar door de user).

## **4\. Functional Requirements (User Stories)**

### **4.1. Authenticatie & Core**

1. **Gebruiker Login/Registratie:** Simpele email/password en Google Auth via Firebase.  
2. **Offline Support:** Maak gebruik van Firestore's ingebouwde offline persistentie (enableIndexedDbPersistence). Toon een non-intrusive UI-warning bovenaan het scherm als de browser offline gaat (window.addEventListener('offline')).

### **4.2. Speler & Character Management**

1. **Flexibele Karaktercreatie:** Karakter entiteit aanmaken met basisvelden (Naam, Level(s), Base Stats).  
2. **Stat & Skill Calculatie:**  
   * Systeem berekent automatisch de base stat modifier: Math.floor((stat \- 10\) / 2).  
   * UI bevat toggles voor 'Proficiency' en 'Expertise' per skill.  
   * Systeem berekent de uiteindelijke skill-waarde (Stat Mod \+ Proficiency Bonus). *Let op: de berekende waarde moet altijd handmatig overschreven kunnen worden via een 'override' veld.*  
3. **Spell & Resource Management:**  
   * Vrije tekstvelden voor spells en items, met de D\&D 5e API als *optionele* autocomplete.  
   * Spell slots en class resources (zoals Ki points of Action Surge) hebben een 'Max' en 'Current' waarde.  
   * Een 'Use' knop verlaagt de 'Current' waarde met 1\.  
4. **Party Join & Permissies:** Speler kan een 8-karakter hexadecimale code invullen om aan een party te koppelen. De speler heeft een toggle: DM Editable \[Aan/Uit\] (standaard Uit/Read-only).

### **4.3. Dungeon Master (DM) View**

1. **Party Creatie:** DM kan een "Party" entiteit aanmaken. Systeem genereert een unieke 8-karakter hexadecimale partyId.  
2. **Realtime Overzicht:** Dashboard toont alle characters gekoppeld aan deze partyId. Wijzigingen door spelers updaten direct in de DM view via Firestore onSnapshot listeners.  
3. **DM Editing:** Als de speler dmEditable heeft geactiveerd, kan de DM waarden (zoals HP of status effects) aanpassen.  
4. **Tijdelijke NPC's:** DM kan simpele NPC-cards aanmaken met basis stats (Naam, HP, AC, Notes) die lokaal in een subcollectie van de party worden opgeslagen.

## **5\. Datamodel (Cloud Firestore Document/Collection Structuur)**

De agent moet deze NoSQL structuur hanteren:

* **Collection users**  
  * document {uid}: { email: string, displayName: string }  
* **Collection parties**  
  * document {partyId}: { dmUid: string, name: string, createdAt: timestamp }  
  * *Subcollection npcs* \-\> document {npcId}: { name: string, hp: number, ac: number, notes: string }  
* **Collection characters**  
  * document {charId}:  
    ```JSON  
    {  
      "ownerUid": "uid\_123",  
      "partyId": "1A2B3C4D",  
      "dmEditable": false,  
      "core": {  
        "name": "Thorin",  
        "avatarUrl": "firebase\_storage\_url",  
        "proficiencyBonus": 3  
      },  
      "stats": {  
        "strength": { "score": 16, "overrideMod": null },  
        "dexterity": { "score": 10, "overrideMod": null }  
      },  
      "skills": {  
        "athletics": { "isProficient": true, "isExpertise": false, "overrideValue": null }  
      },  
      "resources": {  
        "spellSlots\_level\_1": { "max": 4, "current": 3 }  
      },  
      "freeform": {  
        "inventory": "...",  
        "customFeatures": "..."  
      }  
    }
    ```

## **6\. Firebase Security Rules**

Implementeer de volgende regels om data-integriteit te waarborgen:

### **Firestore Rules**

```Plaintext

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
      
    // User profielen  
    match /users/{userId} {  
      allow read, write: if request.auth \!= null && request.auth.uid \== userId;  
    }  
      
    // Parties & NPC subcollectie  
    match /parties/{partyId} {  
      allow read: if request.auth \!= null;   
      allow create: if request.auth \!= null && request.resource.data.dmUid \== request.auth.uid;  
      allow update, delete: if request.auth \!= null && resource.data.dmUid \== request.auth.uid;  
        
      match /npcs/{npcId} {  
        allow read: if request.auth \!= null;  
        allow write: if request.auth \!= null && get(/databases/$(database)/documents/parties/$(partyId)).data.dmUid \== request.auth.uid;  
      }  
    }  
      
    // Characters  
    match /characters/{charId} {  
      // READ: Eigenaar of de DM van de party  
      allow read: if request.auth \!= null && (  
        resource.data.ownerUid \== request.auth.uid ||   
        (resource.data.partyId \!= null && get(/databases/$(database)/documents/parties/$(resource.data.partyId)).data.dmUid \== request.auth.uid)  
      );  
        
      // CREATE: Alleen door eigenaar  
      allow create: if request.auth \!= null && request.resource.data.ownerUid \== request.auth.uid;  
        
      // UPDATE: Eigenaar altijd. DM mag updaten als dmEditable true is.  
      allow update: if request.auth \!= null && (  
        resource.data.ownerUid \== request.auth.uid ||  
        (  
          resource.data.dmEditable \== true &&   
          resource.data.partyId \!= null &&   
          get(/databases/$(database)/documents/parties/$(resource.data.partyId)).data.dmUid \== request.auth.uid  
        )  
      );  
        
      allow delete: if request.auth \!= null && resource.data.ownerUid \== request.auth.uid;  
    }  
  }  
}
```

### **Cloud Storage Rules (Avatars)**

```Plaintext

rules\_version \= '2';  
service firebase.storage {  
  match /b/{bucket}/o {  
    match /avatars/{userId}/{fileName} {  
      allow read: if request.auth \!= null;  
      allow write: if request.auth \!= null   
                   && request.auth.uid \== userId  
                   && request.resource.contentType.matches('image/.\*')  
                   && request.resource.size \< 5 \* 1024 \* 1024; // Max 5MB  
    }  
  }  
}
```

## **7\. Definition of Done (DoD) voor de AI-Agent**

* De codebase is geschreven in Vue 3 (Composition API) \+ TypeScript.  
* Firebase authenticatie en Firestore services zijn gemodulariseerd (bijv. in een src/services/ map) voor testbaarheid.  
* Pinia stores bevatten de business logica voor de stat/skill berekeningen, losgekoppeld van de UI-componenten.  
* Firestore's offline persistentie (enableIndexedDbPersistence) is geactiveerd in de database initialisatie.  
* De code forceert nergens hardcoded D\&D classes/races enforcen; het state-model blijft flexibel voor overschrijvingen.

## **8\. Folder Structure**

```Plaintext

src/  
├── assets/  
├── components/  
│   ├── common/ (buttons, inputs)  
│   ├── character/ (stat blocks, resource trackers)  
│   └── dm/ (party list, npc cards)  
├── composables/ (Vue composables e.g., useDndApi)  
├── router/  
├── services/ (firebase.ts, firestore.ts)  
├── stores/ (pinia: characterStore, partyStore, authStore)  
├── types/ (TypeScript interfaces e.g., Character.ts)  
├── views/  
│   ├── Auth.vue  
│   ├── CharacterEdit.vue  
│   ├── PlayerDashboard.vue  
│   └── DmDashboard.vue  
└── App.vue  
```