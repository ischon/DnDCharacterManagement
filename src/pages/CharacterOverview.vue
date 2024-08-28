<script setup>
import router from "@/router.js";

import {onBeforeMount, ref, reactive, watch} from 'vue'
import {FirebaseHandler} from "@/helpers/firebase.js";
import {range} from 'lodash';

import {classes, alignments, abilityTypes, proficiencyTypes, abilities, dice, Character} from "@/models/Character.js";
import {exampleCharacter} from "@/models/Examples.js";

// setup() {
const loading = reactive({
  character: true,
  image: true
})
const editing = reactive({
  open: false,
  items: []
})

const showImageModel = ref(false)
const deleteModelData = reactive({
  open: false,
  item: undefined,
  deleteFunction: undefined,
  question: undefined
})

const ICON_ADD = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\" style=\"fill: var(--color-text); height: var(--font-size); width: var(--font-size);\"><path d=\"M640-121v-120H520v-80h120v-120h80v120h120v80H720v120h-80ZM120-240v-80h80v80h-80Zm160 0v-80h163q-3 21-2.5 40t3.5 40H280ZM120-400v-80h80v80h-80Zm160 0v-80h266q-23 16-41.5 36T472-400H280ZM120-560v-80h80v80h-80Zm160 0v-80h480v80H280ZM120-720v-80h80v80h-80Zm160 0v-80h480v80H280Z\"/></svg>"
const ICON_REMOVE = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\" style=\"fill: var(--color-text); height: var(--font-size); width: var(--font-size)\"><path d=\"M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z\"/></svg>"

const resetDeleteModelData = () => {
  deleteModelData.open = false
  deleteModelData.item = undefined
  deleteModelData.deleteFunction = undefined
  deleteModelData.question = undefined
}

class ModelTypes {
  static disabled = new ModelTypes('disabled', 'input')
  // static color = new ModelTypes('color', 'input')
  // static date = new ModelTypes('date', 'input')
  // static file = new ModelTypes('file', 'input')
  // static image = new ModelTypes('image', 'input')
  static number = new ModelTypes('number', 'input')
  static checkbox = new ModelTypes('checkbox', 'input')
  static text = new ModelTypes('text', 'input')
  static textarea = new ModelTypes('textarea', 'textarea')
  static classes = new ModelTypes('classes', 'select', classes)
  static alignments = new ModelTypes('alignments', 'select', alignments)
  static abilityTypes = new ModelTypes('abilityTypes', 'select', abilityTypes)
  static proficiencyTypes = new ModelTypes('proficiencyTypes', 'select', proficiencyTypes)
  static abilities = new ModelTypes('abilities', 'select', abilities)
  static die = new ModelTypes('dice', 'dice', dice)
  static weapon = new ModelTypes('weapon', 'weapon')
  static coins = new ModelTypes('coins', 'coins')

  constructor(type, element, options = undefined) {
    this.type = type;
    this.element = element;
    this.options = options;
  }
}

const characterId = router.currentRoute.value.params.id
const firebaseHandler = new FirebaseHandler()
let character = undefined

const characterImage = ref(undefined)

watch(
    () => router.currentRoute.value.params.id,
    async () => {
      window.location.reload();
    }
);

const atClickEdit = (items) => {
  editing.open = true
  items.forEach((item) => {
    editing.items.push({
      name: item[0],
      key: item[1],
      value: item[2],
      type: item[3]
    })
  })
}

const atClickProficiency = (ability_name, skill_name) => {
  character.toggleProficiency(ability_name, skill_name);
  firebaseHandler.setCharacterData(character.objectData);
}
const atClickPrepared = (spell_lvl, spell_name) => {
  character.togglePrepared(spell_lvl, spell_name);
  firebaseHandler.setCharacterData(character.objectData);
}

const resetModelData = () => {
  editing.open = false;
  editing.items = []
}

const saveWithReflect = (base, path, value) => {
  if (path.includes('.')) {
    const [head, ...tail] = path.split('.')
    saveWithReflect(base[head], tail.join('.'), value)
  } else {
    Reflect.set(base, path, value)
  }
}

const atClickSave = async () => {
  if (editing.items[0].key.includes('equipment')) {
    const item = {
      key: editing.items[0].key.split('.')[1],
      name: undefined,
      count: undefined,
      weight: undefined,
      index: undefined
    }
    editing.items.forEach((i) => {
      item[i.key.split('.')[2]] = i.value
    });

    character.updateEquipment(item.key, item.name, item.count, item.weight, item.index)
  } else if (editing.items[0].key.includes('attacks')) {
    Object.entries(editing.items[0].value).forEach((attack) => {
      character.updateAttack(attack[0], attack[1])
    });


  } else {
    editing.items.forEach((item) => {
      saveWithReflect(character, item.key, item.value)
    });
  }

  await firebaseHandler.setCharacterData(character.objectData)
  resetModelData()
}

const atClickCancel = () => {
  resetModelData()
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

const formatScore = (score) => {
  return score !== 0 ? ((score > 0) ? '+' : '') + score : '-'
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
  firebaseHandler.getCharacterData(characterId).then((data) => {
    character = reactive(data)
    loading.character = false
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
    <div class="page container col" id="page-1"> <!-- Page 1 -->
      <div class="header container row flex-1"> <!-- Header -->
        <div class="container col flex-1"> <!-- Left Column -->
          <div class="container value-display col block flex-1 no-border-top no-border-left clickable"
               @click="atClickEdit([['Character Name', 'name', character.name, ModelTypes.text]])">
            <p class="flex-1 value medium no-transform">{{ character.name }}</p>
            <p>Character Name</p>
          </div>
        </div>
        <div class="container col flex-2"> <!-- Right Column -->
          <div class="container row">
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="atClickEdit([
                     ['Class', 'class', character.class, ModelTypes.classes],
                     ['Level', 'level', character.level, ModelTypes.number]
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.class }} lvl {{ character.level }}</p>
              <p>Class & Level</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="atClickEdit([
                     ['Background', 'background', character.background, ModelTypes.text],
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.background }}</p>
              <p>Background</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top no-border-right">
              <p class="flex-1 value medium no-transform">{{ firebaseHandler.firebaseUser.displayName }}</p>
              <p>Player Name</p>
            </div>
          </div>
          <div class="container row">
            <div class="container block value-display col flex-1 clickable"
                 @click="atClickEdit([
                     ['Race', 'race', character.race, ModelTypes.text],
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.race }}</p>
              <p>Race</p>
            </div>
            <div class="container block value-display col flex-1 clickable"
                 @click="atClickEdit([
                     ['Alignment', 'alignment', character.alignment, ModelTypes.alignments],
                     ])">
              <p class="flex-1 value medium no-transform">{{ character.alignment }}</p>
              <p>Alignment</p>
            </div>
            <div class="container block value-display col flex-1 no-border-right clickable"
                 @click="atClickEdit([
                     ['Experience points', 'experiencePoints', character.experiencePoints, ModelTypes.number],
                     ])">
              <p class="flex-1 value medium no-transform">
                {{ character.experiencePoints !== 0 ? character.experiencePoints : '-' }}</p>
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
              <div class="value flex-1"><p>{{ formatScore(character.proficiencyBonus) }}</p></div>
              <div class="label flex-2"><p>Proficiency Bonus</p></div>
            </div>
            <div class="container flex-1 block row labeled-row no-border-left clickable"
                 @click="atClickEdit([
                      ['Inspiration', 'inspiration', character.inspiration, ModelTypes.number],
                 ])">
              <div class="value flex-1"><p>{{ formatScore(character.inspiration) }}</p></div>
              <div class="label flex-2"><p>Inspiration</p></div>
            </div>
            <div v-for="(ability, ability_name) in character.abilities"
                 class="container row flex-2 block ability-block no-border-left">
              <!--ABILITY-->
              <div class="container ability col flex-1 clickable"
                   @click="atClickEdit([
                      [ability_name, ability_name, ability.score, ModelTypes.number],
                 ])">
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
                  <div class="proficient clickable" :class="{ selected: skill_stats.proficient }"
                       @click="atClickProficiency(ability_name, skill_name)"></div>
                  <div class="skill-score">{{ formatScore(skill_stats.value) }}</div>
                  <div class="skill-name">{{ skill_name }}</div>
                </div>
              </div>
            </div>
            <div class="container flex-1 block row labeled-row  no-border-left">
              <div class="value flex-1"><p>{{ formatScore(character.passivePerception) }}</p></div>
              <div class="label flex-2"><p>Passive Wisdom (Perception)</p></div>
            </div>
          </div>
          <div class="container col flex-2">
            <div class="container row flex-1">
              <div class="container col flex-1">
                <!--STATS-->
                <div class="container row flex-1">
                  <div class="container block value-display col flex-1 clickable"
                       @click="atClickEdit([
                          ['Armor class basis', 'armorClassBase', character.armorClassBase, ModelTypes.number],
                          [`Uses dexterity modifier (${formatScore(character.dexterityModifier)})`, 'armorClassHasDexModifier', character.armorClassHasDexModifier, ModelTypes.checkbox],
                          ['Added protection from a shield', 'armorClassShield', character.armorClassShield, ModelTypes.number],
                          ['Additional modifier', 'armorClassMisc', character.armorClassMisc, ModelTypes.number]
                       ])">
                    <p class="flex-1 value">{{ character.armorClass }}</p>
                    <p>Armor Class</p>
                  </div>
                  <div class="container block value-display col flex-1 clickable"
                       @click="atClickEdit([
                          ['Dexterity modifier', 'dexterityModifier', character.dexterityModifier, ModelTypes.disabled],
                          [`Additional modifier`, 'initiativeMisc', character.initiativeMisc, ModelTypes.number],
                       ])">
                    <p class="flex-1 value">{{ formatScore(character.initiativeModifier) }}</p>
                    <p>Initiative</p>
                  </div>
                  <div class="container block value-display col flex-1 clickable"
                       @click="atClickEdit([
                          ['Speed', 'speed', character.speed, ModelTypes.number],
                       ])">
                    <p class="flex-1 value">{{ character.speed }}</p>
                    <p>Speed</p>
                  </div>
                </div>
                <div class="container block value-display col flex-1 clickable"
                     @click="atClickEdit([
                          ['Hit points basis', 'baseHitPoints', character.baseHitPoints, ModelTypes.number],
                          ['constitution modifier', 'constitutionModifier', character.constitutionModifier, ModelTypes.disabled],
                          ['Additional hit points', 'hitPointsMisc', character.hitPointsMisc, ModelTypes.number],
                          [`Current hit points`, 'currentHitPoints', character.currentHitPoints, ModelTypes.number],
                       ])">
                  <p>Hit Point Maximum: {{ character.hitPointMaximum }}</p>
                  <p class="flex-1 value">{{ character.currentHitPoints }}</p>
                  <p>Current Hit Points</p>
                </div>
                <div class="container block value-display col flex-1 clickable"
                     @click="atClickEdit([
                          ['Temporary hit points', 'tempHitPoints', character.tempHitPoints, ModelTypes.number],
                       ])">
                  <p class="flex-1 value">{{ character.tempHitPoints !== 0 ? character.tempHitPoints : '-' }}</p>
                  <p>Temporary Hit Points</p>
                </div>
                <div class="container row flex-1">
                  <div class="container block value-display col flex-1 clickable"
                       @click="atClickEdit([
                          ['Hit Die', 'hitDice', character.hitDice, ModelTypes.die],
                          ['Usable hit Dice', 'currentAmountHitDice', character.currentAmountHitDice, ModelTypes.number],
                       ])">
                    <p>Total Hit Dice: {{ character.maxHitDice }}</p>
                    <p class="flex-1 value">{{ character.currentHitDice }}</p>
                    <p>Hit Dice</p>
                  </div>
                  <div class="container block value-display col flex-1 clickable"
                       @click="atClickEdit([
                         ['Successful rolls', 'deathSaveSuccesses', character.deathSaves.successes, ModelTypes.number],
                         ['Failed rolls', 'deathSaveFailures', character.deathSaves.failures, ModelTypes.number],
                  ])">
                    <div class="container col flex-1 value">
                      <div class="container row death-saves">
                        <div class="label flex-2">successes</div>
                        <div class="checks flex-1 container row">
                          <div class="check" :class="{ selected: key < character.deathSaves.successes  }"
                               v-for="key in range(0,3)">
                          </div>
                        </div>
                      </div>
                      <div class="container row death-saves">
                        <div class="label flex-2">Failures</div>
                        <div class="checks flex-1 container row">
                          <div class="check" :class="{ selected: key < character.deathSaves.failures }"
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
                     @click="atClickEdit([
                         ['Traits', 'personalityTraits', character.personalityTraits, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="traits in character.personalityTraits.split('\n')">
                      {{ traits }}
                    </p>
                  </div>
                  <p>Personality Traits</p>
                </div>
                <div class="container block value-display col flex-1 no-border-right clickable"
                     @click="atClickEdit([
                         ['Ideals', 'ideals', character.ideals, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="ideals in character.ideals.split('\n')">
                      {{ ideals }}
                    </p>
                  </div>
                  <p>Ideals</p>
                </div>
                <div class="container block value-display col flex-1 no-border-right clickable"
                     @click="atClickEdit([
                         ['Bonds', 'bonds', character.bonds, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="bonds in character.bonds.split('\n')">
                      {{ bonds }}
                    </p>
                  </div>
                  <p>Bonds</p>
                </div>

                <div class="container block value-display col flex-1 no-border-right clickable"
                     @click="atClickEdit([
                         ['Flaws', 'flaws', character.flaws, ModelTypes.textarea],
                  ])">
                  <div class="flex-1">
                    <p class="no-transform" v-for="flaws in character.flaws.split('\n')">
                      {{ flaws }}
                    </p>
                  </div>
                  <p>Flaws</p>
                </div>
              </div>
            </div>
            <div class="container row flex-1">
              <div class="container block value-display align-start col flex-1">
                <div class="container col clickable" @click="atClickEdit(
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
                      deleteModelData.deleteFunction = async ()=>{
                        character.removeAttack(row.name)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetDeleteModelData()
                      };
                      deleteModelData.open = true
                      deleteModelData.item = `${row.name} attack`
                      deleteModelData.question = 'Are you sure you want to delete this attack?'
                    }" v-html="ICON_REMOVE"></p>
                  </div>
                  <div class="container row clickable" @click.stop @click="async () => {
                      character.addAttack('Name', 0, 'Damage', 'Type')
                      await firebaseHandler.setCharacterData(character.objectData)
                    }">
                    <p class="flex-1" style="text-align: center">--Add a new attack--</p>
                    <p v-html="ICON_ADD"></p>
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
                <div class="flex-1" style="width: 100%">
                  <div class="container row flex-1" v-for="(feature, index) in character.features">
                    <div class="flex-1 clickable container col" @click="atClickEdit([
                       ['Features & Traits', `_character.features.${index}`, feature, ModelTypes.textarea]
                    ])">
                      <p v-for="(feat, index) in feature.split('\n')">{{index===0? '- ':' ‎ ‎ ‎'}}{{ feat }}</p>
                    </div>
                    <p class="clickable" @click="()=>{
                      deleteModelData.deleteFunction = async ()=>{
                        character.removeFeature(feature)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetDeleteModelData()
                      };
                      deleteModelData.open = true
                      deleteModelData.item = feature
                      deleteModelData.question = 'Are you sure you want to delete this feature or trait?'
                    }" v-html="ICON_REMOVE"></p>
                  </div>
                  <div class="container row flex-1 clickable" @click="()=>{
                      character.addFeature('New feature or trait')
                      firebaseHandler.setCharacterData(character.objectData)
                    }">
                    <p class="flex-1">--Add a feature or trait--</p>
                    <p v-html="ICON_ADD"></p>
                  </div>
                </div>
                <p class="align-center">Features & Traits</p>
              </div>
            </div>
          </div>

        </div>
        <div class="container row flex-1">
          <div class="container block value-display col flex-1 no-border-left no-border-bottom">
            <div class="container col flex-1">
              <div class="flex-1" style="width: 100%">
                <p>Languages</p>
                <div class="container row flex-1" v-for="(language, index) in character.languages">
                  <p class="flex-1 clickable" @click="atClickEdit([
                      ['Languages', `_character.languages.${index}`, language, ModelTypes.text]
                  ])">
                    - {{ language }}
                  </p>
                  <p class="clickable" @click="()=>{
                      deleteModelData.deleteFunction = async ()=>{
                        character.removeLanguage(language)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetDeleteModelData()
                      };
                      deleteModelData.open = true
                      deleteModelData.item = language
                      deleteModelData.question = 'Are you sure you want to delete this language?'
                    }" v-html="ICON_REMOVE"></p>
                </div>
                <div class="container row flex-1 clickable" @click="async () => {
                        character.addLanguage('New Language')
                        await firebaseHandler.setCharacterData(character.objectData)
                      }">
                  <p class="flex-1">--add a new language--</p>
                  <p v-html="ICON_ADD"></p>
                </div>
                <br/>
                <p>Proficiencies</p>
                <div v-for="(items, category) in character.proficiencies">
                  <p v-if="items.length > 0 || category==='items'">{{ category }}</p>
                  <div v-if="category==='items'" class="container row flex-1" v-for="(proficiency, index) in items">
                    <p class="flex-1 clickable" @click="atClickEdit([
                        ['Proficiencies', `_character.abilities.proficiencies.${category}.${character._character.abilities.proficiencies[category].indexOf(proficiency)}`, proficiency, ModelTypes.text]
                      ])">
                      - {{ proficiency }}
                    </p>
                    <p class="clickable" @click="()=>{
                      deleteModelData.deleteFunction = async ()=>{
                        character.removeProficiency(category, proficiency)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetDeleteModelData()
                      };
                      deleteModelData.open = true
                      deleteModelData.item = proficiency
                      deleteModelData.question = 'Are you sure you want to delete this proficiency?'
                    }" v-html="ICON_REMOVE"></p>
                  </div>
                  <div v-if="category==='items'" class="container row flex-1 clickable" @click="()=>{
                      character.addProficiency(category, 'New item proficiency')
                      firebaseHandler.setCharacterData(character.objectData)
                    }">
                    <p class="flex-1">--Add a proficiency--</p>
                    <p v-html="ICON_ADD"></p>
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
          <div class="container block value-display col flex-2 no-border-right no-border-bottom">
            <div class="container row">
              <div class="container col flex-1 clickable" @click="atClickEdit([
                  ['Copper Coins', '_character.coins', character._character.coins, ModelTypes.coins],
              ])">
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
                  <div v-for="item in character.equipment" class="equipment-item container row clickable" @click="atClickEdit([
                      ['Position', `equipment.${item.name}.index`, item.index, ModelTypes.number],
                      ['Amount', `equipment.${item.name}.count`, item.count, ModelTypes.number],
                      ['Name', `equipment.${item.name}.name`, item.name, ModelTypes.text],
                      ['Weight', `equipment.${item.name}.weight`, item.weight, ModelTypes.number],
                  ])">
                    <div class="flex-2"></div>
                    <div class="flex-2">
                      {{ item.count }}
                    </div>
                    <div class="flex-8">
                      {{ item.name }}
                    </div>
                    <div class="flex-4">
                      {{ formatWeight(item.weight * item.count) }}
                    </div>
                    <div class="clickable" @click.stop @click="() =>{
                      deleteModelData.deleteFunction = async ()=>{
                        character.removeEquipment(item.name, item.count)
                        await firebaseHandler.setCharacterData(character.objectData)
                        resetDeleteModelData()
                      };
                      deleteModelData.open = true
                      deleteModelData.item = `${item.count} ${item.name}`
                      deleteModelData.question = 'Are you sure you want to delete this item?'
                    }" v-html="ICON_REMOVE"></div>
                  </div>
                  <div class="equipment-item container row clickable" @click="async () => {
                      character.addEquipment('new item', 1, 0)
                      await firebaseHandler.setCharacterData(character.objectData)
                    }">
                    <div class="flex-2"></div>
                    <div class="flex-2"></div>
                    <div class="flex-8">--Add a new item--</div>
                    <div class="flex-4"></div>
                    <div v-html="ICON_ADD"></div>
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
          <div class="container value-display col block flex-1 no-border-top no-border-left clickable"
               @click="atClickEdit([['Character Name', 'name', character.name, ModelTypes.text]])">
            <p class="flex-1 value medium no-transform">{{ character.name }}</p>
            <p>Character Name</p>
          </div>
        </div>
        <div class="container col flex-2"> <!-- Right Column -->
          <div class="container row">
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="atClickEdit([['Character Age in years', 'age', character.age, ModelTypes.number]])">
              <p class="flex-1 value medium no-transform">{{ character.age }}</p>
              <p>Age</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top clickable"
                 @click="atClickEdit([['Character Height in foot', 'height', character.height, ModelTypes.number]])">
              <p class="flex-1 value medium no-transform">{{ formatLength(character.height) }}</p>
              <p>Height</p>
            </div>
            <div class="container block value-display col flex-1 no-border-top no-border-right clickable"
                 @click="atClickEdit([['Character Weight in pounds', 'weight', character.weight, ModelTypes.number]])">
              <p class="flex-1 value medium no-transform">{{ formatWeight(character.weight) }}</p>
              <p>Weight</p>
            </div>
          </div>
          <div class="container row">
            <div class="container block value-display col flex-1 clickable"
                 @click="atClickEdit([['Character Eyes', 'eyeColor', character.eyeColor, ModelTypes.text]])">
              <p class="flex-1 value medium no-transform">{{ character.eyeColor }}</p>
              <p>Eyes</p>
            </div>
            <div class="container block value-display col flex-1 clickable"
                 @click="atClickEdit([['Character Skin', 'skinColor', character.skinColor, ModelTypes.text]])">
              <p class="flex-1 value medium no-transform">{{ character.skinColor }}</p>
              <p>Skin</p>
            </div>
            <div class="container block value-display col flex-1 no-border-right clickable"
                 @click="atClickEdit([['Character Hair', 'hairColor', character.hairColor, ModelTypes.text]])">
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
               @click="atClickEdit([['Character Backstory', 'backstory', character.backstory, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.backstory.split('\n')">
                {{ line }}
              </p>
            </div>
            <p>Character Backstory</p>
          </div>
        </div>
        <div class="container col flex-2">
          <div class="container block value-display align-start col flex-1 no-border-right clickable"
               @click="atClickEdit([['Allies & Organizations', 'allies', character.allies, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.allies.split('\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Allies & Organizations</p>
          </div>
          <div class="container block value-display align-start col flex-1 no-border-right clickable"
               @click="atClickEdit([['Additional Features & Traits', 'additionalFeatures', character.additionalFeatures, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="no-transform" v-for="line in character.additionalFeatures.split('\n')">
                {{ line }}
              </p>
            </div>
            <p class="align-center">Additional Features & Traits</p>
          </div>
          <div class="container block value-display align-start col flex-1 no-border-right no-border-bottom clickable"
               @click="atClickEdit([['Treasure', 'treasure', character.treasure, ModelTypes.textarea]])">
            <div class="flex-1">
              <p class="flex-1 no-transform" v-for="line in character.treasure.split('\n')">
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
            <div class="container value-display col block flex-3 no-border-top no-border-left clickable"
                 @click="atClickEdit([['Spellcasting Class', 'spellcastingClass', character.spellcastingClass, ModelTypes.classes]])">
              <p class="flex-1 value medium no-transform">{{ character.spellcastingClass }}</p>
              <p>Spellcasting Class</p>
            </div>
            <div class="container block value-display col flex-2 no-border-top clickable"
                 @click="atClickEdit([['Spellcasting Ability', 'spellcastingAbility', character.spellcastingAbility, ModelTypes.abilityTypes]])">
              <p class="flex-1 value medium no-transform" style="text-transform: capitalize">
                {{ character.spellcastingAbility }}</p>
              <p>Spellcasting Ability</p>
            </div>
            <div class="container block value-display col flex-2 no-border-top">
              <p class="flex-1 value medium no-transform">{{ character.spellSaveDc }}</p>
              <p>Spell Save DC</p>
            </div>
            <div class="container block value-display col flex-2 no-border-top no-border-right">
              <p class="flex-1 value medium no-transform">{{ formatScore(character.spellAttackBonus) }}</p>
              <p>Spell Attack Bonus</p>
            </div>
          </div>
        </div>
      </div>
      <div class="body container row">
        <div class="container col flex-1" v-for="(i, key) in [[0,1,2],[3,4,5],[6,7,8,9]]">
          <div class="container block value-display col flex-1 clickable" v-for="j in i"
               :class="{'no-border-bottom': [2,5,9].includes(j), 'no-border-left': key===0, 'no-border-right': key===2}"
               @click="()=>{
                 if (j === 0){
                   const items = []
                   character.usableSpells.cantrips.forEach((item, index)=>{
                     console.log(item, 'item')
                     items.push([`Cantrip  ${index+1}`, `usableSpells.cantrips.${index}`, character.usableSpells.cantrips[index], ModelTypes.text])
                   })
                    atClickEdit(items)
                  } else {
                    const items = [
                        ['Spell Slots', `usableSpells.spells.${j}.spellSlots`, character.usableSpells.spells[j].spellSlots, ModelTypes.number],
                        ['Spell Slots Expanded', `usableSpells.spells.${j}.spellSlotsExpanded`, character.usableSpells.spells[j].spellSlotsExpanded, ModelTypes.number],
                    ]
                    character.usableSpells.spells[j].known.forEach((item, index)=>{
                      items.push([`Spell ${index+1}`, `usableSpells.spells.${j}.known.${index}`, item, ModelTypes.text])
                    })
                    atClickEdit(items)
                 }
               }"
          >
            <div class="container row labeled-row" style="margin-bottom: .5rem">
              <div class="value flex-1">
                <p>lvl {{ j }}</p>
              </div>
              <div class="label flex-3" v-if="j===0">
                <p>Cantrips</p>
              </div>
              <div class="flex-3 container row" v-if="j!==0">
                <div class="value flex-1" @click.stop @click="atClickEdit([
                  ['Spell Slots', `usableSpells.spells.${j}.spellSlots`, character.usableSpells.spells[j].spellSlots, ModelTypes.number],
              ])">
                  <p>{{ character.usableSpells.spells[j].spellSlots }}</p>
                </div>
                <div class="label flex-2" @click.stop @click="atClickEdit([
                  ['Spell Slots', `usableSpells.spells.${j}.spellSlots`, character.usableSpells.spells[j].spellSlots, ModelTypes.number],
              ])">
                  <p>Total</p>
                </div>
                <div class="value flex-1" @click.stop @click="atClickEdit([
                  ['Spell Slots Expanded', `usableSpells.spells.${j}.spellSlotsExpanded`, character.usableSpells.spells[j].spellSlotsExpanded, ModelTypes.number],
              ])">
                  <p>{{ character.usableSpells.spells[j].spellSlotsExpanded }}</p>
                </div>
                <div class="label flex-2" @click.stop @click="atClickEdit([
                  ['Spell Slots Expanded', `usableSpells.spells.${j}.spellSlotsExpanded`, character.usableSpells.spells[j].spellSlotsExpanded, ModelTypes.number],
              ])">
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
                       :class="{selected:character.usableSpells.spells[j].prepared.includes(spell)}"
                       @click.stop @click="atClickPrepared(j, spell)"
                  ></div>
                </div>
                <p class="flex-3">{{ spell }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  MODALS  -->

  <div v-if="editing.open" class="popup container col" style="align-items: center" @click="atClickCancel">
    <div class="container row popup-display">
      <div class="container block value-display col" @click.stop>

        <div class="container row input-row" v-for="item in editing.items">
          <div class="container col">
            <label :for="item.name">{{ item.name }}</label>
            <input v-if="item.type.element === 'input' && item.type.type !== 'disabled'"
                   :type="item.type.type !== 'coin' ? item.type.type : 'number'"
                   :name="item.name"
                   v-model="item.value"
                   @keydown.enter="atClickSave"
                   @keydown.esc="atClickCancel"/>
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
                @keydown.esc="atClickCancel"/>
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
                <input type="text" v-model="row.name" placeholder="Name">
                <input type="number" v-model="row.bonus" placeholder="Bonus">
                <input type="text" v-model="row.damage" placeholder="Damage">
                <input type="text" v-model="row.type" placeholder="Type">
              </div>
            </div>
            <div v-if="item.type.element === 'coins'">
              <input :type="'number'"
                     :name="item.name"
                     v-model="item.value"
                     @keydown.enter="atClickSave"
                     @keydown.esc="atClickCancel"/>
              <p></p>
              <p v-for="(coin, name) in Character.calculateCoins(item.value)">{{ coin }} {{ name }}</p>
            </div>
          </div>
        </div>

        <div class="container row button-row">
          <button @click="atClickSave">Save</button>
          <button @click="atClickCancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showImageModel" class="popup container col" style="align-items: center">
    <div class="container row popup-display">
      <div class="container block value-display col">
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

  <div v-if="deleteModelData.open" class="popup container col" style="align-items: center">
    <div class="container row popup-display">
      <div class="container block value-display col">
        <div class="container row input-row">
          <div class="container col">
            <p>{{ deleteModelData.question }}</p>
            <p>{{ deleteModelData.item }}</p>
          </div>
        </div>
        <div class="container row button-row">
          <button @click="deleteModelData.deleteFunction">Confirm</button>
          <button @click="resetDeleteModelData">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  justify-content: center;

  .popup-display {
    min-width: 20rem;
    width: 50%;
    justify-content: center;

    .value-display {
      padding: 4rem 2rem;
      min-width: 15rem;
      border-radius: 1rem;
      border-width: .25rem;

      .input-row, .button-row {
        justify-content: center;
      }

      .input-row {
        margin-bottom: 1rem;

        > div {
          align-items: center;
        }

        label {
          text-transform: none;
        }

        input, textarea, select {
          padding: .5rem;
          border-radius: .5rem;
        }

        input {
          text-align: center;

          &[type="text"] {
            width: 15rem;
          }

          &[type="number"] {
            text-align: start;
            width: 5rem;
          }
        }

        textarea {
          min-width: 15rem;
        }

        select {
          width: 15rem;
        }

      }

      .button-row {
        button {
          padding: .5rem;
          border-radius: .5rem;
          margin-right: 1rem;
        }
      }
    }
  }
}
</style>