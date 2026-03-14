import { firestoreService } from './FirestoreService';
import { auth } from './firebase';

export interface AuditEntry {
  id?: string;
  timestamp: number;
  userId: string;
  entityId: string;
  category: 'character' | 'party' | 'system';
  action: string;
  changes?: Record<string, { old: any; new: any }>;
  metadata?: Record<string, any>;
}

export class AuditService {
  async log(entry: Omit<AuditEntry, 'timestamp' | 'userId'>) {
    const user = auth.currentUser;
    if (!user) return;

    const fullEntry: AuditEntry = {
      ...entry,
      timestamp: Date.now(),
      userId: user.uid
    };

    // Logging to a sub-collection or sibling collection
    // Pattern: {appId}/audit_logs/{logId}
    await firestoreService.createDocument('audit_logs', `${fullEntry.entityId}_${fullEntry.timestamp}`, fullEntry);
  }
}

export const auditService = new AuditService();
