<script setup>
import router from "@/router.js";

import {onBeforeMount, ref} from 'vue'
import {FirebaseHandler} from "@/helpers/firebase.js";
import {exampleCharacter} from "@/models/Examples.js";

// setup() {
let loading = ref({
  character: true,
  image: true
})
const characterId = router.currentRoute.value.params.id
const firebaseHandler = new FirebaseHandler()
const character = ref({})

const characterImage = ref(undefined)

const uploadImage = async (e) => {
  const image = e.target.files[0];
  // check if image is too large 1*1024*1024 = 1MB
  const mb_s = 1
  if (image.size > (mb_s * 1024 * 1024)) {
    console.error('Image is too large');
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = e => {
    characterImage.value = e.target.result;
  };

  await firebaseHandler.setCharacterImage(characterId, image)

}

const formatScore = (score) => {
  return ((score > 0) ? '+' : '') + score
}

// 1 lb = 0.45359237 kg
const formatWeight = (pounds) => {
  if (pounds === 0) return '-'

  const weight = [[pounds], [(pounds * 0.45359237)]]

  // pounds and ounces
  if (weight[0][0] < 0.1) {
    // pounds to ounces conversion (times 16)
    weight[0][0] = weight[0][0] * 16
    weight[0][2] = 'oz'
  } else {
    weight[0][2] = 'lb'
  }

  // kilo's and grams
  if (weight[1][0] < 0.1) {
    // kilograms to grams conversion (times 1000)
    weight[1][0] = weight[1][0] * 1000
    weight[1][2] = 'g'
  } else {
    weight[1][2] = 'kg'
  }

  for (let i = 0; i < weight.length; i++) {
    weight[i][1] = weight[i][0]
    if (weight[i][1] % 1 !== 0) {
      weight[i][1] = weight[i][1]
          .toFixed(1)
          .replace('.', ',')
      if (weight[i][1].endsWith(',0')) {
        weight[i][1] = weight[i][1].slice(0, -2)
      }
    }
  }

  return `${weight[0][1]} ${weight[0][2]} | ${weight[1][1]} ${weight[1][2]}`
}

const formatLength = (foot) => {
  if (foot === 0) return '-'

  const length = [[foot], [(foot * 0.3048)]]

  // pounds and ounces
  if (length[0][0] < 1) {
    // feet to inch conversion (times 12)
    length[0][0] = length[0][0] * 12
    length[0][2] = 'in'
  } else {
    length[0][2] = 'ft'
  }

  // kilo's and grams
  if (length[1][0] < 1) {
    // meter to centimeter conversion (times 100)
    length[1][0] = length[1][0] * 100
    length[1][2] = 'cm'
  } else {
    length[1][2] = 'm'
  }

  for (let i = 0; i < length.length; i++) {
    length[i][1] = length[i][0]
    if (length[i][1] % 1 !== 0) {
      length[i][1] = length[i][1]
          .toFixed(1)
          .replace('.', ',')
      if (length[i][1].endsWith(',0')) {
        length[i][1] = length[i][1].slice(0, -2)
      }
    }
  }

  return `${length[0][1]} ${length[0][2]} | ${length[1][1]} ${length[1][2]}`
}
onBeforeMount(async () => {
  await firebaseHandler.setup()
  // TODO: flip back
  firebaseHandler.getCharacterData(characterId).then((data) => {
    character.value = data
    loading.value.character = false
  }).catch((error) => {
    loading.value.character = false
    console.error(error, 'No character found')
  })
  firebaseHandler.getCharacterImage(characterId).then((image) => {
    characterImage.value = image
    loading.value.image = false
  }).catch((error) => {
    loading.value.image = false
    console.error(error, 'No image found')
  })

  // await firebaseHandler.setCharacterData(exampleCharacter.objectData)
  // character.value = exampleCharacter
  // loading.value.character = false
})

</script>

<template>
  <div v-if="!loading.character">
    <div class="page container col" id="page-1"> <!-- Page 1 -->
      <div class="header container row flex-1"> <!-- Header -->
        <div class="container col flex-1"> <!-- Left Column -->
          <div class="container value-display col block flex-1 no-border-top no-border-left">
            <p class="flex-1 value medium no-transform">{{ character.name }}</p>
            <p>Character Name</p>
          </div>
        </div>
        <div class="container col flex-2"> <!-- Right Column -->
          <div class="container row">
            <div class="container block value-display col flex-1 no-border-top">
              <p class="flex-1 value medium no-transform">{{ character.class }} lvl {{ character.level }}</p>
              <p>Class & Level</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top">
              <p class="flex-1 value medium no-transform">{{ character.background }}</p>
              <p>Background</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top no-border-right">
              <p class="flex-1 value medium no-transform">{{ firebaseHandler.firebaseUser.displayName }}</p>
              <p>Player Name</p>
            </div>
          </div>
          <div class="container row">
            <div class="container block value-display col flex-1">
              <p class="flex-1 value medium no-transform">{{ character.race }}</p>
              <p>Race</p>
            </div>
            <div class="container block value-display col flex-1">
              <p class="flex-1 value medium no-transform">{{ character.alignment }}</p>
              <p>Alignment</p>
            </div>
            <div class="container block value-display col flex-1 no-border-right">
              <p class="flex-1 value medium no-transform">{{ character.experiencePoints }}</p>
              <p>Experience Points</p>
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
                  <div class="container block value-display col flex-1">
                    <div class="container col flex-1 value">
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
                    </div>
                    <p>Death Saves</p>
                  </div>
                </div>
              </div>
              <div class="container col flex-1">
                <div class="container block value-display col flex-1 no-border-right">
                  <div class="flex-1">
                    <p class="no-transform" v-for="traits in character.personalityTraits.split('\\n')">
                      {{ traits }}
                    </p>
                  </div>
                  <p>Personality Traits</p>
                </div>
                <div class="container block value-display col flex-1 no-border-right">
                  <div class="flex-1">
                    <p class="no-transform" v-for="ideals in character.ideals.split('\\n')">
                      {{ ideals }}
                    </p>
                  </div>
                  <p>Ideals</p>
                </div>
                <div class="container block value-display col flex-1 no-border-right">
                  <div class="flex-1">
                    <p class="no-transform" v-for="bonds in character.bonds.split('\\n')">
                      {{ bonds }}
                    </p>
                  </div>
                  <p>Bonds</p>
                </div>

                <div class="container block value-display col flex-1 no-border-right">
                  <div class="flex-1">
                    <p class="no-transform" v-for="flaws in character.flaws.split('\\n')">
                      {{ flaws }}
                    </p>
                  </div>
                  <p>Flaws</p>
                </div>
              </div>
            </div>
            <div class="container row flex-1">
              <div class="container block value-display align-start col flex-1">
                <div class="container col">
                  <div class="container row">
                    <p class="flex-2">Weapon</p>
                    <p class="flex-1">Bonus</p>
                    <p class="flex-2">Damage/ type</p>
                  </div>
                  <div class="container row" v-for="row in character.attacks">
                    <p class="flex-2">{{ row.name }}</p>
                    <p class="flex-1">{{ row.bonus > 0 ? '+ ' + row.bonus : row.bonus }}</p>
                    <p class="flex-2">{{ row.damage }} / {{ row.type }}</p>
                  </div>
                </div>
                <br/>
                <p>Cantrips</p>
                <p v-for="row in character.usableSpells.cantrips">
                  - {{ row }}
                </p>
                <br/>
                <p>Spells</p>
                <div class="flex-1" v-for="(spells, lvl) in character.usableSpells.spells">
                  <p v-if="spells.prepared.length > 0">Level {{ lvl }}</p>
                  <p v-if="spells.prepared.length > 0" v-for="spell in spells.prepared">
                    - {{ spell }}
                  </p>
                </div>
                <p class="align-center">Attacks & Spellcasting</p>
              </div>
              <div class="container value-display align-start block no-border-right col flex-1">
                <div class="flex-1">
                  <div v-for="feature in character.features">
                    <p v-for="feat in feature.split('\\n')">
                      {{ feat }}
                    </p>
                  </div>
                </div>
                <p class="align-center">Features & Traits</p>
              </div>
            </div>
          </div>

        </div>
        <div class="container row flex-1">
          <div class="container row flex-1">
            <div class="block container value-display col no-border-left no-border-bottom align-start">
              <div class="flex-1">
                <p>Languages</p>
                <p v-for="language in character.languages">
                  - {{ language }}
                </p>
                <br/>
                <p>Proficiencies</p>
                <div v-for="(items, category) in character.proficiencies">
                  <p v-if="items.length > 0">{{ category }}</p>
                  <p v-if="items.length > 0" v-for="proficiency in items">
                    - {{ proficiency }}
                  </p>
                  <br v-if="items.length > 0"/>
                </div>
              </div>
              <br>
              <p class="align-center">Languages & Other Proficiencies</p>
            </div>
          </div>
          <div class="container block value-display col flex-2 no-border-right no-border-bottom">
            <div class="container row">
              <div class="container col flex-1">
                <div class="container col block value-display no-border" v-for="(value, type) in character.coins">
                  <p class="value flex-1">
                    {{ value }}
                  </p>
                  <p>
                    {{ type }}
                  </p>
                </div>
              </div>
              <div class="container row flex-4">
                <div class="container col ">
                  <div class="equipment-item container row">
                    <div class="flex-1"></div>
                    <div class="flex-1">
                      Count
                    </div>
                    <div class="flex-4">
                      Name
                    </div>
                    <div class="flex-2">
                      Weight
                    </div>

                  </div>
                  <div class="equipment-item container row" v-for="item in character.equipment">
                    <div class="flex-1"></div>
                    <div class="flex-1">
                      {{ item.count }}
                    </div>
                    <div class="flex-4">
                      {{ item.name }}
                    </div>
                    <div class="flex-2">
                      {{ formatWeight(item.weight * item.count) }}
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <br>
            <p>
              Equipment
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="page container col" id="page-2"> <!-- Page 2 -->
      <div class="header container row"> <!-- Header -->
        <div class="container col flex-1"> <!-- Left Column -->
          <div class="container value-display col block flex-1 no-border-top no-border-left">
            <p class="flex-1 value medium no-transform">{{ character.name }}</p>
            <p>Character Name</p>
          </div>
        </div>
        <div class="container col flex-2"> <!-- Right Column -->
          <div class="container row">
            <div class="container block value-display col flex-1 no-border-top">
              <p class="flex-1 value medium no-transform">{{ character.age }}</p>
              <p>Age</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top">
              <p class="flex-1 value medium no-transform">{{ formatLength(character.height) }}</p>
              <p>Height</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top no-border-right">
              <p class="flex-1 value medium no-transform">{{ formatWeight(character.weight) }}</p>
              <p>Weight</p>
            </div>
          </div>
          <div class="container row">
            <div class="container block value-display col flex-1">
              <p class="flex-1 value medium no-transform">{{ character.eyeColor }}</p>
              <p>Eyes</p>
            </div>
            <div class="container block value-display col flex-1">
              <p class="flex-1 value medium no-transform">{{ character.skinColor }}</p>
              <p>Skin</p>
            </div>
            <div class="container block value-display col flex-1 no-border-right">
              <p class="flex-1 value medium no-transform">{{ character.hairColor }}</p>
              <p>Hair</p>
            </div>
          </div>
        </div>
      </div>
      <div class="body container row">
        <div class="container col flex-1">
          <div class="container block value-display col flex-1 no-border-left">
            <div class="flex-1">
              <img v-if="!loading.image && characterImage"
                   :src="characterImage" class="character-appearance" alt="Character Appearance"
              />
            </div>
            <div v-if="!characterImage">
              <input type="file" accept="image/jpeg" @change=uploadImage>
            </div>
            <p><input type="file" accept="image/*" name="image" id="file" onchange="loadFile" style="display: none;">
            </p>
            <p>Character Appearance</p>
          </div>
          <div class="container block value-display col flex-2 no-border-left no-border-bottom">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.backstory.split('\\n')">
                {{ line }}
              </p>
            </div>
            <p>Character Backstory</p>
          </div>
        </div>
        <div class="container col flex-2">
          <div class="container block value-display align-start col flex-1 no-border-right">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.allies.split('\\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Allies & Organizations</p>
          </div>
          <div class="container block value-display align-start col flex-1 no-border-right">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.additionalFeatures.split('\\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Additional Features & Traits</p>
          </div>
          <div class="container block value-display align-start col flex-1 no-border-right no-border-bottom">
            <div class="flex-1">
              <p class="flex-1 no-transform" v-for="line in character.treasure.split('\\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Treasure</p>
          </div>
        </div>
      </div>
    </div>
    <div class="page container col" id="page-3">
      <div class="header container row"> <!-- Header -->
        <div class="container col flex-1">
          <div class="container row">
            <div class="container value-display col block flex-3 no-border-top no-border-left">
              <p class="flex-1 value medium no-transform">{{ character.spellcastingClass }}</p>
              <p>Spellcasting Class</p>
            </div>
            <div class="container block value-display col flex-2 no-border-top">
              <p class="flex-1 value medium no-transform" style="text-transform: capitalize">
                {{ character.spellcastingAbility }}</p>
              <p>Spellcasting Ability</p>
            </div>
            <div class="container block value-display col flex-2 no-border-top">
              <p class="flex-1 value medium no-transform">{{ character.spellSaveDc }}</p>
              <p>Spell Save DC</p>
            </div>
            <div class="container block value-display col flex-2 no-border-top no-border-right">
              <p class="flex-1 value medium no-transform">{{ character.spellAttackBonus > 0 ? '+ ' + character.spellAttackBonus : character.spellAttackBonus }}</p>
              <p>Spell Attack Bonus</p>
            </div>
          </div>
        </div>
      </div>
      <div class="body container row">
        <div class="container col flex-1" v-for="(i, key) in [[0,1,2],[3,4,5],[6,7,8,9]]">
          <div class="container block value-display col flex-1" v-for="j in i"
               :class="{'no-border-bottom': [2,5,9].includes(j), 'no-border-left': key===0, 'no-border-right': key===2}">
            <div class="container row labeled-row" style="margin-bottom: .5rem">
              <div class="value flex-1">
                <p>lvl {{ j }}</p>
              </div>
              <div class="label flex-3" v-if="j===0">
                <p>Cantrips</p>
              </div>
              <div class="flex-3 container row" v-if="j!==0">
                <div class="value flex-1">
                  <p>{{ character.usableSpells.spells[j].spellSlots }}</p>
                </div>
                <div class="label flex-2">
                  <p>Total</p>
                </div>
                <div class="value flex-1">
                  <p>{{ character.usableSpells.spells[j].spellSlotsExpanded }}</p>
                </div>
                <div class="label flex-2">
                  <p>Expanded</p>
                </div>
              </div>
            </div>
            <div v-if="j!==0" class="container row">
              <div class="flex-1">
                <p style="text-align: center">Prepared</p>
              </div>
              <p class="flex-3">Spell Name</p>
            </div>

            <div v-if="j===0" class="container row">
              <p class="flex-3">Cantrip Name</p>
            </div>
            <div class="container col block no-border">
              <div v-if="j===0" v-for="cantrip in character.usableSpells.cantrips" class="container row">
                <p>{{ cantrip }}</p>
              </div>
              <div v-if="j!==0" v-for="spell in character.usableSpells.spells[j].known" class="container row">
                <div class="flex-1 container row" style="justify-content: center">
                  <div class="check"
                       :class="{selected:character.usableSpells.spells[j].prepared.includes(spell)}"></div>
                </div>
                <p class="flex-3">{{ spell }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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