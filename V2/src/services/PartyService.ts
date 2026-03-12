import { firestoreService } from './FirestoreService';
import type { Party, NPC } from '../types/dnd_types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * PartyService
 * Manages party creation, joining, and realtime updates.
 */
export class PartyService {
  /**
   * Generates a random 8-character HEX code (e.g., A7B2-C9D4)
   */
  generatePartyCode(): string {
    const chars = '0123456789ABCDEF';
    let code = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createParty(dmUid: string, name: string): Promise<Party> {
    const partyId = this.generatePartyCode();
    const party: Party = {
      id: partyId,
      dmUid,
      name,
      createdAt: Date.now(),
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      npcs: []
    };

    await firestoreService.createDocument('parties', partyId, party);
    return party;
  }

  async joinParty(characterId: string, partyId: string) {
    await firestoreService.updateDocument('characters', characterId, {
      partyId: partyId
    });
  }

  async leaveParty(characterId: string) {
    await firestoreService.updateDocument('characters', characterId, {
      partyId: null
    });
  }

  async updateNpcs(partyId: string, npcs: NPC[]) {
    await firestoreService.updateDocument('parties', partyId, { npcs });
  }

  /**
   * Realtime Listener for a specific party
   */
  listenToParty() {
    // Placeholder
  }
}

export const partyService = new PartyService();
