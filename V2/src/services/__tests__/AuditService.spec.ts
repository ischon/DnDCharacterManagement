import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuditService } from '../AuditService';
import { firestoreService } from '../FirestoreService';

// Mock dependencies
vi.mock('../FirestoreService', () => ({
  firestoreService: {
    createDocument: vi.fn(),
  },
}));

// Use vi.hoisted to allow usage inside vi.mock
const { mockAuth } = vi.hoisted(() => ({
  mockAuth: {
    currentUser: null as any
  }
}));

vi.mock('../firebase', () => ({
  auth: mockAuth
}));

describe('AuditService', () => {
  let auditService: AuditService;

  beforeEach(() => {
    auditService = new AuditService();
    vi.clearAllMocks();
  });

  it('does not log if no user is authenticated', async () => {
    mockAuth.currentUser = null;
    
    await auditService.log({
      entityId: 'test-entity',
      category: 'system',
      action: 'test-action',
    });

    expect(firestoreService.createDocument).not.toHaveBeenCalled();
  });

  it('logs audit entry successfully if user is authenticated', async () => {
    // Mock user
    const mockUid = 'user-123';
    mockAuth.currentUser = { uid: mockUid } as any;

    const entry = {
      entityId: 'char-123',
      category: 'character' as const,
      action: 'level_up',
      changes: { level: { old: 1, new: 2 } },
    };

    // Mock Date.now() for predictable timestamp
    const mockTimestamp = 1680000000000;
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

    await auditService.log(entry);

    expect(firestoreService.createDocument).toHaveBeenCalledTimes(1);
    expect(firestoreService.createDocument).toHaveBeenCalledWith(
      'audit_logs',
      `char-123_${mockTimestamp}`,
      {
        ...entry,
        timestamp: mockTimestamp,
        userId: mockUid,
      }
    );

    dateSpy.mockRestore();
  });
});
