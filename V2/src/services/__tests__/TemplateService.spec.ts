import { describe, it, expect, vi, beforeEach } from 'vitest';
import { templateService } from '../TemplateService';
import { firestoreService } from '../FirestoreService';
import type { EntityTemplate } from '../../types/dnd_types';

// Mock firestoreService
vi.mock('../FirestoreService', () => ({
  firestoreService: {
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
    getDocument: vi.fn(),
    getCollection: vi.fn(),
  }
}));

describe('TemplateService', () => {
  const appId = 'test-app-id';

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable
    vi.stubEnv('VITE_FIREBASE_APP_ID', appId);
  });

  const mockTemplate: Omit<EntityTemplate, 'id'> = {
    dmUid: 'dm-123',
    type: 'monster',
    name: 'Ogre',
    maxHp: 59,
    ac: 11,
    notes: 'Big and smelly'
  };

  it('can create a template', async () => {
    const result = await templateService.createTemplate(mockTemplate);
    
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Ogre');
    expect(firestoreService.createDocument).toHaveBeenCalledWith(
      'templates',
      result.id,
      expect.objectContaining({ name: 'Ogre', dmUid: 'dm-123' })
    );
  });

  it('can get templates for a DM', async () => {
    const mockData = [{ id: '1', name: 'Ogre' }, { id: '2', name: 'Goblin' }];
    vi.mocked(firestoreService.getCollection).mockResolvedValue(mockData as any);

    const results = await templateService.getTemplates('dm-123');
    
    expect(firestoreService.getCollection).toHaveBeenCalledWith(
      'templates',
      expect.anything() // represents the where clause
    );
    expect(results).toEqual(mockData);
  });

  it('can update a template', async () => {
    await templateService.updateTemplate('temp-1', { name: 'Super Ogre' });
    
    expect(firestoreService.updateDocument).toHaveBeenCalledWith(
      'templates',
      'temp-1',
      { name: 'Super Ogre' }
    );
  });

  it('can delete a template', async () => {
    await templateService.deleteTemplate('temp-1');
    
    expect(firestoreService.deleteDocument).toHaveBeenCalledWith(
      'templates',
      'temp-1'
    );
  });
});
