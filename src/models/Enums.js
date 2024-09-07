"use strict"
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

export const armorTypes = [
    "None",
    "Light",
    "Medium",
    "Heavy"
]