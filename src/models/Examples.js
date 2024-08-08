import {Character} from "@/models/Character.js";

export const exampleCharacter = new Character(undefined, "lz825uz4")
// character personality
exampleCharacter.name = "Owin Belling"
exampleCharacter.age = 29
exampleCharacter.height = "0.99 m"
exampleCharacter.weight = "25 kg"
exampleCharacter.eyeColor = "Blue"
exampleCharacter.hairColor = "green/blueish"
exampleCharacter.skinColor = "Light blue grayish"
exampleCharacter.backstory = "" +
    "Owin is a simple gnome, of a humble bloodline. From child on he has been wondering how the world works. And tinkering with items to create all that he can imagine." +
    "\\n\\n" +
    "At his 28th birthday he departed from his hometown to study the world and learn about other cultures and societies. " +
    "\\n\\n" +
    "By now he has been traveling for almost two years. Enjoying each day where he seas something interesting happening" +
    "\\n\\n" +
    "During his travels he sometimes helped at taverns to earn a meal and a sleeping place. Other times he looked for a temporary job to make means end." +
    "\\n \n" +
    "By now he is searching for a new subject to put his focus on as he just finished a year of study focused on Modron customs"
exampleCharacter.personalityTraits = "" +
    "Loves to study the interaction between creatures\\n" +
    "Often scribbles some things that seem to be nonsense the others"
exampleCharacter.ideals = ""
exampleCharacter.bonds = ""
exampleCharacter.flaws = ""
// character information
exampleCharacter.class = "Artificer"
exampleCharacter.level = 2
exampleCharacter.race = "Rock Gnome"
exampleCharacter.background = "Sage"
exampleCharacter.alignment = "Chaotic good"
exampleCharacter.experiencePoints = "nvt"
exampleCharacter.addLanguage("Common")
exampleCharacter.addLanguage("Gnomish")
exampleCharacter.addLanguage("Modron")
exampleCharacter.addLanguage("...")
exampleCharacter.addFeature("Dark vision")
exampleCharacter.addFeature("Gnome Cunning")
exampleCharacter.addFeature("Artificer's Lore")
exampleCharacter.addFeature("Tinker")
exampleCharacter.addFeature("Researcher")
exampleCharacter.addFeature("Magical Tinkering")
exampleCharacter.addFeature(
    "Infuse Item (lv2)\\n" +
    "* enchanted arcane focus\\n" +
    "* Repeating shot\\n" +
    "* Replicate magical item (bag of holding)\\n" +
    "* Replicate magical item (alchemy jug)"
)

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
exampleCharacter.speed = 25
exampleCharacter.baseHitPoints = 13
exampleCharacter.currentHitPoints = exampleCharacter.hitPointMaximumValue

exampleCharacter.hitDice = "2D8"
exampleCharacter.currentHitDice = 2
exampleCharacter.deathSaveSuccesses = 0
exampleCharacter.deathSaveFailures = 0
exampleCharacter.addAttack("light Crossbow", 4, "1d8", "Piercing")
exampleCharacter.addAttack("Dagger", 4, "1d4", "Piercing")
exampleCharacter.addAttack("Quarterstaff", 0, "1d6", "Bludgeoning")
exampleCharacter.addCantrip("Mending")
exampleCharacter.addCantrip("Guidance")
exampleCharacter.addSpell(1, "Tasha's caustic brew")
exampleCharacter.addPreparedSpell(1, "Tasha's caustic brew")
exampleCharacter.addSpell(1, "Detect Magic (Ritual)")
exampleCharacter.addPreparedSpell(1, "Detect Magic (Ritual)")
exampleCharacter.addSpell(1, "Absorb Element")
exampleCharacter.addPreparedSpell(1, "Absorb Element")
exampleCharacter.addSpell(1, "Feather fall")
exampleCharacter.addPreparedSpell(1, "Feather fall")
exampleCharacter.addSpellSlot(1, 2)
exampleCharacter.addEquipment("Light Crossbow", 1, 5)
exampleCharacter.addEquipment("Bolts", 19, 0.075)
exampleCharacter.addEquipment("Dagger", 1, 1)
exampleCharacter.addEquipment("Quarterstaff", 1, 4)
exampleCharacter.addEquipment("Scale Mail", 1, 45)
exampleCharacter.addEquipment("Thieves' Tools", 1, 1)
exampleCharacter.addEquipment("- small file", 1, 0)
exampleCharacter.addEquipment("- set of lock picks", 1, 0)
exampleCharacter.addEquipment("- small mirror", 1, 0)
exampleCharacter.addEquipment("- set of narrow-bladed scissors", 1, 0)
exampleCharacter.addEquipment("- pair of pliers", 1, 0)
exampleCharacter.addEquipment("Dungeoneer's Pack", 1, 0)
exampleCharacter.addEquipment("- Backpack", 1, 5)
exampleCharacter.addEquipment("- Crowbar", 1, 5)
exampleCharacter.addEquipment("- Hammer", 1, 3)
exampleCharacter.addEquipment("- Pitons", 10, 0.25)
exampleCharacter.addEquipment("- Torches", 10, 1)
exampleCharacter.addEquipment("- Tinderbox", 1, 1)
exampleCharacter.addEquipment("- Rations", 10, 2)
exampleCharacter.addEquipment("- Waterskin (4 pints big)", 1, 5)
exampleCharacter.addEquipment("- Hempen rope (feet)", 50, 0.2)
exampleCharacter.addCoins(25, "GOLD")



