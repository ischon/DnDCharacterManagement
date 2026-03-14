import { vi } from 'vitest';

/**
 * Global Test Setup
 * 
 * We globally mock the Firebase SDK modules here. 
 * This ensures that no test can accidentally initialize a connection to the real production or development database workspaces.
 * Any service importing firebase will receive these inert mocks by default.
 * Specific tests (like AuditService) can still override these mocks locally using vi.mock() if they need to returning specific values.
 */

// Global mock for firebase/app
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

// Global mock for firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
  })),
}));

// Global mock for firebase/firestore
vi.mock('firebase/firestore', () => ({
  initializeFirestore: vi.fn(() => ({})),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

// Global mock for firebase/storage
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));
