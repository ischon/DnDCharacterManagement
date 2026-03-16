import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InitiativeEntity } from '../types/dnd_types';
import { InitiativeEngine } from '../services/InitiativeEngine';

export const useInitiativeStore = defineStore('initiative', () => {
  // We keep a private instance of the engine to handle the complex state/sorting math
  let engine = new InitiativeEngine();

  // Reactive state that Vue components will bind to
  const combatants = ref<InitiativeEntity[]>([]);
  const activeTurnIndex = ref(0);
  const roundCount = ref(1);

  // Syncs the engine's internal state to our reactive Vue refs
  const syncState = () => {
    const state = engine.getState();
    combatants.value = state.entities;
    activeTurnIndex.value = state.activeTurnIndex;
    roundCount.value = state.round;
  };

  // Computed state
  const hasActiveCombat = computed(() => combatants.value.length > 0);
  const activeEntity = computed(() => {
    if (!hasActiveCombat.value) return null;
    return combatants.value[activeTurnIndex.value];
  });

  // Actions
  const initCombat = (entities: InitiativeEntity[]) => {
    engine = new InitiativeEngine({
      entities: [...entities],
      activeTurnIndex: 0,
      round: 1
    });
    syncState();
  };

  const endCombat = () => {
    engine = new InitiativeEngine();
    syncState();
  };

  const nextTurn = () => {
    if (!hasActiveCombat.value) return;
    engine.nextTurn();
    syncState();
  };

  const previousTurn = () => {
    if (!hasActiveCombat.value) return;
    engine.previousTurn();
    syncState();
  };

  const addCombatant = (newEntity: InitiativeEntity) => {
    if (!hasActiveCombat.value) {
      initCombat([newEntity]);
      return;
    }
    engine.addEntity(newEntity);
    syncState();
  };

  return {
    // State
    combatants,
    activeTurnIndex,
    roundCount,
    
    // Getters
    hasActiveCombat,
    activeEntity,
    
    // Actions
    initCombat,
    endCombat,
    nextTurn,
    previousTurn,
    addCombatant
  };
});
