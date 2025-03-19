"use strict";

import {classes, alignments, abilityTypes, proficiencyTypes, armorTypes, abilities, dice} from "@/models/Enums.js";
import {Attack, Item, defaultCharacter, CharacterConversions, newCharacterId} from "@/models/CharacterHelperClasses.js";
import {calculateCoins, calculateAbilityModifier, toCopperCoins} from "@/helpers/characterHelpers.js";

export class Character {
    default(id = undefined) {
        const _getIdWithFailSave = (id = undefined) => {
            if (id !== undefined) {
                return id
            } else if (this._character !== undefined) {
                return this._character.id;
            }
            return newCharacterId();
        }

        return defaultCharacter(_getIdWithFailSave(id))
    }

    constructor(object = undefined, id = undefined) {
        if (object === undefined) {
            object = this.default(id);
        }

        this._character = CharacterConversions(object);
    }

    get id() {
        return this._character.id;
    }

    get objectData() {
        return JSON.parse(JSON.stringify(this._character));
    }

    proficiencyAdd(type, name) {
        if (!proficiencyTypes.includes(type)) {
            console.error("ERROR: ability type does not exists")
            return;
        }

        if (type !== 'items' && !abilities[type].includes(name)) {
            console.error("ERROR: proficiency does not exists")
            return;
        }

        if (this.proficiencies[type].includes(name)) {
            return;
        }

        this.proficiencies[type].push(name)

    }

    get proficiencies() {
        const result = {}
        Object.entries(this._character.abilities.proficiencies)
            .sort()
            .forEach((category) => result[category[0]] = category[1].sort());
        return result
    }

    proficiencyToggle(type, name) {
        const _type = type.toLowerCase()
        if (this.proficiencies[_type].includes(name)) {
            this.proficiencyRemove(_type, name)
            return;
        }
        this.proficiencyAdd(_type, name)
    }

    proficiencyRemove(type, name) {
        if (!proficiencyTypes.includes(type)) {
            console.error("ERROR: ability type does not exists")
            return;
        }

        if (type !== 'items' && !abilities[type].includes(name)) {
            console.error("ERROR: proficiency does not exists")
            return;
        }

        if (this.proficiencies[type].includes(name)) {
            this.proficiencies[type].splice(this.proficiencies[type].indexOf(name), 1)
        }
    }

    get proficiencyBonus() {
        if (this.detailLevel < 5) {
            return 2
        } else if (this.detailLevel < 9) {
            return 3
        } else if (this.detailLevel < 13) {
            return 4
        } else if (this.detailLevel < 17) {
            return 5
        } else {
            return 6
        }
    }


    attackAdd(name, bonus, damage, type) {
        this._character.attacks[name] = new Attack(name, bonus, damage, type, this._character.attacks.length+1)
    }

    get attacks() {
        let objects = Object.entries(this._character.attacks)
        objects.sort((a, b) => {
            if (a[1].index < b[1].index) {
                return -1;
            } else if (b[1].index > a[1].index) {
                return 1;
            }
            // a must be equal to b
            return 0;
        })
        const result = {}
        objects.forEach((item) => result[item[0]] = item[1]);
        return result
    }

    attackUpdate(key, attack) {
        if (this._character.attacks[key] === undefined) {
            console.error("ERROR: attack does not exists")
            return
        }
        if (key !== attack.name) {
            this._character.attacks[attack.name] = this._character.attacks[key]
            delete this._character.attacks[key]
        }
        this._character.attacks[attack.name] = attack
    }

    attackRemove(name) {
        delete this._character.attacks[name]
    }


    languageAdd(language) {
        if (!this._character.languages.includes(language)) {
            this._character.languages.push(language)
        }
    }

    get languages() {
        return this._character.languages
    }

    languageRemove(language) {
        if (this._character.languages.includes(language)) {
            this._character.languages.splice(this._character.languages.indexOf(language), 1)
        }
    }

    get spellcastingClass() {
        return this._character.spellcasting.class
    }

    set spellcastingClass(value) {
        if (!classes.includes(value)) {
            console.error("ERROR: class does not exists")
            return;
        }
        this._character.spellcasting.class = value
    }

    get spellcastingAbility() {
        return this._character.spellcasting.ability
    }

    set spellcastingAbility(value) {
        if (!abilityTypes.includes(value)) {
            console.error("ERROR: ability type does not exists")
            return;
        }
        this._character.spellcasting.ability = value
    }

    get spellcastingSpellSaveDc() {
        const upperAbility = this.spellcastingAbility.charAt(0).toUpperCase() + this.spellcastingAbility.slice(1)
        const modifier = this[`ability${upperAbility}Modifier`]
        return 8 + modifier + this.proficiencyBonus
    }

    get spellcastingAttackBonus() {
        const upperAbility = this.spellcastingAbility.charAt(0).toUpperCase() + this.spellcastingAbility.slice(1)
        const modifier = this[`ability${upperAbility}Modifier`]
        return modifier + this.proficiencyBonus
    }

    get spellcastingSpells() {
        let spells = {}
        // prepared spells
        for (const [key, value] of Object.entries(this._character.spellcasting.spells)) {
            value.known = value.known.sort()
            spells[key] = value
        }
        return spells
    }

    spellcastingSpellSlots_get(level) {
        return this._character.spellcasting.spells[level].spellSlots
    }

    spellcastingSpellSlots_set(level, value) {
        this._character.spellcasting.spells[level].spellSlots = value
    }

    spellcastingSpellSlotsExpanded_get(level) {
        return this._character.spellcasting.spells[level].spellSlotsExpanded
    }

    spellcastingSpellSlotsExpanded_set(level, value) {
        if (value < 0) {
            console.error("ERROR: spell slots expanded must be a positive integer")
            return
        }
        if (value > this.spellcastingSpellSlots_get(level)) {
            console.error("ERROR: spell slots expanded must be less or equal to spell slots")
            return
        }

        this._character.spellcasting.spells[level].spellSlotsExpanded = value
    }

    spellcastingAdd(level, spell) {
        if (!this._character.spellcasting.spells[level].known.includes(spell)) {
            this._character.spellcasting.spells[level].known.push(spell)
        }
    }

    spellcastingRemove(level, spell) {
        if (this._character.spellcasting.spells[level].known.includes(spell)) {
            this._character.spellcasting.spells[level].known.splice(this._character.spellcasting.spells[level].known.indexOf(spell), 1)
        }
    }

    spellcastingPreparedToggle(level, name) {
        if (this._character.spellcasting.spells[level].prepared.includes(name)) {
            this.spellcastingPreparedRemove(level, name)
            return;
        }
        this.spellcastingPreparedAdd(level, name)
    }

    spellcastingPreparedAdd(level, spell) {
        if (!this._character.spellcasting.spells[level].prepared.includes(spell)) {
            this._character.spellcasting.spells[level].prepared.push(spell)
        }
    }

    spellcastingPreparedRemove(level, spell) {
        if (this._character.spellcasting.spells[level].prepared.includes(spell)) {
            let spellIndex = this._character.spellcasting.spells[level].prepared.indexOf(spell)
            this._character.spellcasting.spells[level].prepared.splice(spellIndex, 1)
        }
    }

    get spellcastingCantrips() {
        return this._character.spellcasting.cantrips
    }

    spellcastingCantripAdd(cantrip) {
        if (!this._character.spellcasting.cantrips.includes(cantrip)) {
            this._character.spellcasting.cantrips.push(cantrip)
        }
    }

    spellcastingCantripRemove(cantrip) {
        if (this._character.spellcasting.cantrips.includes(cantrip)) {
            this._character.spellcasting.cantrips.splice(this._character.spellcasting.cantrips.indexOf(cantrip), 1)
        }
    }

    get notes() {
        return this._character.notes
    }

    set notes(value) {
        this._character.notes = value
    }

    get featureAdditional() {
        return this._character.additionalFeatures
    }

    set featureAdditional(value) {
        this._character.additionalFeatures = value
    }

    featureAdd(feature, description) {
        if (this._character.features[feature] !== undefined) {
            return
        }
        this._character.features[feature] = {
            name: feature,
            description: description
        }
    }

    featureUpdate(oldFeature, feature, description) {
        if (this._character.features[oldFeature] === undefined) {
            console.error("ERROR: feature does not exists")
            return
        }
        if (oldFeature !== feature) {
            this._character.features[feature] = this._character.features[oldFeature]
            delete this._character.features[oldFeature]
            this._character.features[feature].name = feature
        }
        this._character.features[feature].description = description
    }

    get features() {
        const result = {}
        Object.entries(this._character.features)
            .sort()
            .forEach((category) => result[category[0]] = category[1]);

        return result
    }

    featureRemove(feature) {
        if (this._character.features[feature] === undefined) {
            return
        }

        delete this._character.features[feature]
    }


    equipmentAdd(name, count, weight, description) {
        if (this._character.equipment[name] !== undefined) {
            this._character.equipment[name].count += count
            return
        }
        this._character.equipment[name] = new Item(Object.keys(this._character.equipment).length, name, count, weight, description)
    }

    get equipmentItems() {
        let objects = Object.entries(this._character.equipment)
        objects.sort((a, b) => {
            if (a[1].index < b[1].index) {
                return -1;
            } else if (b[1].index > a[1].index) {
                return 1;
            }
            // a must be equal to b
            return 0;

        })
        const result = {}
        objects.forEach((item) => result[item[0]] = item[1]);
        return result
    }

    equipmentRemove(name, count) {
        if (this._character.equipment[name] === undefined) {
            return
        }

        if (this._character.equipment[name].count > count) {
            this._character.equipment[name].count -= count
            return
        }

        delete this._character.equipment[name]
    }

    equipmentUpdate(oldName, name, count, weight, index, description) {
        if (this._character.equipment[oldName] === undefined) {
            console.error("ERROR: equipment does not exists")
            return
        }
        if (oldName !== name) {
            this._character.equipment[name] = this._character.equipment[oldName]
            delete this._character.equipment[oldName]
            this._character.equipment[name].name = name
        }

        this._character.equipment[name].count = count
        this._character.equipment[name].weight = weight
        this._character.equipment[name].index = index
        this._character.equipment[name].description = description

    }

    equipmentCoinAdd(coins, type) {
        let cp = toCopperCoins(coins, type)
        this._character.coins += cp
    }

    equipmentCoinRemove(coins, type) {
        let cp = toCopperCoins(coins, type)
        if (this._character.coins < cp) {
            console.error("ERROR: not enough coins")
            return
        }
        this._character.coins -= cp
    }

    get equipmentCoins() {
        return this._character.coins
    }

    set equipmentCoins(value) {
        if (!Number.isInteger(value) || value < 0) {
            console.error("ERROR: coins must be a positive integer")
        }

        this._character.coins = value
    }

    get equipmentCoinFormatted() {
        return calculateCoins(this._character.coins)
    }

    get abilityStrength() {
        return this._character.abilities.strength;
    }

    set abilityStrength(value) {
        this._character.abilities.strength = value;
    }

    get abilityDexterity() {
        return this._character.abilities.dexterity;
    }

    set abilityDexterity(value) {
        this._character.abilities.dexterity = value;
    }

    get abilityConstitution() {
        return this._character.abilities.constitution;
    }

    set abilityConstitution(value) {
        this._character.abilities.constitution = value;
    }

    get abilityIntelligence() {
        return this._character.abilities.intelligence;
    }

    set abilityIntelligence(value) {
        this._character.abilities.intelligence = value;
    }

    get abilityWisdom() {
        return this._character.abilities.wisdom;
    }

    set abilityWisdom(value) {
        this._character.abilities.wisdom = value;
    }

    get abilityCharisma() {
        return this._character.abilities.charisma;
    }

    set abilityCharisma(value) {
        this._character.abilities.charisma = value;
    }

    get abilityStrengthModifier() {
        return calculateAbilityModifier(this.abilityStrength);
    }

    get abilityDexterityModifier() {
        return calculateAbilityModifier(this.abilityDexterity);
    }

    get abilityConstitutionModifier() {
        return calculateAbilityModifier(this.abilityConstitution);
    }

    get abilityIntelligenceModifier() {
        return calculateAbilityModifier(this.abilityIntelligence);
    }

    get abilityWisdomModifier() {
        return calculateAbilityModifier(this.abilityWisdom);
    }

    get abilityCharismaModifier() {
        return calculateAbilityModifier(this.abilityCharisma);
    }

    get abilityInspiration() {
        return this._character.abilities.inspiration;
    }

    set abilityInspiration(value) {
        this._character.abilities.inspiration = value;
    }

    get abilities() {
        let result = {}

        for (const [key, value] of Object.entries(abilities)) {
            const upperKey = key.charAt(0).toUpperCase() + key.slice(1)
            result[upperKey] = {
                skills: {},
                score: this[`ability${upperKey}`],
                modifier: this[`ability${upperKey}Modifier`]
            }
            value.forEach((item) => {
                result[upperKey]["skills"][item] = {
                    value: this[`ability${upperKey}Modifier`],
                    proficient: false
                }

                if (this.proficiencies[key].includes(item)) {
                    result[upperKey]["skills"][item].value += this.proficiencyBonus
                    result[upperKey]["skills"][item].proficient = true
                }
            })
        }
        return result
    }

    get abilityInitiativeModifier() {
        return this.abilityDexterityModifier + this.abilityInitiativeMisc;
    }

    get abilityInitiativeMisc() {
        return this._character.stats.initiative.misc;
    }

    set abilityInitiativeMisc(value) {
        this._character.stats.initiative.misc = value;
    }

    get abilityPassivePerception() {
        let modifier = 10 + this.abilityWisdomModifier;
        if (this.proficiencies.wisdom.includes("Perception")) {
            modifier += this.proficiencyBonus;
        }
        return modifier;
    }

    get detailName() {
        return this._character.name;
    }

    set detailName(value) {
        this._character.name = value;
    }

    get detailLevel() {
        return this._character.level;
    }

    set detailLevel(value) {
        this._character.level = value;
    }

    get detailRace() {
        return this._character.race;
    }

    set detailRace(value) {
        this._character.race = value;
    }

    get detailBackground() {
        return this._character.background;
    }

    set detailBackground(value) {
        this._character.background = value;
    }

    get detailExperiencePoints() {
        return this._character.experiencePoints;
    }

    set detailExperiencePoints(value) {
        this._character.experiencePoints = value;
    }

    get detailAge() {
        return this._character.age;
    }

    set detailAge(value) {
        this._character.age = value;
    }

    get detailHeight() {
        return this._character.height;
    }

    set detailHeight(value) {
        this._character.height = value;
    }

    get detailWeight() {
        return this._character.weight;
    }

    set detailWeight(value) {
        this._character.weight = value;
    }

    get detailEyeColor() {
        return this._character.eyeColor;
    }

    set detailEyeColor(value) {
        this._character.eyeColor = value;
    }

    get detailHairColor() {
        return this._character.hairColor;
    }

    set detailHairColor(value) {
        this._character.hairColor = value;
    }

    get detailSkinColor() {
        return this._character.skinColor;
    }

    set detailSkinColor(value) {
        this._character.skinColor = value;
    }

    get detailBackstory() {
        return this._character.backstory;
    }

    set detailBackstory(value) {
        this._character.backstory = value;
    }

    get detailPersonalityTraits() {
        return this._character.personalityTraits;
    }

    set detailPersonalityTraits(value) {
        this._character.personalityTraits = value;
    }

    get detailIdeals() {
        return this._character.ideals;
    }

    set detailIdeals(value) {
        this._character.ideals = value;
    }

    get detailBonds() {
        return this._character.bonds;
    }

    set detailBonds(value) {
        this._character.bonds = value;
    }

    get detailFlaws() {
        return this._character.flaws;
    }

    set detailFlaws(value) {
        this._character.flaws = value;
    }

    get detailAllies() {
        return this._character.allies;
    }

    set detailAllies(value) {
        this._character.allies = value;
    }

    get detailTreasure() {
        return this._character.treasure;
    }

    set detailTreasure(value) {
        this._character.treasure = value;
    }

    get detailClass() {
        return this._character.class;
    }

    set detailClass(value) {
        if (classes.includes(value)) {
            this._character.class = value;
        } else {
            console.error("ERROR: class is not in the known list")
        }
    }

    get detailSubClass() {
        return this._character.subclass;
    }

    set detailSubClass(value) {
        this._character.subclass = value;
    }

    get detailAlignment() {
        return this._character.alignment
    }

    set detailAlignment(value) {
        if (alignments.includes(value)) {
            this._character.alignment = value;
        } else {
            console.error("ERROR: alignment is not in the known list")
        }
    }

    get statArmorClass() {
        let result = 0;
        result += this.statArmorClassBase;
        result += this.statArmorClassGetDexModifier
        result += this.statArmorClassShield;
        result += this.statArmorClassMisc;
        return result;
    }

    get statArmorClassBase() {
        return this._character.stats.armorClass.base;
    }

    set statArmorClassBase(value) {
        this._character.stats.armorClass.base = value;
    }

    get statArmorClassArmorType() {
        if (this._character.stats.armorClass.armorType === undefined) {
            this._character.stats.armorClass.armorType = armorTypes[0];
        }
        return this._character.stats.armorClass.armorType;
    }

    set statArmorClassArmorType(value) {
        if (armorTypes.includes(value)) {
            this._character.stats.armorClass.armorType = value;
        } else {
            console.error("ERROR: armor type is not in the known list");
        }
    }

    get statArmorClassGetDexModifier() {
        switch (this.statArmorClassArmorType) {
            case "Light":
                return this.abilityDexterityModifier;
            case "Medium":
                return Math.max(this.abilityDexterityModifier, 2);
            case "Heavy":
                return 0;
            default:
                return 0;
        }
    }

    get statArmorClassShield() {
        return this._character.stats.armorClass.shield;
    }

    set statArmorClassShield(value) {
        this._character.stats.armorClass.shield = value;
    }

    get statArmorClassMisc() {
        return this._character.stats.armorClass.misc;
    }

    set statArmorClassMisc(value) {
        this._character.stats.armorClass.misc = value;
    }

    get statHitPointMaximum() {
        const values = [this.statHitPointsBase, this.abilityConstitutionModifier];
        if (this.statHitPointsMisc && this.statHitPointsMisc !== 0) {
            values.push(this.statHitPointsMisc);
        }
        return values.join(" + ");
    }

    get statHitPointMaximumValue() {
        return this.statHitPointsBase + this.abilityConstitutionModifier + this.statHitPointsMisc;
    }

    get statHitPointsBase() {
        return this._character.stats.hitPoints.base;
    }

    set statHitPointsBase(value) {
        this._character.stats.hitPoints.base = value;
    }

    get statHitPointsMisc() {
        return this._character.stats.hitPoints.misc;
    }

    set statHitPointsMisc(value) {
        this._character.stats.hitPoints.misc = value;
    }

    get statHitPointsTemp() {
        return this._character.stats.hitPoints.temp;
    }

    set statHitPointsTemp(value) {
        this._character.stats.hitPoints.temp = value;
    }

    get statHitPointsCurrent() {
        return this._character.stats.hitPoints.current;
    }

    set statHitPointsCurrent(value) {
        if (value > this.statHitPointMaximumValue) {
            console.error("ERROR: hit points are higher than maximum hit points");
            this._character.stats.hitPoints.current = this.statHitPointMaximumValue;
            return;
        }
        this._character.stats.hitPoints.current = value;
    }

    get statHitDie() {
        return this._character.stats.hitDice.die;
    }

    set statHitDie(value) {
        const die = value.toLowerCase().split("d");
        if (die.length === 2 && dice.includes(die[1]) && Number.isInteger(Number(die[0]))) {
            this._character.stats.hitDice.die = die[1];
            this.statCurrentAmountHitDice = Number(die[0]);
        } else if (dice.includes(value)) {
            this._character.stats.hitDice.die = value
        } else {
            console.log(value)
            console.error("ERROR: Dice is not in the known list");
        }
    }

    get statMaxHitDice() {
        return this.detailLevel;
    }

    get statCurrentAmountHitDice() {
        return this._character.stats.hitDice.current;
    }

    set statCurrentAmountHitDice(value) {
        if (Number.isInteger(value) && value <= this.statMaxHitDice && value >= 0) {
            this._character.stats.hitDice.current = value;
        } else {
            console.error("ERROR: not enough hit dice");
        }
    }

    get statCurrentHitDice() {
        return this.statCurrentAmountHitDice + 'D' + this.statHitDie;
    }

    get statSpeed() {
        return this._character.stats.speed;
    }

    set statSpeed(value) {
        this._character.stats.speed = value;
    }

    get statDeathSavesSuccesses() {
        return this._character.stats.deathSaves.successes;
    }

    set statDeathSavesSuccesses(value) {
        if (value < 0 || value > 3) {
            console.error("ERROR: death saves successes must be between 0 and 3");
            return;
        }
        this._character.stats.deathSaves.successes = value;
    }

    get statDeathSavesFailures() {
        return this._character.stats.deathSaves.failures;
    }

    set statDeathSavesFailures(value) {
        if (value < 0 || value > 3) {
            console.error("ERROR: death saves failures must be between 0 and 3");
            return;
        }
        this._character.stats.deathSaves.failures = value;
    }
}