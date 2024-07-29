export const classes = [
    "Artificer",
    "Barbarian",
    "Bard",
    "Cleric",
    "Druid",
    "Fighter",
    "Monk",
    "Paladin",
    "Ranger",
    "Rogue",
    "Sorcerer",
    "Warlock",
    "Wizard",
    "Custom"
];

export const alignments = [
    "Lawful good",
    "Neutral good",
    "Chaotic good",
    "Lawful neutral",
    "Neutral",
    "Chaotic neutral",
    "Lawful evil",
    "Neutral evil",
    "Chaotic evil"
];

export const abilityTypes = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma"
]

export const abilities = {
    strength: [
        "Saving Throws",
        "Athletics"
    ],
    dexterity: [
        "Saving Throws",
        "Acrobatics",
        "Sleight of Hand",
        "Stealth"
    ],
    constitution: [
        "Saving Throws"
    ],
    intelligence: [
        "Saving Throws",
        "Arcana",
        "History",
        "Investigation",
        "Nature",
        "Religion"
    ],
    wisdom: [
        "Saving Throws",
        "Animal Handling",
        "Insight",
        "Medicine",
        "Perception",
        "Survival"
    ],
    charisma: [
        "Saving Throws",
        "Deception",
        "Intimidation",
        "Performance",
        "Persuasion"
    ],
};

export const dice = [
    "D2",
    "D4",
    "D6",
    "D8",
    "D10",
    "D12",
    "D20",
]

export class Attack {
    constructor(name, bonus, damage, type) {
        this.name = name;
        this.bonus = bonus;
        this.damage = damage;
        this.type = type;
    }
}

export class Character {

    default() {
        let id
        if (this._character !== undefined) {
            id = this._character.id;
        } else {
            id = Date.now().toString(36).slice(-8);
        }

        this._character = {
            id: id,
            name: "",
            class: "",
            level: 0,
            race: "",
            background: "",
            alignment: "",
            experiencePoints: 0,
            abilities: {
                proficiencyBonus: 0,
                proficiencies: {
                    strength: [],
                    dexterity: [],
                    constitution: [],
                    intelligence: [],
                    wisdom: [],
                    charisma: []
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
                    base: 0,
                    misc: 0
                },
                speed: 30,
                hitPoints: {
                    base: 8,
                    current: 0,
                    temp: 0
                },
                hitDice: "D8",
                deathSaves: {
                    successes: 0,
                    failures: 0
                },
            },
            equipment: [],
            languages: [],
            attacks: {},
            spellcasting:
                {
                    cantrips: [],
                    spells:
                        {
                            level1: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level2: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level3: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level4: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level5: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level6: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level7: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level8: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                            level9: {
                                prepared: [],
                                known:
                                    [],
                                spellSlots:
                                    0,
                                spellSlotsExpanded:
                                    0
                            }
                            ,
                        }
                    ,
                }

        }
    };

    constructor(object = undefined) {
        if (object === undefined) {
            this.default();
            return;
        }

        this._character = object;
    }

// CUSTOM LOGIC
    _calculateAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

// METHODS
    addProficiency(type, name) {
        if (!abilityTypes.includes(type)) {
            console.log("ERROR: ability type does not exists")
            return;
        }

        if (abilities[type].includes(name)) {
            console.log("ERROR: proficiency does not exists")
            return;
        }

        if (this.proficiencies[type].includes(name)) {
            return;
        }

        this.proficiencies[type].push(name)

    }

    removeProficiency(type, name) {
        if (!abilityTypes.includes(type)) {
            console.log("ERROR: ability type does not exists")
            return;
        }

        if (abilities[type].includes(name)) {
            console.log("ERROR: proficiency does not exists")
            return;
        }

        if (this.proficiencies[type].includes(name)) {
            this.proficiencies[type].splice(this.proficiencies[type].indexOf(name), 1)
        }
    }

    addAttack(name, bonus, damage, type) {
        this._character.attacks[name] = new Attack(name, bonus, damage, type)
    }

    removeAttack(name) {
        delete this._character.attacks[name]
    }

    addLanguage(language) {
        if (!this._character.languages.includes(language)) {
            this._character.languages.push(language)
        }
    }

    removeLanguage(language) {
        if (this._character.languages.includes(language)) {
            this._character.languages.splice(this._character.languages.indexOf(language), 1)
        }
    }

// COMPUTED PROPERTIES
    get strengthModifier() {
        return this._calculateAbilityModifier(this.strength);
    }

    get dexterityModifier() {
        return this._calculateAbilityModifier(this.dexterity);
    }

    get constitutionModifier() {
        return this._calculateAbilityModifier(this.constitution);
    }

    get intelligenceModifier() {
        return this._calculateAbilityModifier(this.intelligence);
    }

    get charismaModifier() {
        return this._calculateAbilityModifier(this.charisma);
    }

    get wisdomModifier() {
        return this._calculateAbilityModifier(this.wisdom);
    }

    get abilities() {
        // console.log("abilities")
        let result = {}

        for (const [key, value] of Object.entries(abilities)) {
            result[key] = {}
            value.forEach((item) => {
                // console.log(key, item)
                result[key][item] = {
                    value: Reflect.get(this, `${key}Modifier`),
                    proficient: false
                }

                if (this.proficiencies[key].includes(item)) {
                    // console.log("proficient", key, item)
                    result[key][item].value += this.proficiencyBonus
                    result[key][item].proficient = true
                }
            })
        }
        return result
    }

    get armorClass() {
        let result = 0
        result += this._character.stats.armorClass.base
        if (this._character.stats.armorClass.hasDexModifier) {
            result += ((this.dexterityModifier < 2) ? this.dexterityModifier : 2)
        }
        result += this._character.stats.armorClass.shield
        result += this._character.stats.armorClass.misc
        return result
    }

    get hitPointMaximum() {
        return `${this._character.stats.hitPoints.base} + ${this.constitutionModifier}`
    }

    get initiativeModifier() {
        return this._character.stats.initiative.base
            + this._character.stats.initiative.misc
            + this.dexterityModifier
    }


// GLOBAL GETTERS AND SETTERS
    get name() {
        return this._character.name;
    }

    set name(value) {
        this._character.name = value;
    }

    get class

    () {
        return this._character.class;
    }

    set class

    (value) {
        if (classes.includes(value)) {
            this._character.class = value;
        } else {
            console.log("ERROR: class is not in the known list")
        }
    }

    get level() {
        return this._character.level;
    }

    set level(value) {
        this._character.level = value;
    }

    get race() {
        return this._character.race;
    }

    set race(value) {
        this._character.race = value;
    }

    get background() {
        return this._character.background;
    }

    set background(value) {
        this._character.background = value;
    }

    get alignment() {
        return this._character.alignment;
    }

    set alignment(value) {
        if (alignments.includes(value)) {
            this._character.alignment = value;
        } else {
            console.log("ERROR: alignment is not in the known list")
        }
    }

    get experiencePoints() {
        return this._character.experiencePoints;
    }

    set experiencePoints(value) {
        this._character.experiencePoints = value;
    }

// ABILITIES GETTERS AND SETTERS
    get proficiencyBonus() {
        return this._character.abilities.proficiencyBonus;
    }

    set proficiencyBonus(value) {
        this._character.abilities.proficiencyBonus = value;
    }

    get proficiencies() {
        return this._character.abilities.proficiencies;
    }

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
        return this.wisdom
    }

// STATS GETTERS AND SETTERS
    get armorClassBase() {
        return this._character.stats.armorClass.base
    }

    set armorClassBase(value) {
        this._character.stats.armorClass.base = value
    }

    set armorClassHasDexModifier(value) {
        this._character.stats.armorClass.hasDexModifier = value
    }

    set armorClassShield(value) {
        this._character.stats.armorClass.shield = value
    }

    set armorClassMisc(value) {
        this._character.stats.armorClass.misc = value
    }

    get initiativeBase() {
        return this._character.stats.initiative.base
    }

    set initiativeBase(value) {
        this._character.stats.initiative.base = value
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

    get currentHitPoints() {
        return this._character.stats.hitPoints.current
    }

    set currentHitPoints(value) {
        this._character.stats.hitPoints.current = value
    }

    get tempHitPoints() {
        return this._character.stats.hitPoints.temp
    }

    set hitPointsTemp(value) {
        this._character.stats.hitPoints.temp = value
    }

    get hitDice() {
        return this._character.stats.hitDice
    }

    set hitDice(value) {
        if (dice.includes(value)) {
            this._character.stats.hitDice = value;
        } else {
            console.log("ERROR: Dice is not in the known list")
        }
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