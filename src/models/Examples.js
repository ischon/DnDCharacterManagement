import {Character} from "@/models/Character.js";

// export const owin = new Character(undefined, "lz825uz4")
// // character personality
// owin.detailName = "Owin Belling"
// owin.detailAge = 29
// owin.detailHeight = 4
// owin.detailWeight = 44
// owin.detailEyeColor = "Blue"
// owin.detailHairColor = "green/blueish"
// owin.detailSkinColor = "Light blue grayish"
// owin.detailBackstory = "" +
//     "Owin is a simple gnome, of a humble bloodline. From child on he has been wondering how the world works. And tinkering with items to create all that he can imagine." +
//     "\n\n" +
//     "At his 28th birthday he departed from his hometown to study the world and learn about other cultures and societies. " +
//     "\n\n" +
//     "By now he has been traveling for almost two years. Enjoying each day where he seas something interesting happening" +
//     "\n\n" +
//     "During his travels he sometimes helped at taverns to earn a meal and a sleeping place. Other times he looked for a temporary job to make means end." +
//     "\n\n" +
//     "By now he is searching for a new subject to put his focus on as he just finished a year of study focused on Modron customs"
// owin.detailPersonalityTraits = "" +
//     "Loves to study the interaction between creatures, often scribbles some things that seem to be nonsense the others" +
//     "\n\n" +
//     "I'm used to helping out those who aren't as smart as I am, and I patiently explain anything and everything to others."
// owin.detailIdeals = "" +
//     "Knowledge. The path to power and self-improvement is through knowledge." +
//     "\n\n" +
//     "Kindness. By understanding other creatures, we learn to understand ourselves."
// owin.detailBonds = "" +
//     "I keep a journal where I record my observations about other creatures, and I would be devastated if I ever lost it. My entire life's work is in those pages." +
//     "\n\n" +
//     "I made a promise to a dying scholar to continue their research, and their notes are hidden within my journal. I’m determined to fulfill that promise, no matter the cost."
// owin.detailFlaws = "" +
//     "Most people scream and run when they see a demon. I stop and take notes on its anatomy."
// owin.detailAllies = "" +
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
// owin.detailClass = "Artificer" // // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.detailLevel = 2
// owin.detailRace = "Rock Gnome" // https://www.dndbeyond.com/races/18-gnome
// owin.detailBackground = "Sage" // https://www.dndbeyond.com/backgrounds/11-sage
// owin.detailAlignment = "Chaotic good"
// owin.detailExperiencePoints = 0
// owin.languageAdd("Common") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits// https://forgottenrealms.fandom.com/wiki/Common
// owin.languageAdd("Gnomish (Dwarvish script)") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits // https://forgottenrealms.fandom.com/wiki/Gnome_language
// owin.languageAdd("Modron") // study // https://www.dndbeyond.com/backgrounds/11-sage // https://forgottenrealms.fandom.com/wiki/Modron_language
// owin.languageAdd("... Draconic (Iokharic script)?") // ... // https://www.dndbeyond.com/backgrounds/11-sage // https://forgottenrealms.fandom.com/wiki/Draconic_language
// owin.featureAdd("Dark vision") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits
// owin.featureAdd("Gnome Cunning") // https://www.dndbeyond.com/races/18-gnome#GnomeTraits
// owin.featureAdd("Artificer's Lore") // https://www.dndbeyond.com/races/18-gnome#RockGnome
// owin.featureAdd("Tinker") // https://www.dndbeyond.com/races/18-gnome#RockGnome
// owin.featureAdd("Researcher")
// owin.featureAdd("Magical Tinkering") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.featureAdd(
//     "Infuse Item (lv2)\n" + // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
//     "* enchanted arcane focus\n" +
//     "* Repeating shot\n" +
//     "* Replicate magical item (bag of holding)\n" +
//     "* Replicate magical item (alchemy jug)"
// )
//
// // character abilities
// owin.abilityStrength = 8
// owin.abilityDexterity = 14
// owin.abilityConstitution = 16
// owin.abilityIntelligence = 16
// owin.abilityWisdom = 10
// owin.abilityCharisma = 10
// owin.abilityInspiration = 0
// owin.proficiencyAdd("constitution", "Saving Throws") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiencyAdd("intelligence", "Saving Throws") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiencyAdd("intelligence", "Investigation") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiencyAdd("intelligence", "Arcana") // https://www.dndbeyond.com/backgrounds/11-sage
// owin.proficiencyAdd("intelligence", "History") // https://www.dndbeyond.com/backgrounds/11-sage
// owin.proficiencyAdd("dexterity", "Sleight of Hand")  // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiencyAdd("items", "Armor: Light armor, medium armor, shields") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiencyAdd("items", "Weapons: Simple weapons") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiencyAdd("items", "Tools: Thieves' tools, tinker’s tools, one type of artisan’s tools of your choice") // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.proficiencyAdd("items", "Artisan’s tools (tinker’s tools)") // https://www.dndbeyond.com/races/18-gnome#RockGnome
// owin.statArmorClassBase = 14
// owin.statArmorClassHasDexModifier = true
// owin.statSpeed = 25
// owin.statHitPointsBase = 13
// owin.statHitPointsCurrent = owin.statHitPointMaximumValue
//
// owin.statHitDie = "2D8"
// owin.deathSaveSuccesses = 0
// owin.deathSaveFailures = 0
// owin.attackAdd("light Crossbow", 4, "1d8 + 4", "Piercing") // https://roll20.net/compendium/dnd5e/Light%20Crossbow#content
// owin.attackAdd("Dagger", 4, "1d4 + 4", "Piercing") // https://roll20.net/compendium/dnd5e/Items:Dagger/#h-Dagger
// owin.attackAdd("Quarterstaff", 0, "1d6 (1d8)", "Bludgeoning") //https://roll20.net/compendium/dnd5e/Items:Quarterstaff/#h-Quarterstaff
// owin.spellcasting.class = "Artificer"
// owin.spellcasting.ability = "intelligence"
// owin.spellcastingCantripAdd("Mending")
// owin.spellcastingCantripAdd("Guidance")
// owin.spellcasting.spell.add(1, "Tasha's caustic brew")
// owin.spellcasting.spell.prepared.add(1, "Tasha's caustic brew")
// owin.spellcasting.spell.add(1, "Detect Magic (Ritual)")
// owin.spellcasting.spell.prepared.add(1, "Detect Magic (Ritual)")
// owin.spellcasting.spell.add(1, "Absorb Element")
// owin.spellcasting.spell.prepared.add(1, "Absorb Element")
// owin.spellcasting.spell.add(1, "Feather fall")
// owin.spellcasting.spell.prepared.add(1, "Feather fall")
// owin._character.spellcasting.spells[1].spellSlots = 2
// owin.equipmentAdd("Light Crossbow", 1, 5) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipmentAdd("Bolts", 19, 0.075) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipmentAdd("Dagger", 1, 1) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipmentAdd("Quarterstaff", 1, 4) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipmentAdd("Scale Mail", 1, 45) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipmentAdd("Thieves' Tools", 1, 1) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipmentAdd("- Small file", 1, 0)
// owin.equipmentAdd("- Set of lock picks", 1, 0)
// owin.equipmentAdd("- Small mirror", 1, 0)
// owin.equipmentAdd("- Set of narrow-bladed scissors", 1, 0)
// owin.equipmentAdd("- Pair of pliers", 1, 0)
// owin.equipmentAdd("Dungeoneer's Pack", 1, 0) // https://drive.google.com/file/d/1QVK2-rkohWcVEocqfJSrUD59ipcG_Y-Q
// owin.equipmentAdd("- Backpack", 1, 5)
// owin.equipmentAdd("- Crowbar", 1, 5)
// owin.equipmentAdd("- Hammer", 1, 3)
// owin.equipmentAdd("- Pitons", 10, 0.25)
// owin.equipmentAdd("- Torches", 10, 1)
// owin.equipmentAdd("- Tinderbox", 1, 1)
// owin.equipmentAdd("- Rations", 10, 2)
// owin.equipmentAdd("- Waterskin (4 pints big)", 1, 5)
// owin.equipmentAdd("- Hempen rope (feet)", 50, 0.2)
// owin.equipmentAdd("Bottle of ink", 1, 0.0652) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipmentAdd("Quill", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipmentAdd("Small knife", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipmentAdd("Letter from a dead colleague posing a question you have not yet been able to answer https://t.ly/Ehh25", 1, 0) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipmentAdd("Set of common clothes", 1, 3) // https://www.dndbeyond.com/backgrounds/11-sage
// owin.equipmentAdd("Belt pouch", 1, 1) // https://www.dndbeyond.com/backgrounds/11-sage
// // https://www.dndbeyond.com/equipment/7-book as a journal mentioned in the backstory
// owin.equipmentAdd("Book (Journal)", 1, 5) // backstory
// owin.equipmentCoinAdd(25, "GOLD")

export const exampleCharacter = new Character(undefined, "lzrh8rb4")
exampleCharacter.detailName = "Brevnick"
exampleCharacter.detailClass = "Cleric"
exampleCharacter.detailLevel = 1
exampleCharacter.detailBackground = "Soldier"
exampleCharacter.detailRace = "Hill Dwarf"
exampleCharacter.detailHeight = 4
exampleCharacter.detailWeight = 130
exampleCharacter.detailAge = 75
exampleCharacter.detailEyeColor = "Brown"
exampleCharacter.detailHairColor = "Black"
exampleCharacter.detailSkinColor = "Pale"
exampleCharacter.detailAlignment = "Lawful good"
exampleCharacter.detailExperiencePoints = 0
exampleCharacter.equipmentCoinAdd(10, "GOLD")
exampleCharacter.languageAdd("Common")
exampleCharacter.languageAdd("Dwarvish")
exampleCharacter.languageAdd("Elvish")
exampleCharacter.languageAdd("Goblin")
exampleCharacter.proficiencyAdd("wisdom", "Saving Throws")
exampleCharacter.proficiencyAdd("charisma", "Saving Throws")
exampleCharacter.proficiencyAdd("strength", "Athletics")
exampleCharacter.proficiencyAdd("charisma", "Intimidation")
exampleCharacter.proficiencyAdd("wisdom", "Medicine")
exampleCharacter.proficiencyAdd("intelligence", "Religion")
exampleCharacter.abilityStrength = 14
exampleCharacter.abilityDexterity = 8
exampleCharacter.abilityConstitution = 15
exampleCharacter.abilityIntelligence = 10
exampleCharacter.abilityWisdom = 16
exampleCharacter.abilityCharisma = 12
exampleCharacter.abilityInspiration = 0
exampleCharacter.statArmorClassBase = 14
exampleCharacter.statArmorClassHasDexModifier = true
exampleCharacter.statArmorClassShield = 2
exampleCharacter.statSpeed = 25
exampleCharacter.statHitPointsBase = 8
exampleCharacter.statHitPointsMisc = 1
exampleCharacter.statHitPointsCurrent = exampleCharacter.statHitPointMaximumValue
exampleCharacter.statHitDie = "1D8"
exampleCharacter.attackAdd("Mace", 4, "1d6 + 2", "Bludgeoning")
exampleCharacter.attackAdd("Handaxe", 4, "1d6 + 2", "Slashing")
exampleCharacter.featureAdd("Divine Domain")
exampleCharacter.featureAdd("Disciple of Life")
exampleCharacter.featureAdd("Darkvision")
exampleCharacter.featureAdd("Dwarven Resilience")
exampleCharacter.featureAdd("Stonecunning")
exampleCharacter.featureAdd("Dwarven Toughness")
exampleCharacter.featureAdd("Heavy Armor")
exampleCharacter.spellcastingClass = "Cleric"
exampleCharacter.spellcastingAbility = "wisdom"
exampleCharacter.spellcastingCantripAdd("Light")
exampleCharacter.spellcastingCantripAdd("Thaumaturgy")
exampleCharacter.spellcastingCantripAdd("Sacred flame")
exampleCharacter.spellcastingSpellSlots_set(1, 2)
exampleCharacter.spellcastingAdd(1, "Bless")
exampleCharacter.spellcastingPreparedAdd(1, "Bless")
exampleCharacter.spellcastingAdd(1, "Cure wounds")
exampleCharacter.spellcastingPreparedAdd(1, "Cure wounds")
exampleCharacter.spellcastingAdd(1 ,"Detect magic (ritual)")
exampleCharacter.spellcastingPreparedAdd(1, "Detect magic (ritual)")
exampleCharacter.spellcastingAdd(1, "Healing word")
exampleCharacter.spellcastingPreparedAdd(1, "Healing word")
exampleCharacter.spellcastingAdd(1, "Sanctuary")
exampleCharacter.spellcastingPreparedAdd(1, "Sanctuary")
exampleCharacter.spellcastingAdd(1, "Command")
exampleCharacter.spellcastingPreparedAdd(1, "Command")
exampleCharacter.detailBackstory = "" +
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
exampleCharacter.detailAllies = "" +
    "Deity\n" +
    "- Marthammor Duin" +
    "\n\n" +
    "Organizations\n" +
    "- The army of Mintarn"
exampleCharacter.equipmentAdd("Chain mail", 1, 55)
exampleCharacter.equipmentAdd("Shield", 1, 6)
exampleCharacter.equipmentAdd("Mace", 1, 4)
exampleCharacter.equipmentAdd("Handaxe", 1, 2)
exampleCharacter.equipmentAdd("Holy symbol", 1, 1)
exampleCharacter.equipmentAdd("Backpack", 1, 5)
exampleCharacter.equipmentAdd("Bedroll", 1, 7)
exampleCharacter.equipmentAdd("Mess kit", 1, 1)
exampleCharacter.equipmentAdd("Tinderbox", 1, 1)
exampleCharacter.equipmentAdd("Torches", 10, 0.5)
exampleCharacter.equipmentAdd("Rations", 10, 2)
exampleCharacter.equipmentAdd("Waterskin", 1, 5)
exampleCharacter.equipmentAdd("Hempen rope", 50, 0.2)
exampleCharacter.equipmentAdd("Insignia of rank", 1, 0)
exampleCharacter.equipmentAdd("Broken blade taken as a trophy from a fallen enemy", 1, 2)
exampleCharacter.equipmentAdd("Set of bone dice", 1, 0)
exampleCharacter.equipmentAdd("Set of common clothes", 1, 3)
exampleCharacter.equipmentAdd("Pouch", 1, 1)
exampleCharacter.detailTreasure = "" +
    "Broken blade taken as a trophy from a fallen enemy"






