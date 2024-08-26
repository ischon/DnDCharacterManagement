import {Character} from "@/models/Character.js";

export const owin = new Character(undefined, "lz825uz4")
// character personality
owin.name = "Owin Belling"
owin.age = 29
owin.height = 4
owin.weight = 44
owin.eyeColor = "Blue"
owin.hairColor = "green/blueish"
owin.skinColor = "Light blue grayish"
owin.backstory = "" +
    "Owin is a simple gnome, of a humble bloodline. From child on he has been wondering how the world works. And tinkering with items to create all that he can imagine." +
    "\n\n" +
    "At his 28th birthday he departed from his hometown to study the world and learn about other cultures and societies. " +
    "\n\n" +
    "By now he has been traveling for almost two years. Enjoying each day where he seas something interesting happening" +
    "\n\n" +
    "During his travels he sometimes helped at taverns to earn a meal and a sleeping place. Other times he looked for a temporary job to make means end." +
    "\n\n" +
    "By now he is searching for a new subject to put his focus on as he just finished a year of study focused on Modron customs"
owin.personalityTraits = "" +
    "Loves to study the interaction between creatures, often scribbles some things that seem to be nonsense the others" +
    "\n\n" +
    "I'm used to helping out those who aren't as smart as I am, and I patiently explain anything and everything to others."
owin.ideals = "" +
    "Knowledge. The path to power and self-improvement is through knowledge." +
    "\n\n" +
    "Kindness. By understanding other creatures, we learn to understand ourselves."
owin.bonds = "" +
    "I keep a journal where I record my observations about other creatures, and I would be devastated if I ever lost it. My entire life's work is in those pages." +
    "\n\n" +
    "I made a promise to a dying scholar to continue their research, and their notes are hidden within my journal. I’m determined to fulfill that promise, no matter the cost."
owin.flaws = "" +
    "Most people scream and run when they see a demon. I stop and take notes on its anatomy."
owin.allies = "" +
    "Backstory:\n" +
    "- Melliwyn Geargrinder - Colleague and dear friend from before my travels, gotten a letter suggesting she is in danger or might have passed on already\n" +
    "\n" +
    "Allies: \n" +
    "- Captain Pier Monocker - is a captain working for the Thornberrow Trading Company. Has offered to help if ever needing to travel by ship, instruction is to knock twice on the door of his cabin\n" +
    "\n" +
    "Companies: \n" +
    "- Thornberrow Trading Company - Big company at the docks in Babble brook\n" +
    "\n" +
    "Enemies: \n" +
    "- Local Bandit - HP 7 - AC 15 - Speed 30\n" +
    "\n" +
    "Passerby's: \n" +
    "Dotty - Assistant at the Thornberrow Trading Company\n" +
    "Oswald Thornberrow - Owner of the Thornberrow Trading Company\n"

owin.class = "Artificer" // // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.level = 2
owin.race = "Rock Gnome" // https://www.dndbeyond.com/races/18-gnome
owin.background = "Sage" // https://www.dndbeyond.com/backgrounds/11-sage
owin.alignment = "Chaotic good"
owin.experiencePoints = 0
owin.addLanguage("Common") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits// https://forgottenrealms.fandom.com/wiki/Common
owin.addLanguage("Gnomish (Dwarvish script)") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits // https://forgottenrealms.fandom.com/wiki/Gnome_language
owin.addLanguage("Modron") // study // https://www.dndbeyond.com/backgrounds/11-sage // https://forgottenrealms.fandom.com/wiki/Modron_language
owin.addLanguage("... Draconic (Iokharic script)?") // ... // https://www.dndbeyond.com/backgrounds/11-sage // https://forgottenrealms.fandom.com/wiki/Draconic_language
owin.addFeature("Dark vision") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits
owin.addFeature("Gnome Cunning") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits
owin.addFeature("Artificer's Lore") // https://www.dndbeyond.com/races/18-gnome#RockGnome
owin.addFeature("Tinker") // https://www.dndbeyond.com/races/18-gnome#RockGnome
owin.addFeature("Researcher")
owin.addFeature("Magical Tinkering") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addFeature(
    "Infuse Item (lv2)\n" + // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
    "* enchanted arcane focus\n" +
    "* Repeating shot\n" +
    "* Replicate magical item (bag of holding)\n" +
    "* Replicate magical item (alchemy jug)"
)

// character abilities
owin.strength = 8
owin.dexterity = 14
owin.constitution = 16
owin.intelligence = 16
owin.wisdom = 10
owin.charisma = 10
owin.inspiration = 0
owin.addProficiency("constitution", "Saving Throws") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addProficiency("intelligence", "Saving Throws") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addProficiency("intelligence", "Investigation") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addProficiency("intelligence", "Arcana") // https://www.dndbeyond.com/backgrounds/11-sage
owin.addProficiency("intelligence", "History") // https://www.dndbeyond.com/backgrounds/11-sage
owin.addProficiency("dexterity", "Sleight of Hand")  // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addProficiency("items", "Armor: Light armor, medium armor, shields") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addProficiency("items", "Weapons: Simple weapons") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addProficiency("items", "Tools: Thieves' tools, tinker’s tools, one type of artisan’s tools of your choice") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addProficiency("items", "Artisan’s tools (tinker’s tools)") // https://www.dndbeyond.com/races/18-gnome#RockGnome
owin.armorClassBase = 14
owin.armorClassHasDexModifier = true
owin.speed = 25
owin.baseHitPoints = 13
owin.currentHitPoints = owin.hitPointMaximumValue

owin.hitDice = "2D8"
owin.deathSaveSuccesses = 0
owin.deathSaveFailures = 0
owin.addAttack("light Crossbow", 4, "1d8 + 4", "Piercing") // https://roll20.net/compendium/dnd5e/Light%20Crossbow#content
owin.addAttack("Dagger", 4, "1d4 + 4", "Piercing") // https://roll20.net/compendium/dnd5e/Items:Dagger/#h-Dagger
owin.addAttack("Quarterstaff", 0, "1d6 (1d8)", "Bludgeoning") //https://roll20.net/compendium/dnd5e/Items:Quarterstaff/#h-Quarterstaff
owin.spellcastingClass = "Artificer"
owin.spellcastingAbility = "intelligence"
owin.addCantrip("Mending")
owin.addCantrip("Guidance")
owin.addSpell(1, "Tasha's caustic brew")
owin.addPreparedSpell(1, "Tasha's caustic brew")
owin.addSpell(1, "Detect Magic (Ritual)")
owin.addPreparedSpell(1, "Detect Magic (Ritual)")
owin.addSpell(1, "Absorb Element")
owin.addPreparedSpell(1, "Absorb Element")
owin.addSpell(1, "Feather fall")
owin.addPreparedSpell(1, "Feather fall")
owin.addSpellSlot(1, 2)
owin.addEquipment("Light Crossbow", 1, 5) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addEquipment("Bolts", 19, 0.075) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addEquipment("Dagger", 1, 1) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addEquipment("Quarterstaff", 1, 4) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addEquipment("Scale Mail", 1, 45) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addEquipment("Thieves' Tools", 1, 1) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addEquipment("- Small file", 1, 0)
owin.addEquipment("- Set of lock picks", 1, 0)
owin.addEquipment("- Small mirror", 1, 0)
owin.addEquipment("- Set of narrow-bladed scissors", 1, 0)
owin.addEquipment("- Pair of pliers", 1, 0)
owin.addEquipment("Dungeoneer's Pack", 1, 0) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
owin.addEquipment("- Backpack", 1, 5)
owin.addEquipment("- Crowbar", 1, 5)
owin.addEquipment("- Hammer", 1, 3)
owin.addEquipment("- Pitons", 10, 0.25)
owin.addEquipment("- Torches", 10, 1)
owin.addEquipment("- Tinderbox", 1, 1)
owin.addEquipment("- Rations", 10, 2)
owin.addEquipment("- Waterskin (4 pints big)", 1, 5)
owin.addEquipment("- Hempen rope (feet)", 50, 0.2)
owin.addEquipment("Bottle of ink", 1, 0.0652) // https://www.dndbeyond.com/backgrounds/11-sage
owin.addEquipment("Quill", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
owin.addEquipment("Small knife", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
owin.addEquipment("Letter from a dead colleague posing a question you have not yet been able to answer https://t.ly/Ehh25", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
owin.addEquipment("Set of common clothes", 1, 3) // https://www.dndbeyond.com/backgrounds/11-sage
owin.addEquipment("Belt pouch", 1, 1) // https://www.dndbeyond.com/backgrounds/11-sage
// https://www.dndbeyond.com/equipment/7-book as a journal mentioned in the backstory
owin.addEquipment("Book (Journal)", 1, 5) // backstory
owin.addCoins(25, "GOLD")

export const exampleCharacter = new Character(undefined, "lzrh8rb4")
exampleCharacter.name = "Brevnick"
exampleCharacter.class = "Cleric"
exampleCharacter.level = 1
exampleCharacter.background = "Soldier"
exampleCharacter.race = "Hill Dwarf"
exampleCharacter.height = 4
exampleCharacter.weight = 130
exampleCharacter.age = 75
exampleCharacter.eyeColor = "Brown"
exampleCharacter.hairColor = "Black"
exampleCharacter.skinColor = "Pale"
exampleCharacter.alignment = "Lawful good"
exampleCharacter.experiencePoints = 0
exampleCharacter.addCoins(10, "GOLD")
exampleCharacter.addLanguage("Common")
exampleCharacter.addLanguage("Dwarvish")
exampleCharacter.addLanguage("Elvish")
exampleCharacter.addLanguage("Goblin")
exampleCharacter.addProficiency("wisdom", "Saving Throws")
exampleCharacter.addProficiency("charisma", "Saving Throws")
exampleCharacter.addProficiency("strength", "Athletics")
exampleCharacter.addProficiency("charisma", "Intimidation")
exampleCharacter.addProficiency("wisdom", "Medicine")
exampleCharacter.addProficiency("intelligence", "Religion")
exampleCharacter.strength = 14
exampleCharacter.dexterity = 8
exampleCharacter.constitution = 15
exampleCharacter.intelligence = 10
exampleCharacter.wisdom = 16
exampleCharacter.charisma = 12
exampleCharacter.inspiration = 0
exampleCharacter.armorClassBase = 14
exampleCharacter.armorClassHasDexModifier = true
exampleCharacter.armorClassShield = 2
exampleCharacter.speed = 25
exampleCharacter.baseHitPoints = 8
exampleCharacter.hitPointsMisc = 1
exampleCharacter.currentHitPoints = exampleCharacter.hitPointMaximumValue
exampleCharacter.hitDice = "1D8"
exampleCharacter.addAttack("Mace", 4, "1d6 + 2", "Bludgeoning")
exampleCharacter.addAttack("Handaxe", 4, "1d6 + 2", "Slashing")
exampleCharacter.addFeature("Divine Domain")
exampleCharacter.addFeature("Disciple of Life")
exampleCharacter.addFeature("Darkvision")
exampleCharacter.addFeature("Dwarven Resilience")
exampleCharacter.addFeature("Stonecunning")
exampleCharacter.addFeature("Dwarven Toughness")
exampleCharacter.addFeature("Heavy Armor")
exampleCharacter.spellcastingClass = "Cleric"
exampleCharacter.spellcastingAbility = "wisdom"
exampleCharacter.addCantrip("Light")
exampleCharacter.addCantrip("Thaumaturgy")
exampleCharacter.addCantrip("Sacred flame")
exampleCharacter.addSpellSlot(1, 2)
exampleCharacter.addSpell(1, "Bless")
exampleCharacter.addPreparedSpell(1, "Bless")
exampleCharacter.addSpell(1, "Cure wounds")
exampleCharacter.addPreparedSpell(1, "Cure wounds")
exampleCharacter.addSpell(1, "Detect magic (ritual)")
exampleCharacter.addPreparedSpell(1, "Detect magic (ritual)")
exampleCharacter.addSpell(1, "Healing word")
exampleCharacter.addPreparedSpell(1, "Healing word")
exampleCharacter.addSpell(1, "Sanctuary")
exampleCharacter.addPreparedSpell(1, "Sanctuary")
exampleCharacter.addSpell(1, "Command")
exampleCharacter.addPreparedSpell(1, "Command")
exampleCharacter.backstory = "" +
    "You trained as a soldier on the island of Mintarn and joined a mercenary company." +
    " You traveled to the city of Neverwinter with your company to serve in both the army and city watch." +
    " Over time, you grew disillusioned with many of your fellow soldiers." +
    " They seemed to enjoy their authority at the expense of the people they’re supposed to protect." +
    "\n\n" +
    "Your background shaped your character in important ways." +
    " You learned several languages in the course of your military career." +
    " Your skill proficiencies in Athletics and Intimidation reflect your physical training and an ability to overawe foes." +
    "\n\n" +
    " Recently you’ve had dreams of a shadow creeping across the sea like a shroud, swallowing an island in darkness." +
    " Though you dismissed the dreams at first, you began to hear a voice calling you to stand against death’s endless hunger." +
    " Certain of your deity’s wishes, you resigned your post and set out on your quest" +
    "\n\n" +
    "Banish a Shadow of Death." +
    "\n" +
    "Researching images from your dreams pointed you to Stormwreck Isle, not far from Neverwinter." +
    " A remote cloister there holds a temple to the dragon god Bahamut, who is a patron of heroes and a champion of justice." +
    " Someone at the cloister may hold the key to the impending doom your deity wishes you to avert."
exampleCharacter.allies = "" +
    "Deity\n" +
    "- Marthammor Duin" +
    "\n\n" +
    "Organizations\n" +
    "- The army of Mintarn"
exampleCharacter.addEquipment("Chain mail", 1, 55)
exampleCharacter.addEquipment("Shield", 1, 6)
exampleCharacter.addEquipment("Mace", 1, 4)
exampleCharacter.addEquipment("Handaxe", 1, 2)
exampleCharacter.addEquipment("Holy symbol", 1, 1)
exampleCharacter.addEquipment("Backpack", 1, 5)
exampleCharacter.addEquipment("Bedroll", 1, 7)
exampleCharacter.addEquipment("Mess kit", 1, 1)
exampleCharacter.addEquipment("Tinderbox", 1, 1)
exampleCharacter.addEquipment("Torches", 10, 0.5)
exampleCharacter.addEquipment("Rations", 10, 2)
exampleCharacter.addEquipment("Waterskin", 1, 5)
exampleCharacter.addEquipment("Hempen rope", 50, 0.2)
exampleCharacter.addEquipment("Insignia of rank", 1, 0)
exampleCharacter.addEquipment("Broken blade taken as a trophy from a fallen enemy", 1, 2)
exampleCharacter.addEquipment("Set of bone dice", 1, 0)
exampleCharacter.addEquipment("Set of common clothes", 1, 3)
exampleCharacter.addEquipment("Pouch", 1, 1)
exampleCharacter.treasure = "" +
    "Broken blade taken as a trophy from a fallen enemy"






