import { firestoreService } from './FirestoreService';
import type { EntityTemplate } from '../types/dnd_types';
import { v4 as uuidv4 } from 'uuid';
import { where } from 'firebase/firestore';

/**
 * TemplateService
 * Manages DM blueprints for monsters and NPCs.
 */
export class TemplateService {
  /**
   * Fetch all templates belonging to a specific DM
   */
  async getTemplates(dmUid: string): Promise<EntityTemplate[]> {
    return await firestoreService.getCollection<EntityTemplate>(
      'templates',
      where('dmUid', '==', dmUid)
    );
  }

  /**
   * Create a new entity blueprint
   */
  async createTemplate(templateData: Omit<EntityTemplate, 'id'>): Promise<EntityTemplate> {
    const id = uuidv4();
    const newTemplate: EntityTemplate = {
      ...templateData,
      id
    };

    await firestoreService.createDocument('templates', id, newTemplate);
    return newTemplate;
  }

  /**
   * Update an existing blueprint
   */
  async updateTemplate(id: string, updates: Partial<EntityTemplate>): Promise<void> {
    await firestoreService.updateDocument('templates', id, updates);
  }

  /**
   * Delete a blueprint
   */
  async deleteTemplate(id: string): Promise<void> {
    await firestoreService.deleteDocument('templates', id);
  }
}

export const templateService = new TemplateService();
