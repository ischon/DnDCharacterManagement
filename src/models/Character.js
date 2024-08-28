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

export const proficiencyTypes = [
    ...abilityTypes,
    "items"
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
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "20",
]

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

export class Character {

    default(id = undefined) {
        let _id
        if (id !== undefined) {
            _id = id
        } else if (this._character !== undefined) {
            _id = this._character.id;
        } else {
            _id = Date.now().toString(36).slice(-8);
        }

        this._character = {
            id: _id,
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
            this.default(id);
            return;
        }

        this._character = object;
        if (object.id === undefined && id !== undefined) {
            this._character.id = id
        }
    }

//     TODO: order logic in this class

// CUSTOM LOGIC
    _calculateAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    _toCopperCoins(coins, type) {
        switch (type) {
            case "COPPER":
                return coins
            case "SILVER":
                return coins * 10
            case "ELECTRUM":
                return coins * 50
            case "GOLD":
                return coins * 100
            case "PLATINUM":
                return coins * 1000
        }

    }

    static calculateCoins(coins) {
        /*
        Coin	                CP      SP	    EP	    GP	    PP
        Copper Piece    (cp)    1       1/10    1/50    1/100	1/1,000
        Silver Piece    (sp)    10      1       1/5	    1/10    1/100
        Electrum Piece  (ep)    50      5       1       1/2     1/20
        Gold Piece      (gp)    100     10      2       1       1/10
        Platinum Piece  (pp)    1,000   100     20      10      1
         */
        let cp = coins
        let pp = Math.floor(cp / 1000)
        cp -= pp * 1000
        let gp = Math.floor(cp / 100)
        cp -= gp * 100
        let ep = Math.floor(cp / 50)
        cp -= ep * 50
        let sp = Math.floor(cp / 10)
        cp -= sp * 10

        return {
            'Copper Coins': cp,
            'Silver Coins': sp,
            'Electrum Coins': ep,
            'Gold Coins': gp,
            'Platinum Coins': pp
        }
    }

// METHODS
    save(key, value) {
        this._character[key] = value;


    }

    toggleProficiency(type, name) {
        if (this.proficiencies[type].includes(name)) {
            this.removeProficiency(type, name)
            return;
        }
        this.addProficiency(type, name)
    }

    addProficiency(type, name) {
        if (!proficiencyTypes.includes(type)) {
            console.log("ERROR: ability type does not exists")
            return;
        }

        if (type !== 'items' && !abilities[type].includes(name)) {
            console.log("ERROR: proficiency does not exists")
            console.log(abilities[type])
            console.log(name)
            return;
        }

        if (this.proficiencies[type].includes(name)) {
            return;
        }

        this.proficiencies[type].push(name)

    }

    removeProficiency(type, name) {
        if (!proficiencyTypes.includes(type)) {
            console.log("ERROR: ability type does not exists")
            return;
        }

        if (type !== 'items' && !abilities[type].includes(name)) {
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

    updateAttack(key, attack) {
        if (this._character.attacks[key] === undefined) {
            console.log(key, attack, this._character.attacks)
            console.log("ERROR: attack does not exists")
            return
        }
        if (key !== attack.name) {
            this._character.attacks[attack.name] = this._character.attacks[key]
            delete this._character.attacks[key]
        }
        this._character.attacks[attack.name] = attack
    }

    get attacks() {
        return this._character.attacks
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

    get languages() {
        return this._character.languages
    }

    get spellcastingClass() {
        return this._character.spellcasting.class
    }

    set spellcastingClass(value) {
        if (!classes.includes(value)) {
            console.log("ERROR: class does not exists")
            return;
        }
        this._character.spellcasting.class = value
    }

    get spellcastingAbility() {
        return this._character.spellcasting.ability
    }

    set spellcastingAbility(value) {
        if (!abilityTypes.includes(value)) {
            console.log("ERROR: ability type does not exists")
            return;
        }
        this._character.spellcasting.ability = value
    }

    get spellSaveDc() {
        const modifier = Reflect.get(this, `${this.spellcastingAbility}Modifier`)
        return 8 + modifier + this.proficiencyBonus
    }

    get spellAttackBonus() {
        const modifier = Reflect.get(this, `${this.spellcastingAbility}Modifier`)
        return modifier + this.proficiencyBonus
    }

    addCantrip(cantrip) {
        if (!this._character.spellcasting.cantrips.includes(cantrip)) {
            this._character.spellcasting.cantrips.push(cantrip)
        }
    }

    removeCantrip(cantrip) {
        if (this._character.spellcasting.cantrips.includes(cantrip)) {
            this._character.spellcasting.cantrips.splice(this._character.spellcasting.cantrips.indexOf(cantrip), 1)
        }
    }

    get usableSpells() {
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
    }

    togglePrepared(lvl, name) {
        if (this._character.spellcasting.spells[lvl].prepared.includes(name)) {
            this.removePreparedSpell(lvl, name)
            return;
        }
        this.addPreparedSpell(lvl, name)
    }

    addSpell(level, spell) {
        if (!this._character.spellcasting.spells[level].known.includes(spell)) {
            this._character.spellcasting.spells[level].known.push(spell)
        }
    }

    removeSpell(level, spell) {
        if (this._character.spellcasting.spells[level].known.includes(spell)) {
            this._character.spellcasting.spells[level].known.splice(this._character.spellcasting.spells[level].known.indexOf(spell), 1)
        }
    }

    addPreparedSpell(level, spell) {
        if (!this._character.spellcasting.spells[level].prepared.includes(spell)) {
            this._character.spellcasting.spells[level].prepared.push(spell)
        }
    }

    removePreparedSpell(level, spell) {
        if (this._character.spellcasting.spells[level].prepared.includes(spell)) {
            this._character.spellcasting.spells[level].prepared.splice(this._character.spellcasting.spells[level].prepared.indexOf(spell), 1)
        }
    }

    addSpellSlot(level, slots = 1) {
        this._character.spellcasting.spells[level].spellSlots += slots
    }

    removeSpellSlot(level, slots = 1) {
        if (this._character.spellcasting.spells[level].spellSlots < slots) {
            this._character.spellcasting.spells[level].spellSlots = 0
            console.log("ERROR: not enough spell slots, reset to 0")
            return
        }
        this._character.spellcasting.spells[level].spellSlots -= slots
    }

    restoreSpellSlots(level, slots = undefined) {
        if (slots === undefined) {
            this._character.spellcasting.spells[level].spellSlotsExpanded = 0
            return
        }
        this._character.spellcasting.spells[level].spellSlotsExpanded += slots
    }

    useSpellSlot(level, slots = 1) {
        if (
            this._character.spellcasting.spells[level].spellSlotsExpanded < this._character.spellcasting.spells[level].spellSlots
            && (this._character.spellcasting.spells[level].spellSlots - this._character.spellcasting.spells[level].spellSlotsExpanded) < slots
        ) {
            this._character.spellcasting.spells[level].spellSlotsExpanded += slots
        }

    }

    addFeature(feature) {
        if (!this._character.features.includes(feature)) {
            this._character.features.push(feature)
        }
    }

    removeFeature(feature) {
        if (this._character.features.includes(feature)) {
            this._character.features.splice(this._character.features.indexOf(feature), 1)
        }
    }

    get features() {
        return this._character.features
    }

    addEquipment(name, count, weight) {
        if (this._character.equipment[name] !== undefined) {
            this._character.equipment[name].count += count
            return
        }
        this._character.equipment[name] = new Item(Object.keys(this._character.equipment).length, name, count, weight)
    }

    removeEquipment(name, count) {
        if (this._character.equipment[name] === undefined) {
            return
        }

        if (this._character.equipment[name].count > count) {
            this._character.equipment[name].count -= count
            return
        }

        delete this._character.equipment[name]
    }

    updateEquipment(oldName, name, count, weight, index) {
        if (this._character.equipment[oldName] === undefined) {
            console.log("ERROR: equipment does not exists")
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
    }

    get equipment() {
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

    addCoins(coins, type) {
        let cp = this._toCopperCoins(coins, type)
        this._character.coins += cp
    }

    removeCoins(coins, type) {
        let cp = this._toCopperCoins(coins, type)
        if (this._character.coins < cp) {
            console.log("ERROR: not enough coins")
            return
        }
        this._character.coins -= cp
    }

    get coins() {
        return Character.calculateCoins(this._character.coins)
    }

// COMPUTED PROPERTIES

    get proficiencyBonus() {
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
            result[key] = {
                skills: {},
                score: Reflect.get(this, `${key}`),
                modifier: Reflect.get(this, `${key}Modifier`)
            }
            value.forEach((item) => {
                // console.log(key, item)
                result[key]["skills"][item] = {
                    value: Reflect.get(this, `${key}Modifier`),
                    proficient: false
                }

                if (this.proficiencies[key].includes(item)) {
                    // console.log("proficient", key, item)
                    result[key]["skills"][item].value += this.proficiencyBonus
                    result[key]["skills"][item].proficient = true
                }
            })
        }
        return result
    }

    get armorClass() {
        let result = 0
        result += this.armorClassBase
        if (this.armorClassHasDexModifier) {
            result += ((this.dexterityModifier < 2) ? this.dexterityModifier : 2)
        }
        result += this.armorClassShield
        result += this.armorClassMisc
        return result
    }

    get hitPointMaximum() {
        // https://5ehpcalculator.com/
        const values = []
        values.push(this.baseHitPoints)
        values.push(this.constitutionModifier)
        if (this.hitPointsMisc && this.hitPointsMisc !== 0) {
            values.push(this.hitPointsMisc)
        }

        return values.join(" + ")
    }

    get hitPointMaximumValue() {
        let value = 0
        value += this.baseHitPoints
        value += this.constitutionModifier
        if (this.hitPointsMisc && this.hitPointsMisc !== 0) {
            value += this.hitPointsMisc
        }

        return value
    }

    get initiativeModifier() {
        return this.initiativeBase
            + this.initiativeMisc
    }


// GLOBAL GETTERS AND SETTERS
    get id() {
        return this._character.id;
    }

    get objectData() {
        return JSON.parse(JSON.stringify(this._character));
    }

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

    get age() {
        return this._character.age;
    }

    set age(value) {
        this._character.age = value;
    }

    get height() {
        return this._character.height;
    }

    set height(value) {
        this._character.height = value;
    }

    get weight() {
        return this._character.weight;
    }

    set weight(value) {
        this._character.weight = value;
    }

    get eyeColor() {
        return this._character.eyeColor;
    }

    set eyeColor(value) {
        this._character.eyeColor = value;
    }

    get hairColor() {
        return this._character.hairColor;
    }

    set hairColor(value) {
        this._character.hairColor = value;
    }

    get skinColor() {
        return this._character.skinColor;
    }

    set skinColor(value) {
        this._character.skinColor = value;
    }

    get backstory() {
        return this._character.backstory;
    }

    set backstory(value) {
        this._character.backstory = value;
    }

    get personalityTraits() {
        return this._character.personalityTraits;
    }

    set personalityTraits(value) {
        this._character.personalityTraits = value;
    }

    get ideals() {
        return this._character.ideals;
    }

    set ideals(value) {
        this._character.ideals = value;
    }

    get bonds() {
        return this._character.bonds;
    }

    set bonds(value) {
        this._character.bonds = value;
    }

    get flaws() {
        return this._character.flaws;
    }

    set flaws(value) {
        this._character.flaws = value;
    }

    get allies() {
        return this._character.allies;
    }

    set allies(value) {
        this._character.allies = value;
    }

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

    get proficiencies() {
        const result = {}
        Object.entries(this._character.abilities.proficiencies)
            .sort()
            .forEach((category) => result[category[0]] = category[1].sort());
        return result
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
        if (this.proficiencies.wisdom.includes("Perception")) {
            return 10 + this.wisdomModifier + this.proficiencyBonus
        }
        return 10 + this.wisdomModifier
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
        return this.dexterityModifier
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
            console.log("ERROR: hit points are higher than maximum hit points")
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
        console.log("ERROR: Dice is not in the known list")
    }

    get maxHitDice() {
        return this._character.level
    }

    get currentAmountHitDice() {
        return this._character.stats.hitDice.current
    }

    set currentAmountHitDice(value) {
        if (Number.isInteger(value) && value <= this.maxHitDice && value >= 0) {
            this._character.stats.hitDice.current = value
            return;
        }
        console.log("ERROR: not enough hit dice")
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