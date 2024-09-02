import {classes, alignments, abilityTypes, proficiencyTypes, abilities, dice} from "@/models/Enums.js";
import {Attack, Item, defaultCharacter} from "@/models/CharacterHelperClasses.js";
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

        return defaultCharacter(_getIdWithFailSave(id))
    }

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
        this.stat._configure()
    }

    get id() {
        return this._character.id;
    }

    get objectData() {
        return JSON.parse(JSON.stringify(this._character));
    }

    proficiency = {
        _configure: () => {
            Object.defineProperty(this.proficiency, 'list', {get: this.proficiency._list_get})
            Object.defineProperty(this.proficiency, 'bonus', {get: this.proficiency._bonus_get})
        },
        list: undefined,
        bonus: undefined,
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
            if (this.detail.level < 5) {
                return 2
            } else if (this.detail.level < 9) {
                return 3
            } else if (this.detail.level < 13) {
                return 4
            } else if (this.detail.level < 17) {
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
        list: undefined,
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
        list: undefined,
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
        class: undefined,
        ability: undefined,
        spellSaveDc: undefined,
        attackBonus: undefined,
        usableSpells: undefined,
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
                                    this.spellcasting.spell[level].prepared.remove(name)
                                    return;
                                }
                                this.spellcasting.spell[level].prepared.add(name)
                            },
                            add: (spell) => {
                                if (!this._character.spellcasting.spells[level].prepared.includes(spell)) {
                                    this._character.spellcasting.spells[level].prepared.push(spell)
                                }
                            },
                            remove: (spell) => {
                                if (this._character.spellcasting.spells[level].prepared.includes(spell)) {
                                    let spellIndex = this._character.spellcasting.spells[level].prepared.indexOf(spell)
                                    this._character.spellcasting.spells[level].prepared.splice(spellIndex, 1)
                                }
                            }
                        }
                    }
                    this.spellcasting.spell[level]._configure()
                })
            },
            1: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            2: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            3: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            4: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            5: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            6: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            7: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            8: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
            9: {
                slots: undefined,
                slotsExpanded: undefined,
                add: undefined,
                remove: undefined,
                prepared: {
                    toggle: undefined,
                    add: undefined,
                    remove: undefined
                }
            },
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
            Object.defineProperty(this.feature, 'additional', {
                get: () => this._character.additionalFeatures,
                set: (value) => this._character.additionalFeatures = value
            })
        },
        list: undefined,
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
        list: undefined,
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
                Object.defineProperty(this.equipment.coin, 'format', {get: this.equipment.coin._format_get})
            },
            amount: undefined,
            format: undefined,
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
            _format_get: () => {
                return calculateCoins(this._character.coins)
            }
        }
    }

    ability = {
        _configure: () => {
            ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach((ability) => {
                Object.defineProperty(this.ability, `${ability}Modifier`, {
                    get: () => {
                        return calculateAbilityModifier(this.ability[ability])
                    }
                })
                Object.defineProperty(this.ability, `${ability}`, {
                    get: () => this._character.abilities[ability],
                    set: (value) => this._character.abilities[ability] = value
                })
            })
            Object.defineProperty(this.ability, 'inspiration', {
                get: () => this._character.abilities.inspiration,
                set: (value) => this._character.abilities.inspiration = value
            })
            Object.defineProperty(this.ability, 'list', {get: this.ability._list_get})
            Object.defineProperty(this.ability, 'initiativeModifier', {get: this.ability._initiativeModifier_get})
            Object.defineProperty(this.ability, 'initiativeMisc', {
                get: this.ability._initiativeMisc_get,
                set: this.ability._initiativeMisc_set
            })
            Object.defineProperty(this.ability, 'passivePerception', {get: this.ability._passivePerception_get})
        },
        strength: undefined,
        dexterity: undefined,
        constitution: undefined,
        intelligence: undefined,
        wisdom: undefined,
        charisma: undefined,
        strengthModifier: undefined,
        dexterityModifier: undefined,
        constitutionModifier: undefined,
        intelligenceModifier: undefined,
        wisdomModifier: undefined,
        charismaModifier: undefined,
        inspiration: undefined,
        list: undefined,
        initiativeModifier: undefined,
        initiativeMisc: undefined,
        passivePerception: undefined,
        _list_get: () => {
            let result = {}

            for (const [key, value] of Object.entries(abilities)) {
                result[key] = {
                    skills: {},
                    score: this.ability[`${key}`],
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
        _initiativeModifier_get: () => this.ability.dexterityModifier + this.ability.initiativeMisc,
        _initiativeMisc_get: () => this._character.stats.initiative.misc,
        _initiativeMisc_set: (value) => this._character.stats.initiative.misc = value,
        _passivePerception_get: () => {
            let modifier = 10 + this.ability.wisdomModifier
            if (this.proficiency.list.wisdom.includes("Perception")) {
                modifier += this.proficiency.bonus
            }
            return modifier
        },
    }

    detail = {
        _configure: () => {
            [
                'name', 'level', 'race', 'background', 'experiencePoints', 'age', 'height', 'weight', 'eyeColor',
                'hairColor', 'skinColor', 'backstory', 'personalityTraits', 'ideals', 'bonds', 'flaws', 'allies',
                'treasure'
            ].forEach((item) => {
                Object.defineProperty(this.detail, `${item}`, {
                    get: () => this._character[item],
                    set: (value) => this._character[item] = value
                })
            })

            Object.defineProperty(this.detail, 'class', {get: this.detail._class_get, set: this.detail._class_set})
            Object.defineProperty(this.detail, 'alignment', {
                get: this.detail._alignment_get,
                set: this.detail._alignment_set
            })
        },
        name: undefined,
        level: undefined,
        race: undefined,
        background: undefined,
        experiencePoints: undefined,
        age: undefined,
        height: undefined,
        weight: undefined,
        eyeColor: undefined,
        hairColor: undefined,
        skinColor: undefined,
        backstory: undefined,
        personalityTraits: undefined,
        ideals: undefined,
        bonds: undefined,
        flaws: undefined,
        allies: undefined,
        treasure: undefined,
        class: undefined,
        alignment: undefined,
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

    stat = {
        _configure: () => {
            Object.defineProperty(this.stat, 'armorClass', {get: this.stat._armorClass_get});
            ['base', 'hasDexModifier', 'shield', 'misc'].forEach((item) => {
                Object.defineProperty(this.stat, `armorClass${item.charAt(0).toUpperCase() + item.slice(1)}`, {
                    get: () => this._character.stats.armorClass[item],
                    set: (value) => this._character.stats.armorClass[item] = value
                })
            })
            Object.defineProperty(this.stat, 'hitPointMaximum', {get: this.stat._hitPointMaximum_get});
            Object.defineProperty(this.stat, 'hitPointMaximumValue', {get: this.stat._hitPointMaximumValue_get});
            ['base', 'misc', 'temp'].forEach((item) => {
                Object.defineProperty(this.stat, `hitPoints${item.charAt(0).toUpperCase() + item.slice(1)}`, {
                    get: () => this._character.stats.hitPoints[item],
                    set: (value) => this._character.stats.hitPoints[item] = value
                })
            })
            Object.defineProperty(this.stat, 'hitPointsCurrent', {
                get: this.stat._hitPointsCurrent_get,
                set: this.stat._hitPointsCurrent_set
            })
            Object.defineProperty(this.stat, 'hitDie', {
                get: this.stat._hitDie_get,
                set: this.stat._hitDie_set
            })
            Object.defineProperty(this.stat, 'maxHitDice', {get: this.stat._maxHitDice_get})
            Object.defineProperty(this.stat, 'currentAmountHitDice', {
                get: this.stat._currentAmountHitDice_get,
                set: this.stat._currentAmountHitDice_set
            })
            Object.defineProperty(this.stat, 'currentHitDice', {get: this.stat._currentHitDice_get})
            Object.defineProperty(this.stat, 'speed', {
                get: () => this._character.stats.speed,
                set: (value) => this._character.stats.speed = value
            })
            this.stat.deathSaves._configure()
        },
        armorClass: undefined,
        armorClassBase: undefined,
        armorClassHasDexModifier: undefined,
        armorClassShield: undefined,
        armorClassMisc: undefined,
        hitPointMaximum: undefined,
        hitPointMaximumValue: undefined,
        hitPointsBase: undefined,
        hitPointsMisc: undefined,
        hitPointsTemp: undefined,
        hitPointsCurrent: undefined,
        hitDie: undefined,
        maxHitDice: undefined,
        currentAmountHitDice: undefined,
        currentHitDice: undefined,
        speed: undefined,
        _armorClass_get: () => {
            let result = 0
            result += this.stat.armorClassBase
            if (this.stat.armorClassHasDexModifier) {
                result += ((this.ability.dexterityModifier < 2) ? this.ability.dexterityModifier : 2)
            }
            result += this.stat.armorClassShield
            result += this.stat.armorClassMisc
            return result
        },
        _hitPointMaximum_get: () => {
            // https://5ehpcalculator.com/
            const values = []
            values.push(this.stat.hitPointsBase)
            values.push(this.ability.constitutionModifier)
            if (this.stat.hitPointsMisc && this.stat.hitPointsMisc !== 0) {
                values.push(this.stat.hitPointsMisc)
            }

            return values.join(" + ")
        },
        _hitPointMaximumValue_get: () => {
            let value = 0
            value += this.stat.hitPointsBase
            value += this.ability.constitutionModifier
            value += this.stat.hitPointsMisc

            return value
        },
        _hitPointsCurrent_get: () => this._character.stats.hitPoints.current,
        _hitPointsCurrent_set: (value) => {
            if (value > this.stat.hitPointMaximumValue) {
                console.error("ERROR: hit points are higher than maximum hit points")
                this._character.stats.hitPoints.current = this.stat.hitPointMaximumValue
                return
            }

            this._character.stats.hitPoints.current = value
        },
        _hitDie_get: () => this._character.stats.hitDice.die,
        _hitDie_set: (value) => {
            const die = value.toLowerCase().split("d")
            if (die.length === 2 && dice.includes(die[1]) && Number.isInteger(Number(die[0]))) {
                this._character.stats.hitDice.die = die[1];
                this.stat.currentAmountHitDice = Number(die[0]);
                return
            }
            console.error("ERROR: Dice is not in the known list")
        },
        _maxHitDice_get: () => this.detail.level,
        _currentAmountHitDice_get: () => this._character.stats.hitDice.current,
        _currentAmountHitDice_set: (value) => {
            if (Number.isInteger(value) && value <= this.stat.maxHitDice && value >= 0) {
                this._character.stats.hitDice.current = value
                return;
            }
            console.error("ERROR: not enough hit dice")
        },
        _currentHitDice_get: () => {
            return this.stat.currentAmountHitDice + 'D' + this.stat.hitDie
        },
        deathSaves: {
            _configure: () => {
                Object.defineProperty(this.stat.deathSaves, 'successes', {
                    get: () => this._character.stats.deathSaves.successes,
                    set: (value) => {
                        if (value < 0 || value > 3) {
                            console.error("ERROR: death saves successes must be between 0 and 3")
                            return
                        }
                        this._character.stats.deathSaves.successes = value
                    }
                })
                Object.defineProperty(this.stat.deathSaves, 'failures', {
                    get: () => this._character.stats.deathSaves.failures,
                    set: (value) => {
                        if (value < 0 || value > 3) {
                            console.error("ERROR: death saves failures must be between 0 and 3")
                            return
                        }
                        this._character.stats.deathSaves.failures = value

                    }
                })
            },
            successes: undefined,
            failures: undefined
        }
    }
}