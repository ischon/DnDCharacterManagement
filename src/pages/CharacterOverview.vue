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
        <div class="block top-item flex-1 border-top border-right">
          <h1 class="content">{{ character.name }}</h1>
          <h1 class="label">Character Name</h1>
        </div>
      </div>
      <div class="container col flex-2"> <!-- Right Column -->
        <div class="container row">
          <div class="block top-item flex-1">
            <p class="content">{{ character.class }} {{ character.level }}</p>
            <p class="label">Class & Level</p>
          </div>
          <div class="block top-item flex-1">
            <p class="content">{{ character.background }}</p>
            <p class="label">Background</p>
          </div>
          <div class="block top-item flex-1 no-border-right">
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
          <div class="container flex-1 block row labeled-row">
            <div class="value flex-1">
              <p>
                {{ character.proficiencyBonus }}
              </p>
            </div>
            <div class="label flex-2">
              <p>
                Proficiency Bonus
              </p>
            </div>
            <!--PROFICIENCY BONUS-->
          </div>
          <div class="container flex-1 block row labeled-row">
            <div class="value flex-1">
              <p>
                {{ character.inspiration }}
              </p>
            </div>
            <div class="label flex-2">
              <p>
                Inspiration
              </p>
            </div>
            <!--INSPIRATION-->
          </div>
          <div v-for="(ability, ability_name) in character.abilities" class="container row flex-2 block ability-block">
            <!--ABILITY-->
            <div class="container ability col flex-1">
              <div class="ability-modifier flex-1">
                <!--MODIFIER-->
                <p class="content no-label">
                  {{ ability.modifier }}
                </p>
              </div>
              <div class="ability-score flex-1">
                <!--SCORE-->
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
                <div class="skill-score">{{ (skill_stats.value > 0) ? '+' : '' }}{{ skill_stats.value }}</div>
                <div class="skill-name">{{ skill_name }}</div>
              </div>
            </div>
          </div>
          <div class="container flex-1 block row labeled-row">
            <div class="value flex-1">
              <p>
                {{ character.passivePerception }}
              </p>
            </div>
            <div class="label flex-2">
              <p>
                Passive Wisdom (Perception)
              </p>
            </div>
            <!--PASSIVE WISDOM (PERCEPTION)-->
          </div>
        </div>
        <div class="container col flex-2">
          <div class="container row flex-1">
            <div class="container col flex-1">
              <!--STATS-->
              <div class="container row flex-1">
                <div class="block flex-1">
                  <!--ARMOR CLASS-->

                </div>
                <div class="block flex-1">
                  <!--INITIATIVE-->
                </div>
                <div class="block flex-1">
                  <!--SPEED-->
                </div>
              </div>
              <div class="container block row flex-1">
                <!--CURRENT HIT POINTS-->
              </div>
              <div class="container block row flex-1">
                <!--TEMPORARY HIT POINTS-->
              </div>
              <div class="container row flex-1">
                <div class="block flex-1">
                  <!--HIT DICE-->
                </div>
                <div class="block flex-1">
                  <!--DEATH SAVES-->
                </div>
              </div>
            </div>
            <div class="container col flex-1">
              <div class="block no-border-right flex-1">
                <!--PERSONALITY TRAITS-->
              </div>
              <div class="block no-border-right flex-1">
                <!--IDEALS-->
              </div>
              <div class="block no-border-right flex-1">
                <!--BONDS-->
              </div>
              <div class="block no-border-right flex-1">
                <!--FLAWS-->
              </div>
            </div>
          </div>
          <div class="container row flex-1">
            <div class="container block col flex-1">
              <!--ATTACKS & SPELLCASTING-->
            </div>
            <div class="container block no-border-right col flex-1">
              <!--FEATURES & TRAITS-->
            </div>
          </div>
        </div>

      </div>
      <div class="container row flex-1">
        <div class="container row flex-1">
          <div class="block container">
            <!--OTHER PROFICIENCIES & LANGUAGES-->
          </div>
        </div>
        <div class="container row flex-2">
          <div class="block no-border-right container">
            <!--EQUIPMENT (including coin) & CHARACTER NOTES-->
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