import { defineStore } from 'pinia';
import type { Party, Character } from '../types/dnd_types';
import { partyService } from '../services/PartyService';
import { query, where, collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from './auth'; // Assuming auth store is available for isDM getter

export const usePartyStore = defineStore('party', {
  state: () => ({
    currentParty: null as Party | null,
    players: [] as Character[], // V2: Renamed from 'members' to avoid confusion with PartyEntity[]
    loading: false,
    error: null as string | null
  }),

  getters: {
    isDM: (state) => {
      const authStore = useAuthStore();
      return state.currentParty?.dmUid === authStore.user?.uid;
    },
    // The party's NPC/Monster instances
    partyNPCs: (state) => state.currentParty?.members || []
  },

  actions: {
    async fetchParty(partyId: string) {
      this.loading = true;
      try {
        // Setup Realtime Listener for the Party Document
        const partyRef = doc(db, `${import.meta.env.VITE_FIREBASE_APP_ID}/parties/${partyId}`);
        onSnapshot(partyRef, (docSnap) => {
          if (docSnap.exists()) {
            this.currentParty = { id: docSnap.id, ...docSnap.data() } as Party;
          }
        });

        // Setup Realtime Listener for Player Characters in this party
        const charactersRef = collection(db, `${import.meta.env.VITE_FIREBASE_APP_ID}/characters`);
        const q = query(charactersRef, where('partyId', '==', partyId));
        
        onSnapshot(q, (querySnapshot) => {
          this.players = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          } as Character));
        });

      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
