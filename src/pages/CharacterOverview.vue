<script setup>
"use strict"
import router from "@/router.js";

import {onBeforeMount, ref, reactive, watch} from 'vue'
import {FirebaseHandler} from "@/helpers/firebase.js";
import {range} from 'lodash';

import {calculateCoins, longRest} from "@/helpers/characterHelpers.js";
import {formatScore, formatLength, formatWeight} from "@/helpers/formatHelpers.js";
import {ICONS} from "@/helpers/icons.js";

import {ModelTypes, EditPopup} from "@/helpers/editPopupHelper.js";

import "@/styles/popup.scss"

const SPACE_CHAR = ' ‎'

// setup() {
const loading = reactive({
  character: true,
  image: true
})

const editPopup = reactive(new EditPopup())

const showImageModel = ref(false)

const toolTipModel = reactive({
  open: false,
  item: undefined,
  content: undefined
})


const confirmModelData = reactive({
  open: false,
  item: undefined,
  confirmFunction: undefined,
  question: undefined
})

const resetConfirmModelData = () => {
  confirmModelData.open = false
  confirmModelData.item = undefined
  confirmModelData.confirmFunction = undefined
  confirmModelData.question = undefined
}


const characterId = router.currentRoute.value.params.id
const firebaseHandler = new FirebaseHandler()
let character = undefined
const editingPopup = new EditPopup()

const characterImage = ref(undefined)

watch(
    () => router.currentRoute.value.params.id,
    async () => {
      window.location.reload();
    }
);

const atClickProficiency = (ability_name, skill_name) => {
  character.proficiencyToggle(ability_name, skill_name);
  firebaseHandler.setCharacterData(character.objectData);
}
const atClickPrepared = (spell_lvl, spell_name) => {
  character.spellcastingPreparedToggle(spell_lvl, spell_name);
  firebaseHandler.setCharacterData(character.objectData);
}

const openLongRestModal = () => {
  confirmModelData.open = true
  confirmModelData.question = 'Are you sure you want to take a Long rest?'
  confirmModelData.confirmFunction = async () => {
    longRest(character, true)
    await firebaseHandler.setCharacterData(character.objectData)
    confirmModelData.open = false
  }
}
const openShortRestModal = () => {
  editingPopup.atClickEdit(character, [
    ['Max hit Dice', '', character.statMaxHitDice, ModelTypes.disabled],
    ['Usable hit Dice', 'statCurrentAmountHitDice', character.statCurrentAmountHitDice, ModelTypes.number],
    ['Max hit points', '', character.statHitPointMaximumValue, ModelTypes.disabled],
    [`Current hit points`, 'statHitPointsCurrent', character.statHitPointsCurrent, ModelTypes.number],
  ])
}
const openLevelUpModal = () => {
  let items = [
    ['Character level / Max hit Dice', 'detailLevel', character.detailLevel, ModelTypes.number],
    ['Usable hit Dice', 'statCurrentAmountHitDice', character.statCurrentAmountHitDice, ModelTypes.number],

    ['Hit points basis', 'statHitPointsBase', character.statHitPointsBase, ModelTypes.number],
    ['Constitution modifier', 'abilityConstitutionModifier', character.abilityConstitutionModifier, ModelTypes.disabled],
    ['Additional hit points', 'statHitPointsMisc', character.statHitPointsMisc, ModelTypes.number],
    [`Current hit points`, 'statHitPointsCurrent', character.statHitPointsCurrent, ModelTypes.number],
    ['Experience points', 'detailExperiencePoints', character.detailExperiencePoints, ModelTypes.number],
  ]
  let spellslots = []
  // for (let lvl in character.spellcastingSpells) {
  //   spellslots.push([
  //       `Spell slots level ${lvl}`,
  //     `_character.spellcasting.spells.${lvl}.spellSlots`,
  //     character.spellcastingSpellSlots_get(lvl),
  //     ModelTypes.number])
  // }

  let reminders = [
    ['Reminders', '', 'Features and traits', ModelTypes.disabled],
    ['', '', 'Spellslots and new spells', ModelTypes.disabled],
    ['', '', 'Repeating abilities', ModelTypes.disabled],
  ]

  editingPopup.atClickEdit(character, [...items, ...spellslots, ...reminders])
}

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

  if (showImageModel.value) {
    showImageModel.value = false
  }

}

onBeforeMount(async () => {
  await firebaseHandler.setup()
  firebaseHandler.getCharacterData(characterId).then((data) => {
    character = reactive(data)
    loading.character = false
    editingPopup.configure(firebaseHandler, character)
  }).catch((error) => {
    loading.character = false
    console.error(error, 'No character found')
  })
  firebaseHandler.getCharacterImage(characterId).then((image) => {
    characterImage.value = image
    loading.image = false
  }).catch((error) => {
    loading.image = false
    console.error(error, 'No image found')
  })

})

</script>

<template>
  <div v-if="!loading.character">
    <div class="page container col" id="quick-actions">
      <div class="header container row flex-1">
        <h1>Quick Actions</h1>
      </div>
      <div class="body container row flex-1">
        <div class="block container value-display justify-center col clickable"
             @click="openLongRestModal">
          <p class="value medium no-transform ">Long Rest</p>
        </div>
        <div class="block container value-display justify-center col clickable"
             @click="openShortRestModal">
          <p class="value medium no-transform">Short Rest</p>
        </div>
        <div class="block container value-display justify-center col clickable"
             @click="openLevelUpModal">
          <p class="value medium no-transform">Level Up</p>
        </div>
      </div>
    </div>

    <div class="page container col" id="page-1"> <!-- Page 1 -->
      <div class="header container row flex-1">
        <h1>Character Overview</h1>
      </div>
      <div class="header container row flex-1"> <!-- Header -->
        <div class="container col flex-1"> <!-- Left Column -->
          <div class="container value-display col block flex-1 no-border-top no-border-left clickable"
               @click="editingPopup.atClickEdit(character, [['Character Name', 'detailName', character.detailName, ModelTypes.text]])">
            <p class="flex-1 value medium no-transform">{{ character.detailName }}</p>
            <p>Character Name</p>
          </div>
        </div>
        <div class="container col flex-2"> <!-- Right Column -->
          <div class="container row">
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="editingPopup.atClickEdit(character, [
                     ['Class', 'detailClass', character.detailClass, ModelTypes.classes],
                     ['Sub Class', 'detailSubClass', character.detailSubClass, ModelTypes.text],
                     ['Level', 'detailLevel', character.detailLevel, ModelTypes.number]
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.detailClass }} lvl {{
                  character.detailLevel
                }}</p>
              <p class="flex-1 value medium no-transform">{{ character.detailSubClass }}</p>
              <p>Class & Level</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="editingPopup.atClickEdit(character, [
                     ['Background', 'detailBackground', character.detailBackground, ModelTypes.text],
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.detailBackground }}</p>
              <p>Background</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top no-border-right">
              <p class="flex-1 value medium no-transform">{{ firebaseHandler.firebaseUser.displayName }}</p>
              <p>Player Name</p>
            </div>
          </div>
          <div class="container row">
            <div class="container block value-display col flex-1 clickable"
                 @click="editingPopup.atClickEdit(character, [
                     ['Race', 'detailRace', character.detailRace, ModelTypes.text],
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.detailRace }}</p>
              <p>Race</p>
            </div>
            <div class="container block value-display col flex-1 clickable"
                 @click="editingPopup.atClickEdit(character, [
                     ['Alignment', 'detailAlignment', character.detailAlignment, ModelTypes.alignments],
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.detailAlignment }}</p>
              <p>Alignment</p>
            </div>
            <div class="container block value-display col flex-1 no-border-right clickable"
                 @click="editingPopup.atClickEdit(character, [
                     ['Experience points', 'detailExperiencePoints', character.detailExperiencePoints, ModelTypes.number],
                     ])">
              <p class="flex-1 value medium no-transform">
                {{ character.detailExperiencePoints !== 0 ? character.detailExperiencePoints : '-' }}</p>
              <p>Experience Points</p>
            </div>
          </div>
        </div>
      </div>

      <div class="body container col">
        <div class="container row flex-1">
          <div class="container col flex-1">
            <!-- ABILITY SCORES -->
            <div class="container flex-1 block row labeled-row no-border-left">
              <div class="value flex-1"><p>{{ formatScore(character.proficiencyBonus) }}</p></div>
              <div class="label flex-2"><p>Proficiency Bonus</p></div>
            </div>
            <div class="container flex-1 block row labeled-row no-border-left clickable"
                 @click="editingPopup.atClickEdit(character, [
                      ['Inspiration', 'abilityInspiration', character.abilityInspiration, ModelTypes.checkbox],
                 ])">
              <div class="value flex-1">
                <div class="check" :class="{ selected: character.abilityInspiration }"></div>
              </div>
              <div class="label flex-2"><p>Inspiration</p></div>
            </div>
            <div v-for="(ability, ability_name) in character.abilities"
                 class="container row flex-2 block ability-block no-border-left">
              <!--ABILITY-->
              <div class="container ability col flex-1 clickable"
                   @click="()=>{
                     let items = [
                      [ability_name, `ability${ability_name}`, ability.score, ModelTypes.number]
                     ]
                     let bonusItems = []

                     // console.log('ability', ability_name)
                     if (ability_name === 'Constitution') {
                       bonusItems = [
                         ['Reminder', '', 'Update your health by 1 ', ModelTypes.disabled],
                         ['', '', 'for each level you have', ModelTypes.disabled],
                         ['', '', 'if your modifier changes', ModelTypes.disabled]
                       ]
                     }

                     editingPopup.atClickEdit(character, [...items, ...bonusItems])

                 }">
                <div class="ability-modifier flex-1"><p class="content no-label">{{ formatScore(ability.modifier) }}</p>
                </div>
                <div class="ability-score flex-1">
                  <p class="ability-score-value">{{ ability.score }}</p>
                  <p class="ability-score-label">{{ ability_name }}</p>
                </div>
              </div>
              <div class="container skill col flex-2">
                <!--SKILLS-->
                <div v-for="(skill_stats, skill_name) in ability.skills" class="skill-row flex-1">
                  <div class="proficient clickable"
                       :class="{ selected: character.proficiencies[ability_name.toLowerCase()].includes(skill_name) }"
                       @click="atClickProficiency(ability_name, skill_name)"></div>
                  <div class="skill-score">{{ formatScore(skill_stats.value) }}</div>
                  <div class="skill-name">{{ skill_name }}</div>
                </div>
              </div>
            </div>
            <div class="container flex-1 block row labeled-row  no-border-left">
              <div class="value flex-1"><p>{{ character.abilityPassivePerception }}</p></div>
              <div class="label flex-2"><p>Passive Wisdom (Perception)</p></div>
            </div>
          </div>
          <div class="container col flex-2">
            <div class="container row flex-1">
              <div class="container col flex-1">
                <!--STATS-->
                <div class="container row flex-1">
                  <div class="container block value-display col flex-1 clickable"
                       @click="editingPopup.atClickEdit(character, [
                          ['Armor class basis', 'statArmorClassBase', character.statArmorClassBase, ModelTypes.number],
                          [`Type of Armor`, 'statArmorClassArmorType', character.statArmorClassArmorType, ModelTypes.armor],
                          ['Added protection from a shield', 'statArmorClassShield', character.statArmorClassShield, ModelTypes.number],
                          ['Additional modifier', 'statArmorClassMisc', character.statArmorClassMisc, ModelTypes.number]
                       ])">
                    <p class="flex-1 value">{{ character.statArmorClass }}</p>
                    <p>Armor Class</p>
                  </div>
                  <div class="container block value-display col flex-1 clickable"
                       @click="editingPopup.atClickEdit(character, [
                          ['Dexterity modifier', 'abilityDexterityModifier', character.abilityDexterityModifier, ModelTypes.disabled],
                          [`Additional modifier`, 'abilityInitiativeMisc', character.abilityInitiativeMisc, ModelTypes.number],
                       ])">
                    <p class="flex-1 value">{{ formatScore(character.abilityInitiativeModifier) }}</p>
                    <p>Initiative</p>
                  </div>
                  <div class="container block value-display col flex-1 clickable"
                       @click="editingPopup.atClickEdit(character, [
                          ['Speed', 'statSpeed', character.statSpeed, ModelTypes.number],
                       ])">
                    <p class="flex-1 value">{{ character.statSpeed }}</p>
                    <p>Speed</p>
                  </div>
                </div>
                <div class="container block value-display col flex-1 clickable"
                     @click="editingPopup.atClickEdit(character, [
                          ['Hit points basis', 'statHitPointsBase', character.statHitPointsBase, ModelTypes.number],
                          ['Constitution modifier', 'abilityConstitutionModifier', character.abilityConstitutionModifier, ModelTypes.disabled],
                          ['Additional hit points', 'statHitPointsMisc', character.statHitPointsMisc, ModelTypes.number],
                          [`Current hit points`, 'statHitPointsCurrent', character.statHitPointsCurrent, ModelTypes.number],
                       ])">
                  <p>Hit Point Maximum: {{ character.statHitPointMaximum }}</p>
                  <p class="flex-1 value">{{ character.statHitPointsCurrent }}</p>
                  <p>Current Hit Points</p>
                </div>
                <div class="container block value-display col flex-1 clickable"
                     @click="editingPopup.atClickEdit(character, [
                          ['Temporary hit points', 'statHitPointsTemp', character.statHitPointsTemp, ModelTypes.number],
                       ])">
                  <p class="flex-1 value">{{
                      character.statHitPointsTemp !== 0 ? character.statHitPointsTemp : '-'
                    }}</p>
                  <p>Temporary Hit Points</p>
                </div>
                <div class="container row flex-1">
                  <div class="container block value-display col flex-1 clickable"
                       @click="editingPopup.atClickEdit(character, [
                          ['Hit Die', 'statHitDie', character.statHitDie, ModelTypes.die],
                          ['Usable hit Dice', 'statCurrentAmountHitDice', character.statCurrentAmountHitDice, ModelTypes.number],
                       ])">
                    <p>Total Hit Dice: {{ character.statMaxHitDice }}</p>
                    <p class="flex-1 value">{{ character.statCurrentHitDice }}</p>
                    <p>Hit Dice</p>
                  </div>
                  <div class="container block value-display col flex-1 clickable"
                       @click="editingPopup.atClickEdit(character, [
                         ['Successful rolls', 'statDeathSavesSuccesses', character.statDeathSavesSuccesses, ModelTypes.number],
                         ['Failed rolls', 'statDeathSavesFailures', character.statDeathSavesFailures, ModelTypes.number],
                  ])">
                    <div class="container col flex-1 value">
                      <div class="container row death-saves">
                        <div class="label flex-2">successes</div>
                        <div class="checks flex-1 container row">
                          <div class="check" :class="{ selected: key < character.statDeathSavesSuccesses  }"
                               v-for="key in range(0,3)">
                          </div>
                        </div>
                      </div>
                      <div class="container row death-saves">
                        <div class="label flex-2">Failures</div>
                        <div class="checks flex-1 container row">
                          <div class="check" :class="{ selected: key < character.statDeathSavesFailures }"
                               v-for="key in range(0,3)"></div>
                        </div>
                      </div>
                    </div>
                    <p>Death Saves</p>
                  </div>
                </div>
              </div>
              <div class="container col flex-1">
                <div class="container block value-display col flex-1 no-border-right clickable"
                     @click="editingPopup.atClickEdit(character, [
                         ['Traits', 'detailPersonalityTraits', character.detailPersonalityTraits, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="traits in character.detailPersonalityTraits.split('\n')">
                      {{ traits }}
                    </p>
                  </div>
                  <p>Personality Traits</p>
                </div>
                <div class="container block value-display col flex-1 no-border-right clickable"
                     @click="editingPopup.atClickEdit(character, [
                         ['Ideals', 'detailIdeals', character.detailIdeals, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="ideal in character.detailIdeals.split('\n')">
                      {{ ideal }}
                    </p>
                  </div>
                  <p>Ideals</p>
                </div>
                <div class="container block value-display col flex-1 no-border-right clickable"
                     @click="editingPopup.atClickEdit(character, [
                         ['Bonds', 'detailBonds', character.detailBonds, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="bond in character.detailBonds.split('\n')">
                      {{ bond }}
                    </p>
                  </div>
                  <p>Bonds</p>
                </div>

                <div class="container block value-display col flex-1 no-border-right clickable"
                     @click="editingPopup.atClickEdit(character, [
                         ['Flaws', 'detailFlaws', character.detailFlaws, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="flaw in character.detailFlaws.split('\n')">
                      {{ flaw }}
                    </p>
                  </div>
                  <p>Flaws</p>
                </div>
              </div>
            </div>
            <div class="container row flex-1">
              <div class="container block value-display align-start col flex-1">
                <div class="container col clickable" @click="editingPopup.atClickEdit(character, 
                    [
                        ['Attacks', 'attacks', character.attacks, ModelTypes.weapon]
                    ]
                )">
                  <div class="container row">
                    <p class="flex-2">Weapon</p>
                    <p class="flex-1">Bonus</p>
                    <p class="flex-2">Damage/ type</p>
                    <p></p>
                  </div>
                  <div class="container row" v-for="row in character.attacks">
                    <p class="flex-2">{{ row.name }}</p>
                    <p class="flex-1">{{ formatScore(row.bonus) }}</p>
                    <p class="flex-2">{{ row.damage }} / {{ row.type }}</p>
                    <p @click.stop @click="()=>{
                      confirmModelData.confirmFunction = async ()=>{
                        character.attackRemove(row.name)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetConfirmModelData()
                      };
                      confirmModelData.open = true
                      confirmModelData.item = `${row.name} attack`
                      confirmModelData.question = 'Are you sure you want to delete this attack?'
                    }" v-html="ICONS.REMOVE.MEDIUM"></p>
                  </div>
                  <div class="container row clickable" @click.stop @click="async () => {
                      character.attackAdd('Name', 0, 'Damage', 'Type')
                      await firebaseHandler.setCharacterData(character.objectData)
                    }">
                    <p class="flex-1" style="text-align: center">--Add a new attack--</p>
                    <p v-html="ICONS.ADD.MEDIUM"></p>
                  </div>
                </div>

                <br/>
                <p>Cantrips</p>
                <p v-for="row in character.spellcastingCantrips">
                  - {{ row }}
                  <!--                  <span class="clickable" v-html="ICONS.INFO.SMALL" @click="() => {-->
                  <!--                      console.log('info', row)-->
                  <!--                    }"/>-->
                </p>
                <br/>
                <p>Spells</p>
                <div :style="{'display: none': spells.prepared.length > 0}" style="width: 100%"
                     v-for="(spells, lvl) in character.spellcastingSpells">
                  <div class="container row" v-if="spells.prepared.length > 0">
                    <p>- Level {{ lvl }}</p>
                    <p class="flex-1"></p>
                    <p>{{ spells.spellSlots - spells.spellSlotsExpanded }} Slots remaining
                      <span @click="async ()=>{
                      character.spellcastingSpellSlotsExpanded_set(lvl, spells.spellSlotsExpanded + 1)
                      await firebaseHandler.setCharacterData(character.objectData)
                    }" class="clickable">—</span>
                    </p>
                  </div>

                  <p v-if="spells.prepared.length > 0" v-for="spell in spells.prepared">
                    {{ SPACE_CHAR.repeat(3) }}- {{ spell }}
                  </p>
                  <p v-if="spells.prepared.length > 0"></p>
                </div>
                <p class="align-center">Attacks & Spellcasting</p>
              </div>
              <div class="container value-display align-start block no-border-right col flex-1">
                <div class="flex-1" style="width: 100%">
                  <div class="container row flex-1" v-for="(feature) in character.features">
                    <div class="flex-1 clickable container col" @click="editingPopup.atClickEdit(character, [
                       ['Feature or Trait', `features.${feature.name}.name`, feature.name, ModelTypes.text],
                       ['Description', `features.${feature.name}.description`, feature.description, ModelTypes.textarea],
                    ])">
                      <p>
                        - {{ feature.name }}
                        <span v-if="feature.description" class="clickable" v-html="ICONS.INFO.SMALL" @click.stop
                              @click="() => {
                                toolTipModel.open = true
                                toolTipModel.name = feature.name
                                toolTipModel.description = feature.description
                              }"/>
                      </p>
                    </div>
                    <p class="clickable" @click="()=>{
                      confirmModelData.confirmFunction = async ()=>{
                        // console.log('REMOVE', feature)
                        character.featureRemove(feature.name)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetConfirmModelData()
                      };
                      confirmModelData.open = true
                      confirmModelData.item = feature.name
                      confirmModelData.question = 'Are you sure you want to delete this feature or trait?'
                    }" v-html="ICONS.REMOVE.MEDIUM"></p>
                  </div>
                  <div class="container row flex-1 clickable" @click="()=>{
                      character.featureAdd('New feature or trait', 'this is what the feature or trait does')
                      firebaseHandler.setCharacterData(character.objectData)
                    }">
                    <p class="flex-1">--Add a feature or trait--</p>
                    <p v-html="ICONS.ADD.MEDIUM"></p>
                  </div>
                </div>
                <p class="align-center">Features & Traits</p>
              </div>
            </div>
          </div>

        </div>
        <div class="container row flex-1">

          <div class="container col flex-1">
            <div class="container flex-1 block col value-display no-border-left no-border-bottom">
              <div class="container col flex-1">
                <div class="flex-1" style="width: 100%">
                  <p>Languages</p>
                  <div class="container row flex-1" v-for="(language, index) in character.languages">
                    <p class="flex-1 clickable" @click="editingPopup.atClickEdit(character, [
                        ['Languages', `_character.languages.${index}`, language, ModelTypes.text]
                    ])">
                      - {{ language }}
                    </p>
                    <p class="clickable" @click="()=>{
                        confirmModelData.confirmFunction = async ()=>{
                          character.languageRemove(language)
                          await firebaseHandler.setCharacterData(character.objectData)
                          resetConfirmModelData()
                        };
                        confirmModelData.open = true
                        confirmModelData.item = language
                        confirmModelData.question = 'Are you sure you want to delete this language?'
                      }" v-html="ICONS.REMOVE.MEDIUM"></p>
                  </div>
                  <div class="container row flex-1 clickable" @click="async () => {
                          character.languageAdd('New Language')
                          await firebaseHandler.setCharacterData(character.objectData)
                        }">
                    <p class="flex-1">--add a new language--</p>
                    <p v-html="ICONS.ADD.MEDIUM"></p>
                  </div>
                  <br/>
                  <p>Proficiencies</p>
                  <div v-for="(items, category) in character.proficiencies">
                    <p v-if="items.length > 0 || category==='items'">{{ category }}</p>
                    <div v-if="category==='items'" class="container row flex-1" v-for="(proficiency, index) in items">
                      <p class="flex-1 clickable" @click="editingPopup.atClickEdit(character, [
                          ['Proficiencies', `_character.abilities.proficiencies.${category}.${character._character.abilities.proficiencies[category].indexOf(proficiency)}`, proficiency, ModelTypes.text]
                        ])">
                        - {{ proficiency }}
                      </p>
                      <p class="clickable" @click="()=>{
                        confirmModelData.confirmFunction = async ()=>{
                          character.proficiencyRemove(category, proficiency)
                          await firebaseHandler.setCharacterData(character.objectData)
                          resetConfirmModelData()
                        };
                        confirmModelData.open = true
                        confirmModelData.item = proficiency
                        confirmModelData.question = 'Are you sure you want to delete this proficiency?'
                      }" v-html="ICONS.REMOVE.MEDIUM"></p>
                    </div>
                    <div v-if="category==='items'" class="container row flex-1 clickable" @click="()=>{
                        character.proficiencyAdd(category, 'New item proficiency')
                        firebaseHandler.setCharacterData(character.objectData)
                      }">
                      <p class="flex-1">--Add a proficiency--</p>
                      <p v-html="ICONS.ADD.MEDIUM"></p>
                    </div>
                    <p v-if="items.length > 0 && category!=='items'" v-for="proficiency in items">
                      - {{ proficiency }}
                    </p>
                    <br v-if="items.length > 0 || category==='items'"/>
                  </div>
                </div>
                <p class="align-center">Languages & Other Proficiencies</p>
              </div>
            </div>
          </div>
          <div class="container col flex-2">
            <div class="container flex-1 block col value-display no-border-right no-border-bottom">
              <div class="container row flex-1">
                <div class="container col flex-1 clickable" @click="editingPopup.atClickEdit(character, [
                  ['Coins', 'equipmentCoins', character.equipmentCoins, ModelTypes.coins],
              ])">
                  <div class="container col block value-display no-border"
                       v-for="(value, type) in character.equipmentCoinFormatted">
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
                      <div class="flex-2"></div>
                      <div class="flex-2">
                        Count
                      </div>
                      <div class="flex-8">
                        Name
                      </div>
                      <div class="flex-4">
                        Weight
                      </div>
                    </div>
                    <div v-for="item in character.equipmentItems" class="equipment-item container row clickable"
                         @click="editingPopup.atClickEdit(character, [
                      ['Position', `tag-equipment.${item.name}.index`, item.index, ModelTypes.number],
                      ['Amount', `tag-equipment.${item.name}.count`, item.count, ModelTypes.number],
                      ['Name', `tag-equipment.${item.name}.name`, item.name, ModelTypes.text],
                      ['Weight', `tag-equipment.${item.name}.weight`, item.weight, ModelTypes.number],
                      [ 'Description', `tag-equipment.${item.name}.description`, item.description, ModelTypes.textarea],
                  ])">
                      <div class="flex-2"></div>
                      <div class="flex-2">
                        {{ item.count }}
                      </div>
                      <div class="flex-8">
                        {{ item.name }}
                        <span v-if="item.description" class="clickable" v-html="ICONS.INFO.SMALL" @click.stop
                              @click="() => {
                                toolTipModel.open = true
                                toolTipModel.name = item.name
                                toolTipModel.description = item.description
                              }"/>
                      </div>
                      <div class="flex-4">
                        {{ formatWeight(item.weight * item.count) }}
                      </div>
                      <div class="clickable" @click.stop @click="() =>{
                      confirmModelData.confirmFunction = async ()=>{
                        character.equipmentRemove(item.name, item.count)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetConfirmModelData()
                      };
                      confirmModelData.open = true
                      confirmModelData.item = `${item.count} ${item.name}`
                      confirmModelData.question = 'Are you sure you want to delete this item?'
                    }" v-html="ICONS.REMOVE.MEDIUM"></div>
                    </div>
                    <div class="equipment-item container row clickable" @click="async () => {
                      character.equipmentAdd('new item', 1, 0)
                      await firebaseHandler.setCharacterData(character.objectData)
                    }">
                      <div class="flex-2"></div>
                      <div class="flex-2"></div>
                      <div class="flex-8">--Add a new item--</div>
                      <div class="flex-4"></div>
                      <div v-html="ICONS.ADD.MEDIUM"></div>
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
    </div>
    <div class="page container col" id="page-2"> <!-- Page 2 -->
      <div class="header container row"> <!-- Header -->
        <div class="container col flex-1"> <!-- Left Column -->
          <div class="container value-display col block flex-1 no-border-top no-border-left clickable"
               @click="editingPopup.atClickEdit(character, [['Character Name', 'detailName', character.detailName, ModelTypes.text]])">
            <p class="flex-1 value medium no-transform">{{ character.detailName }}</p>
            <p>Character Name</p>
          </div>
        </div>
        <div class="container col flex-2"> <!-- Right Column -->
          <div class="container row">
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="editingPopup.atClickEdit(character, [['Character Age in years', 'detailAge', character.detailAge, ModelTypes.number]])">
              <p class="flex-1 value medium no-transform">{{ character.detailAge }}</p>
              <p>Age</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="editingPopup.atClickEdit(character, [['Character Height in foot', 'detailHeight', character.detailHeight, ModelTypes.number]])">
              <p class="flex-1 value medium no-transform">{{ formatLength(character.detailHeight) }}</p>
              <p>Height</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top no-border-right clickable"
                 @click="editingPopup.atClickEdit(character, [['Character Weight in pounds', 'detailWeight', character.detailWeight, ModelTypes.number]])">
              <p class="flex-1 value medium no-transform">{{ formatWeight(character.detailWeight) }}</p>
              <p>Weight</p>
            </div>
          </div>
          <div class="container row">
            <div class="container block value-display col flex-1 clickable"
                 @click="editingPopup.atClickEdit(character, [['Character Eyes', 'detailEyeColor', character.detailEyeColor, ModelTypes.text]])">
              <p class="flex-1 value medium no-transform">{{ character.detailEyeColor }}</p>
              <p>Eyes</p>
            </div>
            <div class="container block value-display col flex-1 clickable"
                 @click="editingPopup.atClickEdit(character, [['Character Skin', 'detailSkinColor', character.detailSkinColor, ModelTypes.text]])">
              <p class="flex-1 value medium no-transform">{{ character.detailSkinColor }}</p>
              <p>Skin</p>
            </div>
            <div class="container block value-display col flex-1 no-border-right clickable"
                 @click="editingPopup.atClickEdit(character, [['Character Hair', 'detailHairColor', character.detailHairColor, ModelTypes.text]])">
              <p class="flex-1 value medium no-transform">{{ character.detailHairColor }}</p>
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
                   :src="characterImage" class="character-appearance clickable" alt="Character Appearance"
                   @click="showImageModel = true"
              />
            </div>
            <div v-if="!characterImage">
              <input type="file" accept="image/*" @change=uploadImage>
            </div>
            <p>Character Appearance</p>
          </div>
          <div class="container block value-display col flex-2 no-border-left no-border-bottom clickable"
               @click="editingPopup.atClickEdit(character, [['Character Backstory', 'detailBackstory', character.detailBackstory, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.detailBackstory.split('\n')">
                {{ line }}
              </p>
            </div>
            <p>Character Backstory</p>
          </div>
        </div>
        <div class="container col flex-2">
          <div class="container block value-display align-start col flex-1 no-border-right clickable"
               @click="editingPopup.atClickEdit(character, [['Important Notes', 'notes', character.notes, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.notes.split('\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Important Notes</p>
          </div>
          <div class="container block value-display align-start col flex-1 no-border-right clickable"
               @click="editingPopup.atClickEdit(character, [['Allies & Organizations', 'detailAllies', character.detailAllies, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.detailAllies.split('\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Allies & Organizations</p>
          </div>
          <div class="container block value-display align-start col flex-1 no-border-right clickable"
               @click="editingPopup.atClickEdit(character, [['Additional Features & Traits', 'featureAdditional', character.featureAdditional, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.featureAdditional.split('\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Additional Features & Traits</p>
          </div>
          <div class="container block value-display align-start col flex-1 no-border-right no-border-bottom clickable"
               @click="editingPopup.atClickEdit(character, [['Treasure', 'detailTreasure', character.detailTreasure, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="flex-1 no-transform" v-for="line in character.detailTreasure.split('\n')">
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

            <div class="container row flex-1">
              <div class="container value-display col block flex-1 no-border-top no-border-left clickable"
                   @click="editingPopup.atClickEdit(character, [
                     ['Spellcasting Class', 'spellcastingClass', character.spellcastingClass, ModelTypes.classes]
                     ])">
                <p class="flex-1 value medium no-transform">{{ character.spellcastingClass }}</p>
                <p>Spellcasting Class</p>
              </div>
            </div>
            <div class="container row flex-2">
              <div class="container block value-display col flex-1 no-border-top clickable"
                   @click="editingPopup.atClickEdit(character, [['Spellcasting Ability', 'spellcastingAbility', character.spellcastingAbility, ModelTypes.abilityTypes]])">
                <p class="flex-1 value medium no-transform" style="text-transform: capitalize">
                  {{ character.spellcastingAbility }}</p>
                <p>Spellcasting Ability</p>
              </div>
              <div class="container block value-display col flex-1 no-border-top">
                <p class="flex-1 value medium no-transform">{{ character.spellcastingSpellSaveDc }}</p>
                <p>Spell Save DC</p>
              </div>
              <div class="container block value-display col flex-1 no-border-top no-border-right">
                <p class="flex-1 value medium no-transform">{{ formatScore(character.spellcastingAttackBonus) }}</p>
                <p>Spell Attack Bonus</p>
              </div>
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
                <div class="value flex-1" @click="editingPopup.atClickEdit(character, [
                  ['Spell Slots', `_character.spellcasting.spells.${j}.spellSlots`, character.spellcastingSpellSlots_get(j), ModelTypes.number],
                ])">
                  <p>{{ character.spellcastingSpellSlots_get(j) }}</p>
                </div>
                <div class="label flex-2" @click="editingPopup.atClickEdit(character, [
                  ['Spell Slots', `_character.spellcasting.spells.${j}.spellSlots`, character.spellcastingSpellSlots_get(j), ModelTypes.number],
              ])">
                  <p>Total</p>
                </div>
                <div class="value flex-1" @click="editingPopup.atClickEdit(character, [
                  ['Spell Slots Expanded', `_character.spellcasting.spells.${j}.spellSlotsExpanded`, character.spellcastingSpellSlotsExpanded_get(j), ModelTypes.number],
                ])">
                  <p>{{ character.spellcastingSpellSlotsExpanded_get(j) }}</p>
                </div>
                <div class="label flex-2" @click.stop @click="editingPopup.atClickEdit(character, [
                  ['Spell Slots Expanded', `_character.spellcasting.spells.${j}.spellSlotsExpanded`, character.spellcastingSpellSlotsExpanded_get(j), ModelTypes.number],
                ])">
                  <p>Expanded</p>
                </div>
              </div>
            </div>
            <div v-if="j===0" class="container row">
              <p class="flex-3">Cantrip Name</p>
            </div>
            <div v-else class="container row">
              <div class="flex-1">
                <p style="text-align: center">Prepared</p>
              </div>
              <p class="flex-3">Spell Name</p>
            </div>

            <div class="container col block no-border">
              <div v-if="j===0" v-for="(cantrip, index) in character.spellcastingCantrips"
                   class="container row clickable" @click="editingPopup.atClickEdit(character, [
                  [`Cantrip`, `_character.spellcasting.cantrips.${index}`, character.spellcastingCantrips[index], ModelTypes.text]
              ])">
                <p class="flex-1">{{ cantrip }}</p>
                <p @click.stop @click="() =>{
                  confirmModelData.confirmFunction = async ()=>{
                    character.spellcastingCantripRemove(cantrip)
                    await firebaseHandler.setCharacterData(character.objectData)
                    resetConfirmModelData()
                  };
                  confirmModelData.open = true
                  confirmModelData.item = cantrip
                  confirmModelData.question = 'Are you sure you want to delete this cantrip?'
                }" v-html="ICONS.REMOVE.MEDIUM"></p>
              </div>
              <div v-else v-for="(spell, index) in character.spellcastingSpells[j].known"
                   class="container row clickable" @click="editingPopup.atClickEdit(character, [
                  [`Spell`, `_character.spellcasting.spells.${j}.known.${index}`, spell, ModelTypes.text]
              ])">
                <div class="flex-1 container row" style="justify-content: center">
                  <div class="check"
                       :class="{selected:character.spellcastingSpells[j].prepared.includes(spell)}"
                       @click.stop @click="atClickPrepared(j, spell)"
                  ></div>
                </div>
                <p class="flex-3">{{ spell }}</p>
                <p @click.stop @click="() =>{
                  confirmModelData.confirmFunction = async ()=>{
                    character.spellcastingRemove(j, spell)
                    await firebaseHandler.setCharacterData(character.objectData)
                    resetConfirmModelData()
                  };
                  confirmModelData.open = true
                  confirmModelData.item = spell
                  confirmModelData.question = 'Are you sure you want to delete this spell?'
                }" v-html="ICONS.REMOVE.MEDIUM"></p>
              </div>
            </div>
            <div class="container col block no-border">
              <div v-if="j===0" class="clickable container row" @click.stop @click="()=>{
                character.spellcastingCantripAdd('New cantrip')
                firebaseHandler.setCharacterData(character.objectData)
              }">
                <p class="flex-1">--Add a cantrip--</p>
                <p v-html="ICONS.ADD.MEDIUM"></p>
              </div>
              <div v-if="j!==0" class="clickable container row" @click.stop @click="()=>{
                character.spellcastingAdd(j, 'New Spell')
                firebaseHandler.setCharacterData(character.objectData)
              }">
                <p class="flex-1">--Add a spell--</p>
                <p v-html="ICONS.ADD.MEDIUM"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  MODALS  -->

  <div v-if="editingPopup.editing.open" class="popup container col" style="align-items: center"
       @click="editingPopup.atClickCancel">
    <div class="container row popup-display">
      <div class="container block value-display col" @click.stop>

        <div class="container row input-row" v-for="item in editingPopup.editing.items">
          <div class="container col">
            <label :for="item.name">{{ item.name }}</label>
            <input v-if="item.type.element === 'input' && item.type.type !== 'disabled'"
                   :type="item.type.type !== 'coin' ? item.type.type : 'number'"
                   :name="item.name"
                   v-model="item.value"
                   @keydown.enter="editingPopup.atClickSave"
                   @keydown.esc="editingPopup.atClickCancel"/>
            <input v-if="item.type.element === 'input' && item.type.type === 'disabled'"
                   type="text"
                   disabled
                   :name="item.name"
                   :value="item.value"/>
            <textarea
                v-if="item.type.element === 'textarea'"
                :name="item.name"
                rows="5" cols="40"
                v-model="item.value"
                @keydown.esc="editingPopup.atClickCancel"/>
            <select v-if="item.type.element === 'select'" :name="item.name" v-model="item.value">
              <option v-for="option in item.type.options" :value="option">
                {{ option[0].toUpperCase() + option.slice(1) }}
              </option>
            </select>
            <select v-if="item.type.element === 'dice'" :name="item.name" v-model="item.value">
              <option v-for="option in item.type.options" :value="option">
                D{{ option }}
              </option>
            </select>
            <div v-if="item.type.element === 'weapon'">
              <div class="container row" v-for="row in item.value">
                <input type="number" v-model="row.index" placeholder="Position">
                <input type="text" v-model="row.name" placeholder="Name">
                <input type="number" v-model="row.bonus" placeholder="Bonus">
                <input type="text" v-model="row.damage" placeholder="Damage">
                <input type="text" v-model="row.type" placeholder="Type">
              </div>
            </div>
            <div v-if="item.type.element === 'coins'">
              <div class="container row">
                <p>Copper:
                  <input type="number" name="copper"
                         v-model="item.value.copper"
                         @keydown.enter="editingPopup.atClickSave"
                         @keydown.esc="editingPopup.atClickCancel"/>
                </p>
                <p>Silver:
                  <input type="number" name="silver"
                         v-model="item.value.silver"
                         @keydown.enter="editingPopup.atClickSave"
                         @keydown.esc="editingPopup.atClickCancel"/>
                </p>
                <p>Electrum:
                  <input type="number" name="electrum"
                         v-model="item.value.electrum"
                         @keydown.enter="editingPopup.atClickSave"
                         @keydown.esc="editingPopup.atClickCancel"/>
                </p>
                <p>Gold:
                  <input type="number" name="gold"
                         v-model="item.value.gold"
                         @keydown.enter="editingPopup.atClickSave"
                         @keydown.esc="editingPopup.atClickCancel"/>
                </p>
                <p>Platinum:
                  <input type="number" name="platinum"
                         v-model="item.value.platinum"
                         @keydown.enter="editingPopup.atClickSave"
                         @keydown.esc="editingPopup.atClickCancel"/>
                </p>
              </div>
              <div class="cointainer row">
                <p>
<!--                  TODO: FORMAT-->
                  Coin	        CP      SP	    EP	    GP	    PP
                  Copper Piece    1       1/10    1/50    1/100	1/1,000
                  Silver Piece    10      1       1/5	    1/10    1/100
                  Electrum Piece  50      5       1       1/2     1/20
                  Gold Piece      100     10      2       1       1/10
                  Platinum Piece  1,000   100     20      10      1
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="container row button-row">
          <button @click="editingPopup.atClickSave">Save</button>
          <button @click="editingPopup.atClickCancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showImageModel" class="popup container col" style="align-items: center" @click="showImageModel=false">
    <div class="container row popup-display">
      <div class="container block value-display col" @click.stop>
        <div class="container row input-row">
          <div class="container col">
            <label for="characterImage">Character Appearance</label>
            <input type="file" accept="image/*" name="Character Appearance" id="characterImage" @change="uploadImage">
          </div>
        </div>
        <div class="container row button-row">
          <button @click="showImageModel=false">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="confirmModelData.open" class="popup container col" style="align-items: center"
       @click="resetConfirmModelData">
    <div class="container row popup-display">
      <div class="container block value-display col" @click.stop>
        <div class="container row input-row">
          <div class="container col">
            <p>{{ confirmModelData.question }}</p>
            <p>{{ confirmModelData.item }}</p>
          </div>
        </div>
        <div class="container row button-row">
          <button @click="confirmModelData.confirmFunction">Confirm</button>
          <button @click="resetConfirmModelData">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="toolTipModel.open" class="popup container col" style="align-items: center" @click="()=>{
            toolTipModel.open = false
            toolTipModel.name = undefined
            toolTipModel.description = undefined
          }">
    <div class="container row popup-display">
      <div class="container block value-display col" @click.stop>
        <div class="container row input-row">
          <div class="container col">
            <h2>{{ toolTipModel.name }}</h2>
            <textarea id="tooltip" readonly :value="toolTipModel.description"></textarea>
          </div>
        </div>
        <div class="container row button-row">
          <button @click="()=>{
            toolTipModel.open = false
            toolTipModel.name = undefined
            toolTipModel.description = undefined
          }">Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

@import '@/styles/mixins/space_childeren.scss';

.page {
  margin-bottom: 2rem;
  min-height: 100vh;

  &#quick-actions {
    min-height: 5rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

#quick-actions .container {
  width: auto;
}

#quick-actions .block.value-display {
  margin: .5rem 1rem;
  padding: .5rem 1rem;
  transition: background-color 0.25s ease;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background: var(--color-background-mute);
  }
}

#page-3 .labeled-row .value p {
  height: auto;
}


.ability-block {
  align-items: center;
  text-transform: uppercase;

  .container.ability {
    align-items: center;

    .ability-modifier {
      background-color: var(--color-border);
      border-radius: 999999px;
      width: 50%;
      text-align: center;
    }

    .ability-score {

      .ability-score-value {
        text-align: center;
        font-size: 200%;
      }

      .ability-score-label {
        text-align: center;
        font-size: 70%;
      }
    }
  }

  .container.skill {
    background: var(--color-background-soft);
    border-radius: 1.5rem;
    align-items: center;
    align-self: start;

    .skill-row {
      display: flex;
      padding: .25rem 1rem;
      align-items: center;
      width: 100%;

      @include space-children;

      .proficient {
        width: 1rem;
        height: 1rem;
        background-color: var(--color-border);
        border-radius: 999999px;

        &.selected {
          background: var(--color-filler);
        }
      }

      .skill-score {
        font-size: 50%;

      }

      .skill-name {
        font-size: 50%;
      }
    }
  }
}

.equipment-item {
  font-size: 70%;
  text-transform: none;

  @include space-children;
}

.death-saves {
  padding: .25rem;

  .label {
    text-transform: uppercase;
    font-size: 70%;

  }
}

.checks {
  @include space-children(0.25rem);
}

.check {
  width: 1rem;
  height: 1rem;
  background-color: var(--color-border);
  border-radius: 999999px;

  &.selected {
    background: var(--color-filler);
  }
}

.character-appearance {
  max-width: 100%;
}

/* Modern browsers with `scrollbar-*` support */
@supports (scrollbar-width: auto) {
  #tooltip {
    scrollbar-color: var(--color-filler) transparent;
    scrollbar-width: thin;
  }
}

#tooltip {
  width: 100%;
  height: 15rem;
  padding: .5rem;
  background: none;
  border: none;
  color: var(--color-text);
  resize: none;
  --scrollbar-color-track: #0000ff;
  --scrollbar-color-thumb: #ff69b4;

  &:focus-visible {
    outline: none;
  }
}
</style>