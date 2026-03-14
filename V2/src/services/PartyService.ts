import { firestoreService } from './FirestoreService';
import type { Party, PartyEntity, EntityTemplate } from '../types/dnd_types';
import { v4 as uuidv4 } from 'uuid';

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
      members: [] // V2: Uses unified members array for NPCs/Monsters
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

  /**
   * Adds a new instance (snapshot) of a template to the party
   */
  async addMemberInstance(partyId: string, template: EntityTemplate): Promise<PartyEntity> {
    const party = await firestoreService.getDocument<Party>('parties', partyId);
    if (!party) throw new Error('Party not found');

    const newInstance: PartyEntity = {
      id: uuidv4(),
      templateOriginId: template.id,
      type: template.type,
      name: template.name,
      hp: { current: template.maxHp, max: template.maxHp },
      ac: template.ac,
      notes: template.notes
    };

    const updatedMembers = [...(party.members || []), newInstance];
    await firestoreService.updateDocument('parties', partyId, { members: updatedMembers });
    
    return newInstance;
  }

  /**
   * Removes a member instance from the party
   */
  async removeMemberInstance(partyId: string, entityId: string): Promise<void> {
    const party = await firestoreService.getDocument<Party>('parties', partyId);
    if (!party) throw new Error('Party not found');

    const updatedMembers = (party.members || []).filter(m => m.id !== entityId);
    await firestoreService.updateDocument('parties', partyId, { members: updatedMembers });
  }

  /**
   * Updates a specific member instance within the party members array
   */
  async updateMemberInstance(partyId: string, entityId: string, updates: Partial<PartyEntity>): Promise<void> {
    const party = await firestoreService.getDocument<Party>('parties', partyId);
    if (!party) throw new Error('Party not found');

    const updatedMembers = (party.members || []).map(m => 
      m.id === entityId ? { ...m, ...updates } : m
    );

    await firestoreService.updateDocument('parties', partyId, { members: updatedMembers });
  }

  /**
   * Realtime Listener for a specific party
   */
  listenToParty() {
    // Handled by partyStore
  }
}

export const partyService = new PartyService();
