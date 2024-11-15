"use strict"
import {range} from "lodash";
import {abilityTypes, proficiencyTypes} from "@/models/Enums.js";

export class Attack {
    constructor(name, bonus, damage, type) {
        this.name = name;
        this.bonus = bonus;
        this.damage = damage;
        this.type = type;
    }
}

export class Item {
    constructor(index, name, count, weight) {
        this.index = index
        this.name = name;
        this.count = count;
        this.weight = weight;
    }
}

export function defaultCharacter(id) {
    const defaultCharacter = {
        id: id,
        name: "",
        class: "",
        subclass: "",
        level: 0,
        race: "",
        background: "",
        alignment: "",
        experiencePoints: 0,
        age: 0,
        height: 0,
        weight: 0,
        eyeColor: "",
        hairColor: "",
        skinColor: "",
        backstory: "",
        personalityTraits: "",
        ideals: "",
        bonds: "",
        flaws: "",
        allies: "",
        additionalFeatures: "",
        treasure: "",
        abilities: {
            proficiencies: {},
            inspiration: 0,
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
                die: "8",
                current: 1
            },
            speed: 30,
            deathSaves: {
                successes: 0,
                failures: 0
            },
        },
        coins: 0,
        equipment: {},
        languages: [],
        attacks: {},
        spellcasting: {
            class: "",
            ability: "",
            cantrips: [],
            spells: {},
        },
        features: [],
    }
    const defaultSpellBody = {
        prepared: [],
        known: [],
        spellSlots: 0,
        spellSlotsExpanded: 0,
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
                description: "",
            }
        })
        character.features = features
    }

    if (!('subclass' in character)){
        character.subclass = ""
    }

    return character
}