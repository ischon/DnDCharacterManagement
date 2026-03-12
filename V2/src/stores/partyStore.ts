import { defineStore } from 'pinia';
import type { Party, Character } from '../types/dnd_types';
import { partyService } from '../services/PartyService';
import { query, where, collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const usePartyStore = defineStore('party', {
  state: () => ({
    currentParty: null as Party | null,
    members: [] as Character[],
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async createParty(dmUid: string, name: string) {
      this.isLoading = true;
      try {
        const party = await partyService.createParty(dmUid, name);
        this.currentParty = party;
        this.startPartyListener(party.id);
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    startPartyListener(partyId: string) {
      const appId = import.meta.env.VITE_FIREBASE_APP_ID;
      
      // Listen to Party Document
      onSnapshot(doc(db, `${appId}/parties/${partyId}`), (snapshot) => {
        if (snapshot.exists()) {
          this.currentParty = snapshot.data() as Party;
        }
      });

      // Listen to Characters in this party
      const charactersRef = collection(db, `${appId}/characters`);
      const q = query(charactersRef, where('partyId', '==', partyId));
      
      onSnapshot(q, (snapshot) => {
        this.members = snapshot.docs.map(doc => doc.data() as Character);
      });
    }
  }
});
