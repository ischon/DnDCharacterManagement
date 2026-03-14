import { defineStore } from 'pinia';
import { auth } from '../services/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true
  }),
  actions: {
    initialize() {
      return new Promise<void>((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          this.loading = false;
          resolve();
        });
      });
    }
  }
});
