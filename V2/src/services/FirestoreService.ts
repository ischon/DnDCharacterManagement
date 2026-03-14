import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';

/**
 * FirestoreService
 * Implements the V2 Global Database Pathing Strategy: {appId}/{collection}/{document}
 */
export class FirestoreService {
  private appId: string;

  constructor() {
    // Determine appId from environment
    this.appId = import.meta.env.VITE_FIREBASE_APP_ID;
    if (!this.appId) {
      throw new Error('VITE_FIREBASE_APP_ID is not defined in environment variables.');
    }
  }

  /**
   * Helper to get the full path including appId root
   */
  private getPath(collectionName: string, documentId?: string): string {
    return documentId ? `${this.appId}/${collectionName}/${documentId}` : `${this.appId}/${collectionName}`;
  }

  async getDocument<T = DocumentData>(collectionName: string, documentId: string): Promise<T | null> {
    const docRef = doc(db, this.getPath(collectionName, documentId));
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }

  async getCollection<T = DocumentData>(collectionName: string, ...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const colRef = collection(db, this.getPath(collectionName));
    const q = query(colRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as T));
  }

  async createDocument(collectionName: string, documentId: string, data: DocumentData) {
    const docRef = doc(db, this.getPath(collectionName, documentId));
    await setDoc(docRef, data);
  }

  async updateDocument(collectionName: string, documentId: string, data: Partial<DocumentData>) {
    const docRef = doc(db, this.getPath(collectionName, documentId));
    await updateDoc(docRef, data);
  }

  async deleteDocument(collectionName: string, documentId: string) {
    const docRef = doc(db, this.getPath(collectionName, documentId));
    await deleteDoc(docRef);
  }
}

export const firestoreService = new FirestoreService();
