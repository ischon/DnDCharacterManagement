<template>
  <div class="data-dump">
    <h1>Data Inspection View (V2 Foundations)</h1>
    <p>This is a temporary view to verify backend data structures before UI designs are finalized.</p>
    
    <div class="controls">
      <button @click="loadMockCharacter">Load Mock Character</button>
      <button @click="levelUp">Level Up (Simulate Delta)</button>
    </div>

    <section v-if="character">
      <h2>Character: {{ character.core.name }}</h2>
      <pre>{{ JSON.stringify(character, null, 2) }}</pre>
    </section>

    <section v-if="effectiveStats">
      <h2>Effective Stats (Reduced From Deltas)</h2>
      <pre>{{ JSON.stringify(effectiveStats, null, 2) }}</pre>
    </section>

    <section v-if="party">
      <h2>Current Party</h2>
      <pre>{{ JSON.stringify(party, null, 2) }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterStore } from '../stores/characterStore';
import { usePartyStore } from '../stores/partyStore';

const characterStore = useCharacterStore();
const partyStore = usePartyStore();

const character = computed(() => characterStore.currentCharacter);
const effectiveStats = computed(() => characterStore.effectiveStats);
const party = computed(() => partyStore.currentParty);

const loadMockCharacter = () => {
  characterStore.setCharacter({
    id: 'char_123',
    ownerUid: 'user_456',
    partyId: null,
    dmEditable: true,
    appId: 'v2-testing',
    core: {
      name: 'Grog Strongjaw',
      avatarUrl: null,
      proficiencyBonus: 2,
      currentLevel: 1,
      race: 'Goliath',
      class: 'Barbarian'
    },
    baseStats: {
      strength: 18,
      dexterity: 12,
      constitution: 16,
      intelligence: 8,
      wisdom: 10,
      charisma: 10
    },
    stats: {},
    skills: {},
    resources: {
      hp: { current: 15, max: 15 }
    },
    levelDeltas: [
      { level: 0, hpGain: 12, conModifierAtLevel: 3 }
    ],
    freeform: { inventory: '', customFeatures: '', notes: '' },
    status: { conditions: [], isDead: false }
  });
};

const levelUp = () => {
  characterStore.addLevelDelta({
    level: characterStore.currentCharacter!.levelDeltas.length,
    hpGain: 10,
    conModifierAtLevel: 3,
    baseStats: { strength: 2 } // ASI
  });
};
</script>

<style scoped>
.data-dump {
  padding: 2rem;
  font-family: monospace;
  background: #1a1a1a;
  color: #00ff00;
  min-height: 100vh;
}
pre {
  background: #000;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
}
button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
