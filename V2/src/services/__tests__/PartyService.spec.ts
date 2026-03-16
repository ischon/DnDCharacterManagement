import { describe, it, expect, vi, beforeEach } from 'vitest';
import { partyService } from '../PartyService';
import { firestoreService } from '../FirestoreService';
import type { EntityTemplate, PartyEntity } from '../../types/dnd_types';

vi.mock('../FirestoreService', () => ({
  firestoreService: {
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
    getDocument: vi.fn(),
    getCollection: vi.fn(),
  }
}));

describe('PartyService Core', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates a valid party code', () => {
    const code = partyService.generatePartyCode();
    expect(code).toMatch(/^[0-9A-F]{4}-[0-9A-F]{4}$/);
  });

  it('can create a party', async () => {
    const dmUid = 'dm-123';
    const name = 'Epic Quest';
    
    const result = await partyService.createParty(dmUid, name);
    
    expect(result.dmUid).toBe(dmUid);
    expect(result.name).toBe(name);
    expect(result.members).toEqual([]);
    expect(firestoreService.createDocument).toHaveBeenCalledWith(
      'parties',
      result.id,
      expect.objectContaining({ dmUid, name, members: [] })
    );
  });

  it('can join a party', async () => {
    await partyService.joinParty('char-1', 'PARTY-ID');
    expect(firestoreService.updateDocument).toHaveBeenCalledWith(
      'characters',
      'char-1',
      { partyId: 'PARTY-ID' }
    );
  });

  it('can leave a party', async () => {
    await partyService.leaveParty('char-1');
    expect(firestoreService.updateDocument).toHaveBeenCalledWith(
      'characters',
      'char-1',
      { partyId: null }
    );
  });
});

describe('Party Member Logic', () => {
  const partyId = 'A1B2-C3D4';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTemplate: EntityTemplate = {
    id: 'temp-1',
    dmUid: 'dm-1',
    type: 'monster',
    name: 'Goblin',
    maxHp: 7,
    ac: 15,
    notes: 'Sneaky'
  };

  it('can add a member instance from a template (snapshot)', async () => {
    // Mock current party members to be empty
    vi.mocked(firestoreService.getDocument).mockResolvedValue({
      id: partyId,
      members: []
    } as any);

    const result = await partyService.addMemberInstance(partyId, mockTemplate);

    expect(result.templateOriginId).toBe('temp-1');
    expect(result.name).toBe('Goblin');
    expect(result.hp.current).toBe(7);
    expect(result.hp.max).toBe(7);
    
    expect(firestoreService.updateDocument).toHaveBeenCalledWith(
      'parties',
      partyId,
      {
        members: expect.arrayContaining([
          expect.objectContaining({ name: 'Goblin', templateOriginId: 'temp-1' })
        ])
      }
    );
  });

  it('can remove a member instance', async () => {
    const existingMember: PartyEntity = {
      id: 'inst-1',
      templateOriginId: 'temp-1',
      type: 'monster',
      name: 'Goblin',
      hp: { current: 5, max: 7 },
      ac: 15,
      notes: ''
    };

    vi.mocked(firestoreService.getDocument).mockResolvedValue({
      id: partyId,
      members: [existingMember]
    } as any);

    await partyService.removeMemberInstance(partyId, 'inst-1');

    expect(firestoreService.updateDocument).toHaveBeenCalledWith(
      'parties',
      partyId,
      { members: [] }
    );
  });

  it('can update a member instance (e.g., take damage)', async () => {
    const existingMember: PartyEntity = {
      id: 'inst-1',
      templateOriginId: 'temp-1',
      type: 'monster',
      name: 'Goblin',
      hp: { current: 7, max: 7 },
      ac: 15,
      notes: ''
    };

    vi.mocked(firestoreService.getDocument).mockResolvedValue({
      id: partyId,
      members: [existingMember]
    } as any);

    await partyService.updateMemberInstance(partyId, 'inst-1', {
      hp: { current: 4, max: 7 }
    });

    expect(firestoreService.updateDocument).toHaveBeenCalledWith(
      'parties',
      partyId,
      {
        members: [
          expect.objectContaining({
            id: 'inst-1',
            hp: { current: 4, max: 7 }
          })
        ]
      }
    );
  });

  describe('Error States', () => {
    it('throws error when adding entity to non-existent party', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);
      await expect(partyService.addMemberInstance('404', mockTemplate))
        .rejects.toThrow('Party not found');
    });

    it('throws error when removing entity from non-existent party', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);
      await expect(partyService.removeMemberInstance('404', 'any'))
        .rejects.toThrow('Party not found');
    });

    it('throws error when updating entity in non-existent party', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue(null);
      await expect(partyService.updateMemberInstance('404', 'any', {}))
        .rejects.toThrow('Party not found');
    });
  });

  describe('Edge Cases (Branch Coverage)', () => {
    it('handles addMemberInstance when members array is missing in DB', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue({ id: partyId } as any);
      const result = await partyService.addMemberInstance(partyId, mockTemplate);
      expect(result.name).toBe('Goblin');
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        'parties',
        partyId,
        { members: [expect.objectContaining({ name: 'Goblin' })] }
      );
    });

    it('handles removeMemberInstance when members array is missing in DB', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue({ id: partyId } as any);
      await partyService.removeMemberInstance(partyId, 'any-id');
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        'parties',
        partyId,
        { members: [] }
      );
    });

    it('handles updateMemberInstance when members array is missing in DB', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue({ id: partyId } as any);
      await partyService.updateMemberInstance(partyId, 'any-id', {});
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        'parties',
        partyId,
        { members: [] }
      );
    });

    it('calls update with original array when removing non-existent member', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue({ id: partyId, members: [] } as any);
      await partyService.removeMemberInstance(partyId, 'non-existent');
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        'parties',
        partyId,
        { members: [] }
      );
    });

    it('calls update with original array when updating non-existent member', async () => {
      vi.mocked(firestoreService.getDocument).mockResolvedValue({ id: partyId, members: [] } as any);
      await partyService.updateMemberInstance(partyId, 'non-existent', {});
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        'parties',
        partyId,
        { members: [] }
      );
    });

    it('hits both ternary branches in updateMemberInstance map', async () => {
      const existingMembers = [
        { id: '1', name: 'Keep Me' },
        { id: '2', name: 'Update Me' }
      ];
      vi.mocked(firestoreService.getDocument).mockResolvedValue({ id: partyId, members: existingMembers } as any);
      
      await partyService.updateMemberInstance(partyId, '2', { name: 'Updated' });
      
      expect(firestoreService.updateDocument).toHaveBeenCalledWith(
        'parties',
        partyId,
        {
          members: [
            { id: '1', name: 'Keep Me' },
            { id: '2', name: 'Updated' }
          ]
        }
      );
    });

    it('covers the listenToParty placeholder', () => {
      partyService.listenToParty();
    });
  });
});
