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
}

export class CharacterAbilities {
    constructor() {
        this._proficiencyBonus = 0
        this._proficiencies = {
            strength: [],
            dexterity: [],
            constitution: [],
            intelligence: [],
            wisdom: [],
            charisma: []
        }

        this._inspiration = 0

        this._strength = 10
        this._dexterity = 10
        this._constitution = 10
        this._intelligence = 10
        this._wisdom = 10
        this._charisma = 10
    }

    _calculateAbilityModifier(score) {
        return Math.floor((score - 10) / 2)
    }

    get proficiencyBonus() {
        return this._proficiencyBonus;
    }

    set proficiencyBonus(value) {
        this._proficiencyBonus = value;
    }

    get proficiencies() {
        return this._proficiencies;
    }

    get inspiration() {
        return this._inspiration;
    }

    set inspiration(value) {
        this._inspiration = value;
    }

    get strength() {
        return this._strength;
    }

    get strengthModifier() {
        return this._calculateAbilityModifier(this.strength);
    }

    set strength(value) {
        this._strength = value;
    }

    get dexterity() {
        return this._dexterity;
    }

    get dexterityModifier() {
        return this._calculateAbilityModifier(this.dexterity);
    }

    set dexterity(value) {
        this._dexterity = value;
    }

    get constitution() {
        return this._constitution;
    }

    get constitutionModifier() {
        return this._calculateAbilityModifier(this.constitution);
    }

    set constitution(value) {
        this._constitution = value;
    }

    get intelligence() {
        return this._intelligence;
    }

    get intelligenceModifier() {
        return this._calculateAbilityModifier(this.intelligence);
    }

    set intelligence(value) {
        this._intelligence = value;
    }

    get wisdom() {
        return this._wisdom;
    }

    get passivePerception() {
        return this.wisdom
    }

    get wisdomModifier() {
        return this._calculateAbilityModifier(this.wisdom);
    }

    set wisdom(value) {
        this._wisdom = value;
    }

    get charisma() {
        return this._charisma;
    }

    get charismaModifier() {
        return this._calculateAbilityModifier(this.charisma);
    }

    set charisma(value) {
        this._charisma = value;
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
}