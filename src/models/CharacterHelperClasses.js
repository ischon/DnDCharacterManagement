'use strict'
import { eq, range } from 'lodash'
import { abilityTypes, proficiencyTypes } from '@/models/Enums.js'
import { Character } from '@/models/Character.js'

export class Attack {
  constructor(name, bonus, damage, type, index = 0) {
    this.index = index
    this.name = name
    this.bonus = bonus
    this.damage = damage
    this.type = type
  }
}

export class Item {
  constructor(index, name, count, weight, description) {
    this.index = index
    this.name = name
    this.count = count
    this.weight = weight
    this.description = description
  }
}

export function newCharacterId() {
  return Date.now().toString(36).slice(-8)
}

export function defaultCharacter(id) {
  const defaultCharacter = {
    id: id,
    name: '',
    class: '',
    subclass: '',
    level: 0,
    race: '',
    background: '',
    alignment: '',
    experiencePoints: 0,
    age: 0,
    height: 0,
    weight: 0,
    eyeColor: '',
    hairColor: '',
    skinColor: '',
    backstory: '',
    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    allies: '',
    notes: '',
    additionalFeatures: '',
    treasure: '',
    abilities: {
      proficiencies: {},
      inspiration: 0
    },
    stats: {
      armorClass: {
        base: 10,
        hasDexModifier: true,
        shield: 0,
        misc: 0
      },
      initiative: {
        misc: 0
      },
      hitPoints: {
        base: 8,
        misc: 0,
        current: 0,
        temp: 0
      },
      hitDice: {
        die: '8',
        current: 1
      },
      speed: 30,
      deathSaves: {
        successes: 0,
        failures: 0
      }
    },
    coins: 0,
    equipment: {},
    languages: [],
    attacks: {},
    spellcasting: {
      class: '',
      ability: '',
      cantrips: [],
      spells: {}
    },
    features: []
  }
  const defaultSpellBody = {
    prepared: [],
    known: [],
    spellSlots: 0,
    spellSlotsExpanded: 0
    // spellDescriptions: {}
  }

  range(1, 10).forEach(i => {
    defaultCharacter.spellcasting.spells[i] = defaultSpellBody
  })

  abilityTypes.forEach(ability => {
    defaultCharacter.abilities[ability] = 10
  })

  proficiencyTypes.forEach(proficiency => {
    defaultCharacter.abilities.proficiencies[proficiency] = []
  })

  return defaultCharacter
}

function typeOfProp(item) {
  return Array.isArray(item) ? 'list' : typeof item
}

/**
 * Converts character object to be compatible with the frontend
 * @param character
 * @returns character
 */
export function CharacterConversions(character) {
  if ('features' in character && typeOfProp(character.features) === 'list') {
    const features = {}

    character.features.forEach(feature => {
      features[feature] = {
        name: feature,
        description: ''
      }
    })
    character.features = features
  }

  if (!('subclass' in character)) {
    character.subclass = ''
  }

  if (
    'attacks' in character &&
    Object.keys(character['attacks']).length > 0 &&
    !('index' in Object.values(character['attacks'])[0])
  ) {
    Object.entries(character.attacks).forEach(([item, attack], index) => {
      attack.index = index
    })
  }

  if (!('notes' in character)) {
    character['notes'] = ''
  }

  if ('coins' in character && typeOfProp(character.coins) === 'number') {
    /*
            Coin	        CP      SP	    EP	    GP	    PP
            Copper Piece    1       1/10    1/50    1/100	1/1,000
            Silver Piece    10      1       1/5	    1/10    1/100
            Electrum Piece  50      5       1       1/2     1/20
            Gold Piece      100     10      2       1       1/10
            Platinum Piece  1,000   100     20      10      1
         */
    let coins = {
      copper: 0,
      silver: 0,
      electrum: 0,
      gold: 0,
      platinum: 0
    }
    let coinCount = character.coins
    // coins.platinum = Math.floor(coinCount / 1000)
    // coinCount -= coins.platinum * 1000
    coins.gold = Math.floor(coinCount / 100)
    coinCount -= coins.gold * 100
    // coins.electrum = Math.floor(coinCount / 50)
    // coinCount -= coins.electrum * 50
    coins.silver = Math.floor(coinCount / 10)
    coinCount -= coins.silver * 10
    coins.copper = coinCount

    character.coins = coins
  }

  return character
}
