<script setup>
import router from "@/router.js";

import {onBeforeMount, ref} from 'vue'
import {FirebaseHandler} from "@/helpers/firebase.js";
import {exampleCharacter} from "@/models/Examples.js";

// setup() {
const characterId = router.currentRoute.value.params.id
const firebaseHandler = new FirebaseHandler()
const character = ref({})
console.log(characterId)

const formatScore = (score) => {
  return ((score > 0) ? '+' : '') + score
}

onBeforeMount(async () => {
  console.log("before mount")
  await firebaseHandler.setup()
  // TODO: flip back
  // character.value = await firebaseHandler.getCharacterData(characterId)
  character.value = exampleCharacter
  console.log(characterId)
  console.log(character.value)
})
</script>

<template>
  <div class="page container col"> <!-- Page 1 -->
    <div class="header container row flex-1"> <!-- Header -->
      <div class="container col flex-1"> <!-- Left Column -->
        <div class="block top-item flex-1 no-border-top no-border-left" style="align-content: center">
          <h1 class="content">{{ character.name }}</h1>
          <h1 class="label">Character Name</h1>
        </div>
      </div>
      <div class="container col flex-2"> <!-- Right Column -->
        <div class="container row">
          <div class="block top-item flex-1  no-border-top">
            <p class="content">{{ character.class }} {{ character.level }}</p>
            <p class="label">Class & Level</p>
          </div>
          <div class="block top-item flex-1  no-border-top">
            <p class="content">{{ character.background }}</p>
            <p class="label">Background</p>
          </div>
          <div class="block top-item flex-1 no-border-right  no-border-top">
            <p class="content">{{ firebaseHandler.firebaseUser.displayName }}</p>
            <p class="label">Player Name</p>
          </div>
        </div>
        <div class="container row">
          <div class="block top-item flex-1">
            <p class="content">{{ character.race }}</p>
            <p class="label">Race</p>
          </div>
          <div class="block top-item flex-1">
            <p class="content">{{ character.alignment }}</p>
            <p class="label">Alignment</p>
          </div>
          <div class="block top-item flex-1 no-border-right">
            <p class="content">{{ character.experiencePoints }}</p>
            <p class="label">Experience Points</p>
          </div>
        </div>
      </div>
    </div>

    <div class="body container col">
      <div class="container row flex-2">
        <div class="container col flex-1">
          <!-- ABILITY SCORES -->
          <div class="container flex-1 block row labeled-row no-border-left">
            <div class="value flex-1">
              <p>
                {{ formatScore(character.proficiencyBonus) }}
              </p>
            </div>
            <div class="label flex-2">
              <p>
                Proficiency Bonus
              </p>
            </div>
          </div>
          <div class="container flex-1 block row labeled-row no-border-left">
            <div class="value flex-1">
              <p>
                {{ formatScore(character.inspiration) }}
              </p>
            </div>
            <div class="label flex-2">
              <p>
                Inspiration
              </p>
            </div>
          </div>
          <div v-for="(ability, ability_name) in character.abilities"
               class="container row flex-2 block ability-block no-border-left">
            <!--ABILITY-->
            <div class="container ability col flex-1">
              <div class="ability-modifier flex-1">
                <p class="content no-label">
                  {{ formatScore(ability.modifier) }}
                </p>
              </div>
              <div class="ability-score flex-1">
                <p class="ability-score-value">
                  {{ ability.score }}
                </p>
                <p class="ability-score-label">
                  {{ ability_name }}
                </p>
              </div>
            </div>
            <div class="container skill col flex-2">
              <!--SKILLS-->
              <div v-for="(skill_stats, skill_name) in ability.skills" class="skill-row flex-1">
                <div class="proficient" :class="{ selected: skill_stats.proficient }"></div>
                <div class="skill-score">
                  {{ formatScore(skill_stats.value) }}
                </div>
                <div class="skill-name">
                  {{ skill_name }}
                </div>
              </div>
            </div>
          </div>
          <div class="container flex-1 block row labeled-row  no-border-left">
            <div class="value flex-1">
              <p>
                {{ formatScore(character.passivePerception) }}
              </p>
            </div>
            <div class="label flex-2">
              <p>
                Passive Wisdom (Perception)
              </p>
            </div>
          </div>
        </div>
        <div class="container col flex-2">
          <div class="container row flex-1">
            <div class="container col flex-1">
              <!--STATS-->
              <div class="container row flex-1">
                <div class="container block value-display col flex-1">
                  <p class="flex-1 value">{{ character.armorClass }}</p>
                  <p>Armor Class</p>
                </div>
                <div class="container block value-display col flex-1">
                  <p class="flex-1 value">{{ formatScore(character.initiativeModifier) }}</p>
                  <p>Initiative</p>
                </div>
                <div class="container block value-display col flex-1">
                  <p class="flex-1 value">{{ character.speed }}</p>
                  <p>Speed</p>
                </div>
              </div>
              <div class="container block value-display col flex-1">
                <p>Hit Point Maximum: {{ character.hitPointMaximum }}</p>
                <p class="flex-1 value">{{ character.currentHitPoints }}</p>
                <p>Current Hit Points</p>
              </div>
              <div class="container block value-display col flex-1">
                <p class="flex-1 value">{{ character.tempHitPoints }}</p>
                <p>Temporary Hit Points</p>
              </div>
              <div class="container row flex-1">
                <div class="container block value-display col flex-1">
                  <p>Total Hit Dice: {{ character.maxHitDice }}</p>
                  <p class="flex-1 value">{{ character.currentHitDice }}</p>
                  <p>Hit Dice</p>
                </div>
                <div class="block flex-1 container col">
                  <div class="container row death-saves">
                    <div class="label flex-2">successes</div>
                    <div class="checks flex-1 container row">
                      <div class="check" :class="{ selected: key < character.deathSaves.successes  }"
                           v-for="(value, key) in new Array(3)"></div>
                    </div>
                  </div>
                  <div class="container row death-saves">
                    <div class="label flex-2">Failures</div>
                    <div class="checks flex-1 container row">
                      <div class="check" :class="{ selected: key < character.deathSaves.failures }"
                           v-for="(value, key) in new Array(3)"></div>
                    </div>
                  </div>
                  Death Saves
                </div>
              </div>
            </div>
            <div class="container col flex-1">
              <div class="block no-border-right flex-1">
                <p v-for="traits in character.personalityTraits.split('\\n')">
                  {{ traits }}
                </p>
                Personality Traits
              </div>
              <div class="block no-border-right flex-1">
                <p v-for="ideals in character.ideals.split('\\n')">
                  {{ ideals }}
                </p>
                Ideals
              </div>
              <div class="block no-border-right flex-1">
                <p v-for="bonds in character.bonds.split('\\n')">
                  {{ bonds }}
                </p>
                Bonds
              </div>
              <div class="block no-border-right flex-1">
                <p v-for="flaws in character.flaws.split('\\n')">
                  {{ flaws }}
                </p>
                Flaws
              </div>
            </div>
          </div>
          <div class="container row flex-1">
            <div class="container block col flex-1">
              <div v-for="row in character.attacks">
                attacks: {{ row.name }}
              </div>
              <div v-for="row in character.usableSpells.cantrips">
                cantrips: {{ row }}
              </div>
              <div v-for="(spells, lvl) in character.usableSpells.spells">
                <div v-if="spells.length > 0">

                  <div v-for="spell in spells">
                    spell {{ lvl }}: {{ spell }}
                  </div>
                </div>
              </div>
              Attacks & Spellcasting
            </div>
            <div class="container block no-border-right col flex-1">
              <div class="feature" v-for="feature in character.features">
                <p v-for="feat in feature.split('\\n')">
                  {{ feat }}
                </p>
              </div>
              Features & Traits
            </div>
          </div>
        </div>

      </div>
      <div class="container row flex-1">
        <div class="container row flex-1">
          <div class="block container col no-border-left no-border-bottom">
            <div class="language" v-for="language in character.languages">
              {{ language }}
            </div>
            Other Proficiencies & Languages
          </div>
        </div>
        <div class="container block col flex-2 no-border-right no-border-bottom">
          <div class="container row">
            <div class="container col flex-1">
              <div class="equipment-item container row">
                <div class="name flex-1">
                  Type
                </div>
                <div class="count flex-5">
                  Value
                </div>
              </div>
              <div class="equipment-item container row" v-for="(value, type) in character.coins">
                <div class="name flex-1">
                  {{ type }}
                </div>
                <div class="count flex-5">
                  {{ value }}
                </div>
              </div>
            </div>
            <div class="container row flex-3">
              <div class="container col ">
                <div class="equipment-item container row">
                  <div class="count flex-1">
                    Count
                  </div>
                  <div class="name flex-4">
                    Name
                  </div>
                  <div class="weight flex-1">
                    Weight
                  </div>

                </div>
                <div class="equipment-item container row" v-for="item in character.equipment">
                  <div class="count flex-1">
                    {{ item.count }}
                  </div>
                  <div class="name flex-4">
                    {{ item.name }}
                  </div>
                  <div class="weight flex-1">
                    {{ item.weight * item.count }} lb
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div>
            Equipment (including coin) & Character Notes
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  <div class="page container">-->
  <!--    <div class="header container row">-->
  <!--      <div class="container col flex-1">-->
  <!--        <div class="item flex-1">-->
  <!--          <div class="content">{{ character.name }}</div>-->
  <!--          <div class="label">Character Name</div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="col flex-2 container">-->
  <!--        <div class="row container">-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ character.age }}</div>-->
  <!--            <div class="label">Age</div>-->
  <!--          </div>-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ character.height }}</div>-->
  <!--            <div class="label">Height</div>-->
  <!--          </div>-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ character.weight }}</div>-->
  <!--            <div class="label">Weight</div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <div class="row container">-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ character.eyeColor }}</div>-->
  <!--            <div class="label">Eyes</div>-->
  <!--          </div>-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ character.skinColor }}</div>-->
  <!--            <div class="label">Skin</div>-->
  <!--          </div>-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ character.hairColor }}</div>-->
  <!--            <div class="label">Hair</div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="body container row">-->
  <!--      <div class="item flex-1">-->

  <!--      </div>-->
  <!--      <div class="item flex-2">-->

  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <!--  <div class="page container">-->
  <!--    <div class="header container row">-->
  <!--      <div class="item flex-1">-->
  <!--        <h1 class="content">{{ }}</h1>-->
  <!--        <div class="label">Spellcasting Class</div>-->
  <!--      </div>-->
  <!--      <div class="col flex-2 container">-->
  <!--        <div class="row container">-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ }}</div>-->
  <!--            <div class="label">Spellcasting Ability</div>-->
  <!--          </div>-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ }}</div>-->
  <!--            <div class="label">Spell Save DC</div>-->
  <!--          </div>-->
  <!--          <div class="item flex-1">-->
  <!--            <div class="content">{{ }}</div>-->
  <!--            <div class="label">Spell Attack Bonus</div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="body container row">-->

  <!--      <div class="item flex-1">-->
  <!--        <div class="item flex-1">-->

  <!--        </div>-->
  <!--        <div class="item flex-2">-->

  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="item flex-1">-->

  <!--      </div>-->
  <!--      <div class="item flex-1">-->

  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->

</template>

<style scoped lang="scss">
//.block {
//  margin: .25rem
//}
$radio-size: 0.5rem;
input[type="radio"] {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: $radio-size;
  height: $radio-size;
  //border: 0.15em solid currentColor;
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;

  &::before {
    content: "";
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset $radio-size $radio-size red;
  }

  &:checked::before {
    transform: scale(1);
  }
}
</style>