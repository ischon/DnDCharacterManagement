import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useInitiativeStore } from '../useInitiativeStore';
import type { InitiativeEntity } from '../../types/dnd_types';

describe('useInitiativeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockEntities: InitiativeEntity[] = [
    { id: '1', name: 'Goblin', initiative: 12, hp: { current: 7, max: 7 }, type: 'monster' },
    { id: '2', name: 'Hero', initiative: 18, hp: { current: 30, max: 30 }, type: 'player' },
    { id: '3', name: 'Ogre', initiative: 8, hp: { current: 40, max: 40 }, type: 'monster' }
  ];

  it('initializes with empty state', () => {
    const store = useInitiativeStore();
    expect(store.combatants).toEqual([]);
    expect(store.activeTurnIndex).toBe(0);
    expect(store.roundCount).toBe(1);
    expect(store.hasActiveCombat).toBe(false);
    expect(store.activeEntity).toBeNull();
  });

  it('can start combat via initCombat', () => {
    const store = useInitiativeStore();
    store.initCombat(mockEntities);
    
    // De Engine hanteert fallback sortering op initiative DESC
    expect(store.combatants[0].name).toBe('Hero');
    expect(store.combatants[1].name).toBe('Goblin');
    expect(store.combatants[2].name).toBe('Ogre');
    
    expect(store.activeTurnIndex).toBe(0);
    expect(store.roundCount).toBe(1);
  });

  it('can progress turns and rounds', () => {
    const store = useInitiativeStore();
    store.initCombat(mockEntities);
    
    store.nextTurn();
    expect(store.activeTurnIndex).toBe(1);
    
    store.nextTurn();
    store.nextTurn(); // Wraps around
    expect(store.activeTurnIndex).toBe(0);
    expect(store.roundCount).toBe(2);
  });

  it('can regress turns and rounds', () => {
    const store = useInitiativeStore();
    store.initCombat(mockEntities);
    
    store.nextTurn(); // Gaan naar index 1
    store.previousTurn(); // Terug naar 0
    expect(store.activeTurnIndex).toBe(0);
    
    store.previousTurn(); // Wrap back naar laatste entity (2)
    expect(store.activeTurnIndex).toBe(2);
    expect(store.roundCount).toBe(1); // De engine cappt regression op minimaal ronde 1
  });

  it('can add a new combatant mid-combat', () => {
    const store = useInitiativeStore();
    store.initCombat(mockEntities);
    store.nextTurn(); // Zorgt dat actieve index op Goblin (1) zit
    
    // Voeg een trage zombie in
    const zombie: InitiativeEntity = { id: '4', name: 'Zombie', initiative: 4, hp: { current: 20, max: 20 }, type: 'monster' };
    store.addCombatant(zombie);
    
    expect(store.combatants.length).toBe(4);
    // Zombie is de traagste en komt achteraan
    expect(store.combatants[3].name).toBe('Zombie');
    // Actieve beurt moet Goblin blijven (index wijzigt dynamisch in Engine als iemand VOOR hem gegooid wordt, maar hier kwam Zombie ERNA, dus index blijft 1)
    expect(store.activeTurnIndex).toBe(1); 
  });
  
  it('can end combat', () => {
    const store = useInitiativeStore();
    store.initCombat(mockEntities);
    store.endCombat();
    
    expect(store.combatants).toEqual([]);
    expect(store.activeTurnIndex).toBe(0);
    expect(store.roundCount).toBe(1);
  });
  
  it('can correctly identify the active entity', () => {
    const store = useInitiativeStore();
    store.initCombat(mockEntities);
    expect(store.activeEntity?.name).toBe('Hero');
    
    store.nextTurn();
    expect(store.activeEntity?.name).toBe('Goblin');
  });

  it('guards nextTurn and previousTurn when no combat active', () => {
    const store = useInitiativeStore();
    // No combatants added, should not crash or change index
    store.nextTurn();
    expect(store.activeTurnIndex).toBe(0);
    store.previousTurn();
    expect(store.activeTurnIndex).toBe(0);
  });

  it('can add the first combatant to an empty store', () => {
    const store = useInitiativeStore();
    const entity: InitiativeEntity = {
      id: 'solo-1',
      name: 'Solo Player',
      initiative: 10,
      type: 'player',
      hp: { current: 10, max: 10 },
      ac: 15
    };

    store.addCombatant(entity);
    expect(store.combatants).toHaveLength(1);
    expect(store.combatants[0].name).toBe('Solo Player');
    expect(store.roundCount).toBe(1);
    expect(store.hasActiveCombat).toBe(true);
  });
});
