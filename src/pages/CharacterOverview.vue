<script setup>
import router from "@/router.js";

import {onBeforeMount, ref} from 'vue'
import {FirebaseHandler} from "@/helpers/firebase.js";

// setup() {
const characterId = router.currentRoute.value.params.id
const firebaseHandler = new FirebaseHandler()
const character = ref({})
console.log(characterId)

onBeforeMount(async () => {
  console.log("before mount")
  await firebaseHandler.setup()
  character.value = await firebaseHandler.getCharacterData(characterId)
  console.log(characterId)
  console.log(character.value)
})
</script>

<template>
  <div class="page container col"> <!-- Page 1 -->
    <div class="header container row flex-1"> <!-- Header -->
      <div class="container col flex-1"> <!-- Left Column -->
        <div class="item flex-1">
          <h1 class="content">{{ character.name }}</h1>
          <h1 class="label">Character Name</h1>
        </div>
      </div>
      <div class="container col flex-2"> <!-- Right Column -->
        <div class="container row">
          <div class="item flex-1">
            <p class="content">{{ character.class }} {{ character.level }}</p>
            <p class="label">Class & Level</p>
          </div>
          <div class="item flex-1">
            <p class="content">{{ character.background }}</p>
            <p class="label">Background</p>
          </div>
          <div class="item flex-1">
            <p class="content">{{ firebaseHandler.firebaseUser.displayName }}</p>
            <p class="label">Player Name</p>
          </div>
        </div>
        <div class="container row">
          <div class="item flex-1">
            <p class="content">{{ character.race }}</p>
            <p class="label">Race</p>
          </div>
          <div class="item flex-1">
            <p class="content">{{ character.alignment }}</p>
            <p class="label">Alignment</p>
          </div>
          <div class="item flex-1">
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
          <div class="item flex-1">
            <!--PROFICIENCY BONUS-->
          </div>
          <div class="item row flex-1">
            <!--INSPIRATION-->
          </div>
          <div class="container row flex-2">
            <!--STRENGTH-->
            <div class="container col flex-1">
              <div class="item flex-1">
                <!--MODIFIER-->
              </div>
              <div class="item flex-1">
                <!--SCORE-->
              </div>
              <div class="container col flex-2">
                <!--SKILLS-->
              </div>
            </div>
          </div>
          <div class="container row flex-2">
            <!--DEXTERITY-->
            <div class="container col flex-1">
              <div class="item flex-1">
                <!--MODIFIER-->
              </div>
              <div class="item flex-1">
                <!--SCORE-->
              </div>
              <div class="container col flex-2">
                <!--SKILLS-->
              </div>
            </div>
          </div>
          <div class="container row flex-2">
            <!--CONSTITUTION-->
            <div class="container col flex-1">
              <div class="item flex-1">
                <!--MODIFIER-->
              </div>
              <div class="item flex-1">
                <!--SCORE-->
              </div>
              <div class="container col flex-2">
                <!--SKILLS-->
              </div>
            </div>
          </div>
          <div class="container row flex-2">
            <!--INTELLIGENCE-->
            <div class="container col flex-1">
              <div class="item flex-1">
                <!--MODIFIER-->
              </div>
              <div class="item flex-1">
                <!--SCORE-->
              </div>
              <div class="container col flex-2">
                <!--SKILLS-->
              </div>
            </div>
          </div>
          <div class="container row flex-2">
            <!--WISDOM-->
            <div class="container col flex-1">
              <div class="item flex-1">
                <!--MODIFIER-->
              </div>
              <div class="item flex-1">
                <!--SCORE-->
              </div>
              <div class="container col flex-2">
                <!--SKILLS-->
              </div>
            </div>
          </div>
          <div class="container row flex-2">
            <!--CHARISMA-->
            <div class="container col flex-1">
              <div class="item flex-1">
                <!--MODIFIER-->
              </div>
              <div class="item flex-1">
                <!--SCORE-->
              </div>
              <div class="container col flex-2">
                <!--SKILLS-->
              </div>
            </div>
          </div>
          <div class="item row flex-1">
            <!--PASSIVE WISDOM (PERCEPTION)-->
          </div>
        </div>
        <div class="container col flex-2">
          <div class="container row flex-1">
            <div class="container col flex-1">
              <!--STATS-->
              <div class="container row flex-1">
                <div class="item flex-1">
                  <!--ARMOR CLASS-->

                </div>
                <div class="item flex-1">
                  <!--INITIATIVE-->
                </div>
                <div class="item flex-1">
                  <!--SPEED-->
                </div>
              </div>
              <div class="container row flex-1">
                <!--CURRENT HIT POINTS-->
              </div>
              <div class="container row flex-1">
                <!--TEMPORARY HIT POINTS-->
              </div>
              <div class="container row flex-1">
                <div class="item flex-1">
                  <!--HIT DICE-->
                </div>
                <div class="item flex-1">
                  <!--DEATH SAVES-->
                </div>
              </div>
            </div>
            <div class="container col flex-1">
              <div class="item flex-1">
                <!--PERSONALITY TRAITS-->
              </div>
              <div class="item flex-1">
                <!--IDEALS-->
              </div>
              <div class="item flex-1">
                <!--BONDS-->
              </div>
              <div class="item flex-1">
                <!--FLAWS-->
              </div>
            </div>
          </div>
          <div class="container row flex-1">
            <div class="container col flex-1">
              <!--ATTACKS & SPELLCASTING-->
            </div>
            <div class="container col flex-1">
              <!--FEATURES & TRAITS-->
            </div>
          </div>
        </div>

      </div>
      <div class="container row flex-1">
        <div class="container row flex-1">
          <div class="item">
            <!--OTHER PROFICIENCIES & LANGUAGES-->
          </div>
        </div>
        <div class="container row flex-2">
          <div class="item">
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

<style scoped lang="sass">

</style>