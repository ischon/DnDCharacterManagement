import * as console from "console";
import {CharacterAbilities} from "@/models/CharacterAbilities.js";

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
]

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
]

export class Character {


    constructor() {
        this._name = ""
        this._class = ""
        this._level = 0
        this._race = ""
        this._background = ""
        this._alignment = ""
        this._experiencePoints = 0
        this._stats = new CharacterAbilities()
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get class() {
        return this._class;
    }

    set class(value) {
        if (classes.includes(value)){
            this._class = value;
        }
        else {
            console.log("ERROR: class is not in the known list")
        }
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    get race() {
        return this._race;
    }

    set race(value) {
        this._race = value;
    }

    get background() {
        return this._background;
    }

    set background(value) {
        this._background = value;
    }

    get alignment() {
        return this._alignment;
    }

    set alignment(value) {
        if (alignments.includes(value)){
            this._alignment = value;
        }
        else {
            console.log("ERROR: alignment is not in the known list")
        }
    }

    get experiencePoints() {
        return this._experiencePoints;
    }

    set experiencePoints(value) {
        this._experiencePoints = value;
    }

    get stats() {
        return this._stats;
    }
}