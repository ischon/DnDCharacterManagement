import type { InitiativeEntity, InitiativeState } from '../types/dnd_types';

export class InitiativeEngine {
  private state: InitiativeState;

  constructor(initialState?: Partial<InitiativeState>) {
    this.state = {
      entities: [],
      activeTurnIndex: 0,
      round: 1,
      ...initialState
    };
    if (this.state.entities.length > 0) {
      this.sortEntities();
    }
  }

  public getState(): InitiativeState {
    // Return a shallow copy to prevent direct unauthorized mutations from outside
    return { ...this.state, entities: [...this.state.entities] };
  }

  public getActiveEntity(): InitiativeEntity | null {
    if (this.state.entities.length === 0) return null;
    return this.state.entities[this.state.activeTurnIndex] || null;
  }

  public addEntity(entity: InitiativeEntity): void {
    const activeEntityId = this.getActiveEntity()?.id;
    this.state.entities.push(entity);
    this.sortEntities();
    this.restoreActiveTurn(activeEntityId);
  }

  public removeEntity(id: string): void {
    const activeEntityId = this.getActiveEntity()?.id;
    const removedIndex = this.state.entities.findIndex(e => e.id === id);
    
    if (removedIndex === -1) return;

    this.state.entities.splice(removedIndex, 1);

    if (this.state.entities.length === 0) {
      this.state.activeTurnIndex = 0;
      return;
    }

    if (activeEntityId === id) {
      // The currently active entity was removed.
      // The entity that was *next* in line shifted left to fill the removedIndex hole.
      // So activeTurnIndex inherently already points to the next entity.
      // We just need to bounds check if removedIndex was the last item.
      if (this.state.activeTurnIndex >= this.state.entities.length) {
        this.state.activeTurnIndex = 0;
        this.state.round++;
      }
    } else {
      this.restoreActiveTurn(activeEntityId);
    }
  }

  public updateEntity(id: string, updates: Partial<InitiativeEntity>): void {
    const index = this.state.entities.findIndex(e => e.id === id);
    if (index === -1) return;

    const activeEntityId = this.getActiveEntity()?.id;
    this.state.entities[index] = { ...this.state.entities[index], ...updates };

    if (updates.initiative !== undefined) {
      this.sortEntities();
      this.restoreActiveTurn(activeEntityId);
    }
  }

  public nextTurn(): void {
    if (this.state.entities.length === 0) return;

    this.state.activeTurnIndex++;
    if (this.state.activeTurnIndex >= this.state.entities.length) {
      this.state.activeTurnIndex = 0;
      this.state.round++;
    }
  }

  public previousTurn(): void {
    if (this.state.entities.length === 0) return;

    this.state.activeTurnIndex--;
    if (this.state.activeTurnIndex < 0) {
      this.state.activeTurnIndex = this.state.entities.length - 1;
      if (this.state.round > 1) {
        this.state.round--;
      }
    }
  }

  /**
   * Resorts the current list of entities by initiative (descending).
   * In case of a tie, you could add secondary tie-breakers (like Dex mod) later.
   */
  private sortEntities(): void {
    this.state.entities.sort((a, b) => {
      // Primary: High initiative first
      return b.initiative - a.initiative;
    });
  }

  /**
   * Repositions activeTurnIndex to point to the previously active entity
   * after adding/removing or resorting items.
   */
  private restoreActiveTurn(activeEntityId: string | undefined): void {
    if (!activeEntityId) return;

    const newIndex = this.state.entities.findIndex(e => e.id === activeEntityId);
    if (newIndex !== -1) {
      this.state.activeTurnIndex = newIndex;
    }
  }
}
