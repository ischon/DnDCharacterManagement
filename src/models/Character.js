import {classes, alignments, abilityTypes, proficiencyTypes, abilities, dice} from "@/models/Enums.js";
import {Attack, Item} from "@/models/CharacterHelperClasses.js";
import {calculateCoins, calculateAbilityModifier, toCopperCoins} from "@/helpers/characterHelpers.js";
import {range} from "lodash";

export class Character {
    default(id = undefined) {
        const _getIdWithFailSave = (id = undefined) => {
            if (id !== undefined) {
                return id
            } else if (this._character !== undefined) {
                return this._character.id;
            }
            return Date.now().toString(36).slice(-8);
        }

        return {
            id: _getIdWithFailSave(id),
            name: "",
            class: "",
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
                proficiencies: {
                    strength: [],
                    dexterity: [],
                    constitution: [],
                    intelligence: [],
                    wisdom: [],
                    charisma: [],
                    items: []
                },
                inspiration: 0,
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
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
                speed: 30,
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
                spells: {
                    1: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    2: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    3: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    4: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    5: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    6: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    7: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    8: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                    9: {
                        prepared: [],
                        known:
                            [],
                        spellSlots:
                            0,
                        spellSlotsExpanded:
                            0
                    },
                },
            },
            features: [],
        }
    };

    constructor(object = undefined, id = undefined) {
        if (object === undefined) {
            object = this.default(id);
        }

        this._character = object;

        this._configure()
    }

    _configure() {
        this.proficiency._configure()
        this.attack._configure()
        this.language._configure()
        this.spellcasting._configure()
        this.feature._configure()
        this.equipment._configure()
        this.ability._configure()
        this.detail._configure()
    }

    proficiency = {
        _configure: () => {
            Object.defineProperty(this.proficiency, 'list', {get: this.proficiency._list_get})
            Object.defineProperty(this.proficiency, 'bonus', {get: this.proficiency._bonus_get})
        },
        add: (type, name) => {
            if (!proficiencyTypes.includes(type)) {
                console.error("ERROR: ability type does not exists")
                return;
            }

            if (type !== 'items' && !abilities[type].includes(name)) {
                console.error("ERROR: proficiency does not exists")
                return;
            }

            if (this.proficiency.list[type].includes(name)) {
                return;
            }

            this.proficiency.list[type].push(name)

        },
        _list_get: () => {
            const result = {}
            Object.entries(this._character.abilities.proficiencies)
                .sort()
                .forEach((category) => result[category[0]] = category[1].sort());
            return result
        },
        toggle: (type, name) => {
            if (this.proficiency.list[type].includes(name)) {
                this.proficiency.remove(type, name)
                return;
            }
            this.proficiency.add(type, name)
        },
        remove: (type, name) => {
            if (!proficiencyTypes.includes(type)) {
                console.error("ERROR: ability type does not exists")
                return;
            }

            if (type !== 'items' && !abilities[type].includes(name)) {
                console.error("ERROR: proficiency does not exists")
                return;
            }

            if (this.proficiency.list[type].includes(name)) {
                this.proficiency.list[type].splice(this.proficiency.list[type].indexOf(name), 1)
            }
        },
        _bonus_get: () => {
            if (this.level < 5) {
                return 2
            } else if (this.level < 9) {
                return 3
            } else if (this.level < 13) {
                return 4
            } else if (this.level < 17) {
                return 5
            } else {
                return 6
            }
        }
    }

    attack = {
        _configure: () => {
            Object.defineProperty(this.attack, 'list', {get: this.attack._list_get})
        },
        add: (name, bonus, damage, type) => {
            this._character.attacks[name] = new Attack(name, bonus, damage, type)
        },
        _list_get: () => {
            return this._character.attacks
        },
        update: (key, attack) => {
            if (this._character.attacks[key] === undefined) {
                console.error("ERROR: attack does not exists")
                return
            }
            if (key !== attack.name) {
                this._character.attacks[attack.name] = this._character.attacks[key]
                delete this._character.attacks[key]
            }
            this._character.attacks[attack.name] = attack
        },
        remove: (name) => {
            delete this._character.attacks[name]
        }
    }

    language = {
        _configure: () => {
            Object.defineProperty(this.language, 'list', {get: this.language._list_get})
        },
        add: (language) => {
            if (!this._character.languages.includes(language)) {
                this._character.languages.push(language)
            }
        },
        _list_get: () => {
            return this._character.languages
        },
        remove: (language) => {
            if (this._character.languages.includes(language)) {
                this._character.languages.splice(this._character.languages.indexOf(language), 1)
            }
        }
    }

    spellcasting = {
        _configure: () => {
            Object.defineProperty(this.spellcasting, 'class', {
                get: this.spellcasting._class_get,
                set: this.spellcasting._class_set
            })
            Object.defineProperty(this.spellcasting, 'ability', {
                get: this.spellcasting._ability_get,
                set: this.spellcasting._ability_set
            })
            Object.defineProperty(this.spellcasting, 'spellSaveDc', {get: this.spellcasting._spellSaveDc_get})
            Object.defineProperty(this.spellcasting, 'attackBonus', {get: this.spellcasting._attackBonus_get})
            Object.defineProperty(this.spellcasting, 'usableSpells', {get: this.spellcasting._usableSpells_get})

            this.spellcasting.spell._configure()
        },
        _class_get: () => {
            return this._character.spellcasting.class
        },
        _class_set: (value) => {
            if (!classes.includes(value)) {
                console.error("ERROR: class does not exists")
                return;
            }
            this._character.spellcasting.class = value
        },
        _ability_get: () => {
            return this._character.spellcasting.ability
        },
        _ability_set: (value) => {
            if (!abilityTypes.includes(value)) {
                console.error("ERROR: ability type does not exists")
                return;
            }
            this._character.spellcasting.ability = value
        },
        _spellSaveDc_get: () => {
            const modifier = this.ability[`${this.spellcasting.ability}Modifier`]
            return 8 + modifier + this.proficiency.bonus
        },
        _attackBonus_get: () => {
            const modifier = this.ability[`${this.spellcasting.ability}Modifier`]
            return modifier + this.proficiency.bonus
        },
        _usableSpells_get: () => {
            let result = {
                cantrips: [],
                spells: {}
            }
            result['cantrips'] = this._character.spellcasting.cantrips
            // prepared spells
            for (const [key, value] of Object.entries(this._character.spellcasting.spells)) {
                result['spells'][key] = value
            }
            return result
        },
        spell: {
            _configure: () => {
                range(1, 10).forEach((level) => {
                    this.spellcasting.spell[level] = {
                        _configure: () => {
                            Object.defineProperty(this.spellcasting.spell[level], 'slots', {
                                get: this.spellcasting.spell[level]._slots_get,
                                set: this.spellcasting.spell[level]._slots_set
                            })
                            Object.defineProperty(this.spellcasting.spell[level], 'slotsExpanded', {
                                get: this.spellcasting.spell[level]._slotsExpanded_get,
                                set: this.spellcasting.spell[level]._slotsExpanded_set
                            })
                        },
                        _slots_get: () => {
                            return this._character.spellcasting.spells[level].spellSlots
                        },
                        _slots_set: (value) => {
                            this._character.spellcasting.spells[level].spellSlots = value
                        },
                        _slotsExpanded_get: () => {
                            return this._character.spellcasting.spells[level].spellSlotsExpanded
                        },
                        _slotsExpanded_set: (value) => {
                            this._character.spellcasting.spells[level].spellSlotsExpanded = value
                        },
                        add: (spell) => {
                            if (!this._character.spellcasting.spells[level].known.includes(spell)) {
                                this._character.spellcasting.spells[level].known.push(spell)
                            }
                        },
                        remove: (spell) => {
                            if (this._character.spellcasting.spells[level].known.includes(spell)) {
                                this._character.spellcasting.spells[level].known.splice(this._character.spellcasting.spells[level].known.indexOf(spell), 1)
                            }
                        },
                        prepared: {
                            toggle: (name) => {
                                if (this._character.spellcasting.spells[level].prepared.includes(name)) {
                                    this.spellcasting.spell.prepared.remove(level, name)
                                    return;
                                }
                                this.spellcasting.spell.prepared.add(level, name)
                            },
                            add: (spell) => {
                                if (!this._character.spellcasting.spells[level].prepared.includes(spell)) {
                                    this._character.spellcasting.spells[level].prepared.push(spell)
                                }
                            },
                            remove: (spell) => {
                                if (this._character.spellcasting.spells[level].prepared.includes(spell)) {
                                    this._character.spellcasting.spells[level].prepared.splice(this._character.spellcasting.spells[level].prepared.indexOf(spell), 1)
                                }
                            }
                        }
                    }
                    this.spellcasting.spell[level]._configure()
                })
            }
        },
        cantrip: {
            add: (cantrip) => {
                if (!this._character.spellcasting.cantrips.includes(cantrip)) {
                    this._character.spellcasting.cantrips.push(cantrip)
                }
            },
            remove: (cantrip) => {
                if (this._character.spellcasting.cantrips.includes(cantrip)) {
                    this._character.spellcasting.cantrips.splice(this._character.spellcasting.cantrips.indexOf(cantrip), 1)
                }
            }
        }
    }

    feature = {
        _configure: () => {
            Object.defineProperty(this.feature, 'list', {get: this.feature._list_get})
        },
        add: (feature) => {
            if (!this._character.features.includes(feature)) {
                this._character.features.push(feature)
            }
        },
        _list_get: () => {
            return this._character.features
        },
        remove: (feature) => {
            if (this._character.features.includes(feature)) {
                this._character.features.splice(this._character.features.indexOf(feature), 1)
            }
        }
    }

    equipment = {
        _configure: () => {
            Object.defineProperty(this.equipment, 'list', {get: this.equipment._list_get})
            this.equipment.coin._configure()
        },
        add: (name, count, weight) => {
            if (this._character.equipment[name] !== undefined) {
                this._character.equipment[name].count += count
                return
            }
            this._character.equipment[name] = new Item(Object.keys(this._character.equipment).length, name, count, weight)
        },
        _list_get: () => {
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
        },
        remove: (name, count) => {
            if (this._character.equipment[name] === undefined) {
                return
            }

            if (this._character.equipment[name].count > count) {
                this._character.equipment[name].count -= count
                return
            }

            delete this._character.equipment[name]
        },
        update: (oldName, name, count, weight, index) => {
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

        },
        coin: {
            _configure: () => {
                Object.defineProperty(this.equipment.coin, 'amount', {
                    get: this.equipment.coin._amount_get,
                    set: this.equipment.coin._amount_set
                })
            },
            add: (coins, type) => {
                let cp = toCopperCoins(coins, type)
                this._character.coins += cp
            },
            remove: (coins, type) => {
                let cp = toCopperCoins(coins, type)
                if (this._character.coins < cp) {
                    console.error("ERROR: not enough coins")
                    return
                }
                this._character.coins -= cp
            },
            _amount_get: () => {
                return this._character.coins
            },
            _amount_set: (value) => {
                if (!Number.isInteger(value) || value < 0) {
                    console.error("ERROR: coins must be a positive integer")
                }

                this._character.coins = value
            },
            format: () => {
                return calculateCoins(this._character.coins)
            }
        }
    }

    ability = {
        _configure: () => {
            ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach((ability) => {
                Object.defineProperty(this.ability, `${ability}Modifier`, {
                    get: () => {
                        return calculateAbilityModifier(this[ability])
                    }
                })
            })
            Object.defineProperty(this.ability, 'list', {get: this.ability._list_get})
            Object.defineProperty(this.ability, 'initiativeModifier', {get: this.ability._initiativeModifier_get})
        },
        _list_get: () => {
            let result = {}

            for (const [key, value] of Object.entries(abilities)) {
                result[key] = {
                    skills: {},
                    score: this[`${key}`],
                    modifier: this.ability[`${key}Modifier`]
                }
                value.forEach((item) => {
                    result[key]["skills"][item] = {
                        value: this.ability[`${key}Modifier`],
                        proficient: false
                    }

                    if (this.proficiency.list[key].includes(item)) {
                        result[key]["skills"][item].value += this.proficiency.bonus
                        result[key]["skills"][item].proficient = true
                    }
                })
            }
            return result
        },
        _initiativeModifier_get: () => {
            return this.initiativeBase + this.initiativeMisc
        }
    }

    detail = {
        _configure: () => {
            [
                'name', 'level', 'race', 'background', 'experiencePoints', 'age', 'height', 'weight', 'eyeColor',
                'hairColor', 'skinColor', 'backstory', 'personalityTraits', 'ideals', 'bonds', 'flaws', 'allies'
            ].forEach((item) => {
                Object.defineProperty(this.detail, `${item}`, {
                    get: () => this._character[item],
                    set: (value) => this._character[item] = value
                })
            })

            Object.defineProperty(this.detail, 'class', {get: this.detail._class_get, set: this.detail._class_set})
            Object.defineProperty(this.detail, 'alignment', {get: this.detail._alignment_get, set: this.detail._alignment_set})
        },
        _class_get: () => this._character.class,
        _class_set: (value) => {
            if (classes.includes(value)) {
                this._character.class = value;
            } else {
                console.error("ERROR: class is not in the known list")
            }
        },
        _alignment_get: () => this._character.alignment,
        _alignment_set: (value) => {
            if (alignments.includes(value)) {
                this._character.alignment = value;
            } else {
                console.error("ERROR: alignment is not in the known list")
            }
        },
    }

// COMPUTED PROPERTIES
    // TODO: What to do with these?
    get armorClass() {
        let result = 0
        result += this.armorClassBase
        if (this.armorClassHasDexModifier) {
            result += ((this.ability.dexterityModifier < 2) ? this.dexterityModifier : 2)
        }
        result += this.armorClassShield
        result += this.armorClassMisc
        return result
    }

    get hitPointMaximum() {
        // https://5ehpcalculator.com/
        const values = []
        values.push(this.baseHitPoints)
        values.push(this.ability.constitutionModifier)
        if (this.hitPointsMisc && this.hitPointsMisc !== 0) {
            values.push(this.hitPointsMisc)
        }

        return values.join(" + ")
    }

    get hitPointMaximumValue() {
        let value = 0
        value += this.baseHitPoints
        value += this.ability.constitutionModifier
        if (this.hitPointsMisc && this.hitPointsMisc !== 0) {
            value += this.hitPointsMisc
        }

        return value
    }


// GLOBAL GETTERS AND SETTERS
    get id() {
        return this._character.id;
    }

    get objectData() {
        return JSON.parse(JSON.stringify(this._character));
    }

    // TODO: Continue here

    get additionalFeatures() {
        return this._character.additionalFeatures;
    }

    set additionalFeatures(value) {
        this._character.additionalFeatures = value;
    }

    get treasure() {
        return this._character.treasure;
    }

    set treasure(value) {
        this._character.treasure = value;
    }


// ABILITIES GETTERS AND SETTERS

    get inspiration() {
        return this._character.abilities.inspiration;
    }

    set inspiration(value) {
        this._character.abilities.inspiration = value;
    }

    get strength() {
        return this._character.abilities.strength;
    }

    set strength(value) {
        this._character.abilities.strength = value;
    }

    get dexterity() {
        return this._character.abilities.dexterity;
    }

    set dexterity(value) {
        this._character.abilities.dexterity = value;
    }

    get constitution() {
        return this._character.abilities.constitution;
    }

    set constitution(value) {
        this._character.abilities.constitution = value;
    }

    get intelligence() {
        return this._character.abilities.intelligence;
    }

    set intelligence(value) {
        this._character.abilities.intelligence = value;
    }

    get wisdom() {
        return this._character.abilities.wisdom;
    }

    set wisdom(value) {
        this._character.abilities.wisdom = value;
    }

    get charisma() {
        return this._character.abilities.charisma;
    }

    set charisma(value) {
        this._character.abilities.charisma = value;
    }

// LINKED ABILITIES GETTERS AND SETTERS
    get passivePerception() {
        if (this.proficiency.list.wisdom.includes("Perception")) {
            return 10 + this.ability.wisdomModifier + this.proficiency.bonus
        }
        return 10 + this.ability.wisdomModifier
    }

// STATS GETTERS AND SETTERS
    get armorClassBase() {
        return this._character.stats.armorClass.base
    }

    set armorClassBase(value) {
        this._character.stats.armorClass.base = value
    }

    get armorClassHasDexModifier() {
        return this._character.stats.armorClass.hasDexModifier
    }

    set armorClassHasDexModifier(value) {
        this._character.stats.armorClass.hasDexModifier = value
    }

    get armorClassShield() {
        return this._character.stats.armorClass.shield
    }

    set armorClassShield(value) {
        this._character.stats.armorClass.shield = value
    }

    get armorClassMisc() {
        return this._character.stats.armorClass.misc
    }

    set armorClassMisc(value) {
        this._character.stats.armorClass.misc = value
    }

    get initiativeBase() {
        return this.ability.dexterityModifier
    }

    get initiativeMisc() {
        return this._character.stats.initiative.misc
    }

    set initiativeMisc(value) {
        this._character.stats.initiative.misc = value
    }

    get speed() {
        return this._character.stats.speed
    }

    set speed(value) {
        this._character.stats.speed = value
    }

    get baseHitPoints() {
        return this._character.stats.hitPoints.base
    }

    set baseHitPoints(value) {
        this._character.stats.hitPoints.base = value
    }

    get hitPointsMisc() {
        return this._character.stats.hitPoints.misc
    }

    set hitPointsMisc(value) {
        this._character.stats.hitPoints.misc = value
    }

    get currentHitPoints() {
        return this._character.stats.hitPoints.current
    }

    set currentHitPoints(value) {
        if (value > this.hitPointMaximumValue) {
            console.error("ERROR: hit points are higher than maximum hit points")
            this._character.stats.hitPoints.current = this.hitPointMaximumValue
            return
        }

        this._character.stats.hitPoints.current = value
    }

    get tempHitPoints() {
        return this._character.stats.hitPoints.temp
    }

    set tempHitPoints(value) {
        this._character.stats.hitPoints.temp = value
    }

    get hitDice() {
        return this._character.stats.hitDice.die
    }

    set hitDice(value) {
        const die = value.toLowerCase().split("d")
        if (die.length === 2 && dice.includes(die[1]) && Number.isInteger(Number(die[0]))) {
            this._character.stats.hitDice.die = die[1];
            this.currentHitDice = Number(die[0]);
            return
        }
        console.error("ERROR: Dice is not in the known list")
    }

    get maxHitDice() {
        return this.detail.level
    }

    get currentAmountHitDice() {
        return this._character.stats.hitDice.current
    }

    set currentAmountHitDice(value) {
        if (Number.isInteger(value) && value <= this.maxHitDice && value >= 0) {
            this._character.stats.hitDice.current = value
            return;
        }
        console.error("ERROR: not enough hit dice")
    }

    get currentHitDice() {
        return this.currentAmountHitDice + 'D' + this._character.stats.hitDice.die
    }

    set currentHitDice(value) {
        this.currentAmountHitDice = Number(value)
    }

    get deathSaves() {
        return this._character.stats.deathSaves
    }

    set deathSaveSuccesses(value) {
        this._character.stats.deathSaves.successes = value
    }

    set deathSaveFailures(value) {
        this._character.stats.deathSaves.failures = value
    }
}