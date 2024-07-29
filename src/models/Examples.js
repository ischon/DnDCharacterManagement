import {Character} from "@/models/Character.js";

export const exampleCharacter = new Character()
// character personality
exampleCharacter.name = "Owin Belling"
exampleCharacter.age = 29
exampleCharacter.height = "0.99 m"
exampleCharacter.weight = "25 kg"
exampleCharacter.eyeColor = "Blue"
exampleCharacter.hairColor = "green/blueish"
exampleCharacter.skinColor = "Light blue grayish"
exampleCharacter.backstory = ""+
    "Owin is a simple gnome, of a humble bloodline. From child on he has been wondering how the world works. And tinkering with items to create all that he can imagine." +
    "\n\n" +
    "At his 28th birthday he departed from his hometown to study the world and learn about other cultures and societies. " +
    "\n\n" +
    "By now he has been traveling for almost two years. Enjoying each day where he seas something interesting happening" +
    "\n\n" +
    "During his travels he sometimes helped at taverns to earn a meal and a sleeping place. Other times he looked for a temporary job to make means end." +
    "\n\n" +
    "By now he is searching for a new subject to put his focus on as he just finished a year of study focused on Modron customs"
exampleCharacter.personalityTraits = ""
exampleCharacter.ideals = ""
exampleCharacter.bonds = ""
exampleCharacter.flaws = ""
// character information
exampleCharacter.class = "Artificer"
exampleCharacter.level = 2
exampleCharacter.race = "Rock Gnome"
exampleCharacter.background = "Sage"
exampleCharacter.alignment = "Chaotic Good"
exampleCharacter.experiencePoints = "nvt"
exampleCharacter.addLanguage("Common")
exampleCharacter.addLanguage("Gnomish")
exampleCharacter.addLanguage("Modron")

// character abilities
exampleCharacter.strength = 8
exampleCharacter.dexterity = 14
exampleCharacter.constitution = 16
exampleCharacter.intelligence = 16
exampleCharacter.wisdom = 10
exampleCharacter.charisma = 10
exampleCharacter.proficiencyBonus = 2
exampleCharacter.inspiration = 0
exampleCharacter.proficiencyBonus = 2
exampleCharacter.addProficiency("dexterity", "Sleight of Hand")
exampleCharacter.addProficiency("constitution", "Saving Throws")
exampleCharacter.addProficiency("intelligence", "Saving Throws")
exampleCharacter.addProficiency("intelligence", "Arcana")
exampleCharacter.addProficiency("intelligence", "History")
exampleCharacter.addProficiency("intelligence", "Investigation")
exampleCharacter.armorClassBase = 14
exampleCharacter.armorClassHasDexModifier = true
exampleCharacter.initiativeBase = 2
exampleCharacter.speed = 25
exampleCharacter.baseHitPoints = 13
exampleCharacter.hitDice = "1d8"
exampleCharacter.deathSaveSuccesses = 0
exampleCharacter.deathSaveFailures = 0
exampleCharacter.addAttack("light Crossbow", 4, "1d8", "Piercing")
exampleCharacter.addAttack("Dagger", 4, "1d4", "Piercing")
exampleCharacter.addAttack("Quarterstaff", 0, "1d6", "Bludgeoning")
exampleCharacter.addCantrip("Mending")
exampleCharacter.addCantrip("Guidance")
