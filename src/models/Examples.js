import {Character} from "@/models/Character.js";

// export const owin = new Character(undefined, "lz825uz4")
// // character personality
// owin.detail.name = "Owin Belling"
// owin.detail.age = 29
// owin.detail.height = 4
// owin.detail.weight = 44
// owin.detail.eyeColor = "Blue"
// owin.detail.hairColor = "green/blueish"
// owin.detail.skinColor = "Light blue grayish"
// owin.detail.backstory = "" +
//     "Owin is a simple gnome, of a humble bloodline. From child on he has been wondering how the world works. And tinkering with items to create all that he can imagine." +
//     "\n\n" +
//     "At his 28th birthday he departed from his hometown to study the world and learn about other cultures and societies. " +
//     "\n\n" +
//     "By now he has been traveling for almost two years. Enjoying each day where he seas something interesting happening" +
//     "\n\n" +
//     "During his travels he sometimes helped at taverns to earn a meal and a sleeping place. Other times he looked for a temporary job to make means end." +
//     "\n\n" +
//     "By now he is searching for a new subject to put his focus on as he just finished a year of study focused on Modron customs"
// owin.detail.personalityTraits = "" +
//     "Loves to study the interaction between creatures, often scribbles some things that seem to be nonsense the others" +
//     "\n\n" +
//     "I'm used to helping out those who aren't as smart as I am, and I patiently explain anything and everything to others."
// owin.detail.ideals = "" +
//     "Knowledge. The path to power and self-improvement is through knowledge." +
//     "\n\n" +
//     "Kindness. By understanding other creatures, we learn to understand ourselves."
// owin.detail.bonds = "" +
//     "I keep a journal where I record my observations about other creatures, and I would be devastated if I ever lost it. My entire life's work is in those pages." +
//     "\n\n" +
//     "I made a promise to a dying scholar to continue their research, and their notes are hidden within my journal. I’m determined to fulfill that promise, no matter the cost."
// owin.detail.flaws = "" +
//     "Most people scream and run when they see a demon. I stop and take notes on its anatomy."
// owin.detail.allies = "" +
//     "Backstory:\n" +
//     "- Melliwyn Geargrinder - Colleague and dear friend from before my travels, gotten a letter suggesting she is in danger or might have passed on already\n" +
//     "\n" +
//     "Allies: \n" +
//     "- Captain Pier Monocker - is a captain working for the Thornberrow Trading Company. Has offered to help if ever needing to travel by ship, instruction is to knock twice on the door of his cabin\n" +
//     "\n" +
//     "Companies: \n" +
//     "- Thornberrow Trading Company - Big company at the docks in Babble brook\n" +
//     "\n" +
//     "Enemies: \n" +
//     "- Local Bandit - HP 7 - AC 15 - Speed 30\n" +
//     "\n" +
//     "Passerby's: \n" +
//     "Dotty - Assistant at the Thornberrow Trading Company\n" +
//     "Oswald Thornberrow - Owner of the Thornberrow Trading Company\n"
//
// owin.detail.class = "Artificer" // // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.detail.level = 2
// owin.detail.race = "Rock Gnome" // https://www.dndbeyond.com/races/18-gnome
// owin.detail.background = "Sage" // https://www.dndbeyond.com/backgrounds/11-sage
// owin.detail.alignment = "Chaotic good"
// owin.detail.experiencePoints = 0
// owin.language.add("Common") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits// https://forgottenrealms.fandom.com/wiki/Common
// owin.language.add("Gnomish (Dwarvish script)") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits // https://forgottenrealms.fandom.com/wiki/Gnome_language
// owin.language.add("Modron") // study // https://www.dndbeyond.com/backgrounds/11-sage // https://forgottenrealms.fandom.com/wiki/Modron_language
// owin.language.add("... Draconic (Iokharic script)?") // ... // https://www.dndbeyond.com/backgrounds/11-sage // https://forgottenrealms.fandom.com/wiki/Draconic_language
// owin.feature.add("Dark vision") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits
// owin.feature.add("Gnome Cunning") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits
// owin.feature.add("Artificer's Lore") // https://www.dndbeyond.com/races/18-gnome#RockGnome
// owin.feature.add("Tinker") // https://www.dndbeyond.com/races/18-gnome#RockGnome
// owin.feature.add("Researcher")
// owin.feature.add("Magical Tinkering") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.feature.add(
//     "Infuse Item (lv2)\n" + // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
//     "* enchanted arcane focus\n" +
//     "* Repeating shot\n" +
//     "* Replicate magical item (bag of holding)\n" +
//     "* Replicate magical item (alchemy jug)"
// )
//
// // character abilities
// owin.strength = 8
// owin.dexterity = 14
// owin.constitution = 16
// owin.intelligence = 16
// owin.wisdom = 10
// owin.charisma = 10
// owin.inspiration = 0
// owin.proficiency.add("constitution", "Saving Throws") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiency.add("intelligence", "Saving Throws") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiency.add("intelligence", "Investigation") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiency.add("intelligence", "Arcana") // https://www.dndbeyond.com/backgrounds/11-sage
// owin.proficiency.add("intelligence", "History") // https://www.dndbeyond.com/backgrounds/11-sage
// owin.proficiency.add("dexterity", "Sleight of Hand")  // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiency.add("items", "Armor: Light armor, medium armor, shields") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiency.add("items", "Weapons: Simple weapons") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiency.add("items", "Tools: Thieves' tools, tinker’s tools, one type of artisan’s tools of your choice") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiency.add("items", "Artisan’s tools (tinker’s tools)") // https://www.dndbeyond.com/races/18-gnome#RockGnome
// owin.armorClassBase = 14
// owin.armorClassHasDexModifier = true
// owin.speed = 25
// owin.baseHitPoints = 13
// owin.currentHitPoints = owin.hitPointMaximumValue
//
// owin.hitDice = "2D8"
// owin.deathSaveSuccesses = 0
// owin.deathSaveFailures = 0
// owin.attack.add("light Crossbow", 4, "1d8 + 4", "Piercing") // https://roll20.net/compendium/dnd5e/Light%20Crossbow#content
// owin.attack.add("Dagger", 4, "1d4 + 4", "Piercing") // https://roll20.net/compendium/dnd5e/Items:Dagger/#h-Dagger
// owin.attack.add("Quarterstaff", 0, "1d6 (1d8)", "Bludgeoning") //https://roll20.net/compendium/dnd5e/Items:Quarterstaff/#h-Quarterstaff
// owin.spellcasting.class = "Artificer"
// owin.spellcasting.ability = "intelligence"
// owin.spellcasting.cantrip.add("Mending")
// owin.spellcasting.cantrip.add("Guidance")
// owin.spellcasting.spell.add(1, "Tasha's caustic brew")
// owin.spellcasting.spell.prepared.add(1, "Tasha's caustic brew")
// owin.spellcasting.spell.add(1, "Detect Magic (Ritual)")
// owin.spellcasting.spell.prepared.add(1, "Detect Magic (Ritual)")
// owin.spellcasting.spell.add(1, "Absorb Element")
// owin.spellcasting.spell.prepared.add(1, "Absorb Element")
// owin.spellcasting.spell.add(1, "Feather fall")
// owin.spellcasting.spell.prepared.add(1, "Feather fall")
// owin._character.spellcasting.spells[1].spellSlots = 2
// owin.equipment.add("Light Crossbow", 1, 5) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipment.add("Bolts", 19, 0.075) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipment.add("Dagger", 1, 1) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipment.add("Quarterstaff", 1, 4) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipment.add("Scale Mail", 1, 45) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipment.add("Thieves' Tools", 1, 1) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipment.add("- Small file", 1, 0)
// owin.equipment.add("- Set of lock picks", 1, 0)
// owin.equipment.add("- Small mirror", 1, 0)
// owin.equipment.add("- Set of narrow-bladed scissors", 1, 0)
// owin.equipment.add("- Pair of pliers", 1, 0)
// owin.equipment.add("Dungeoneer's Pack", 1, 0) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipment.add("- Backpack", 1, 5)
// owin.equipment.add("- Crowbar", 1, 5)
// owin.equipment.add("- Hammer", 1, 3)
// owin.equipment.add("- Pitons", 10, 0.25)
// owin.equipment.add("- Torches", 10, 1)
// owin.equipment.add("- Tinderbox", 1, 1)
// owin.equipment.add("- Rations", 10, 2)
// owin.equipment.add("- Waterskin (4 pints big)", 1, 5)
// owin.equipment.add("- Hempen rope (feet)", 50, 0.2)
// owin.equipment.add("Bottle of ink", 1, 0.0652) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipment.add("Quill", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipment.add("Small knife", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipment.add("Letter from a dead colleague posing a question you have not yet been able to answer https://t.ly/Ehh25", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipment.add("Set of common clothes", 1, 3) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipment.add("Belt pouch", 1, 1) // https://www.dndbeyond.com/backgrounds/11-sage
// // https://www.dndbeyond.com/equipment/7-book as a journal mentioned in the backstory
// owin.equipment.add("Book (Journal)", 1, 5) // backstory
// owin.equipment.coin.add(25, "GOLD")

export const exampleCharacter = new Character(undefined, "lzrh8rb4")
exampleCharacter.detail.name = "Brevnick"
exampleCharacter.detail.class = "Cleric"
exampleCharacter.detail.level = 1
exampleCharacter.detail.background = "Soldier"
exampleCharacter.detail.race = "Hill Dwarf"
exampleCharacter.detail.height = 4
exampleCharacter.detail.weight = 130
exampleCharacter.detail.age = 75
exampleCharacter.detail.eyeColor = "Brown"
exampleCharacter.detail.hairColor = "Black"
exampleCharacter.detail.skinColor = "Pale"
exampleCharacter.detail.alignment = "Lawful good"
exampleCharacter.detail.experiencePoints = 0
exampleCharacter.equipment.coin.add(10, "GOLD")
exampleCharacter.language.add("Common")
exampleCharacter.language.add("Dwarvish")
exampleCharacter.language.add("Elvish")
exampleCharacter.language.add("Goblin")
exampleCharacter.proficiency.add("wisdom", "Saving Throws")
exampleCharacter.proficiency.add("charisma", "Saving Throws")
exampleCharacter.proficiency.add("strength", "Athletics")
exampleCharacter.proficiency.add("charisma", "Intimidation")
exampleCharacter.proficiency.add("wisdom", "Medicine")
exampleCharacter.proficiency.add("intelligence", "Religion")
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
exampleCharacter.attack.add("Mace", 4, "1d6 + 2", "Bludgeoning")
exampleCharacter.attack.add("Handaxe", 4, "1d6 + 2", "Slashing")
exampleCharacter.feature.add("Divine Domain")
exampleCharacter.feature.add("Disciple of Life")
exampleCharacter.feature.add("Darkvision")
exampleCharacter.feature.add("Dwarven Resilience")
exampleCharacter.feature.add("Stonecunning")
exampleCharacter.feature.add("Dwarven Toughness")
exampleCharacter.feature.add("Heavy Armor")
exampleCharacter.spellcasting.class = "Cleric"
exampleCharacter.spellcasting.ability = "wisdom"
exampleCharacter.spellcasting.cantrip.add("Light")
exampleCharacter.spellcasting.cantrip.add("Thaumaturgy")
exampleCharacter.spellcasting.cantrip.add("Sacred flame")
exampleCharacter.spellcasting.spell[1].slots = 2
exampleCharacter.spellcasting.spell[1].add("Bless")
exampleCharacter.spellcasting.spell[1].prepared.add("Bless")
exampleCharacter.spellcasting.spell[1].add("Cure wounds")
exampleCharacter.spellcasting.spell[1].prepared.add("Cure wounds")
exampleCharacter.spellcasting.spell[1].add("Detect magic (ritual)")
exampleCharacter.spellcasting.spell[1].prepared.add("Detect magic (ritual)")
exampleCharacter.spellcasting.spell[1].add("Healing word")
exampleCharacter.spellcasting.spell[1].prepared.add("Healing word")
exampleCharacter.spellcasting.spell[1].add("Sanctuary")
exampleCharacter.spellcasting.spell[1].prepared.add("Sanctuary")
exampleCharacter.spellcasting.spell[1].add("Command")
exampleCharacter.spellcasting.spell[1].prepared.add("Command")
exampleCharacter.detail.backstory = "" +
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
exampleCharacter.detail.allies = "" +
    "Deity\n" +
    "- Marthammor Duin" +
    "\n\n" +
    "Organizations\n" +
    "- The army of Mintarn"
exampleCharacter.equipment.add("Chain mail", 1, 55)
exampleCharacter.equipment.add("Shield", 1, 6)
exampleCharacter.equipment.add("Mace", 1, 4)
exampleCharacter.equipment.add("Handaxe", 1, 2)
exampleCharacter.equipment.add("Holy symbol", 1, 1)
exampleCharacter.equipment.add("Backpack", 1, 5)
exampleCharacter.equipment.add("Bedroll", 1, 7)
exampleCharacter.equipment.add("Mess kit", 1, 1)
exampleCharacter.equipment.add("Tinderbox", 1, 1)
exampleCharacter.equipment.add("Torches", 10, 0.5)
exampleCharacter.equipment.add("Rations", 10, 2)
exampleCharacter.equipment.add("Waterskin", 1, 5)
exampleCharacter.equipment.add("Hempen rope", 50, 0.2)
exampleCharacter.equipment.add("Insignia of rank", 1, 0)
exampleCharacter.equipment.add("Broken blade taken as a trophy from a fallen enemy", 1, 2)
exampleCharacter.equipment.add("Set of bone dice", 1, 0)
exampleCharacter.equipment.add("Set of common clothes", 1, 3)
exampleCharacter.equipment.add("Pouch", 1, 1)
exampleCharacter.treasure = "" +
    "Broken blade taken as a trophy from a fallen enemy"






