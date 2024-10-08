import { ItemTypeViewModel } from './itemTypeViewModel.model';
import { TreasureGenViewModel } from './treasuregenViewModel.model';

describe('TreasureGenViewModel', () => {
  describe('unit', () => {
      let viewmodel: TreasureGenViewModel;

      it('initializes the treasure view model', () => {
          viewmodel = new TreasureGenViewModel(
            ['treasure type 1', 'treasure type 2'],
            9266,
            [
                new ItemTypeViewModel('MyItemType', 'My Item Type'),
                new ItemTypeViewModel('MyOtherItemType', 'My Other Item Type'),
            ],
            ['power 1', 'power 2'],
            {
              "MyItemType": ['item 1', 'item 2'],
              "MyOtherItemType": ['item 3', 'item 4'],
            });

          expect(viewmodel.treasureTypes).toEqual(['treasure type 1', 'treasure type 2']);
          expect(viewmodel.maxTreasureLevel).toEqual(9266);
          expect(viewmodel.itemTypeViewModels).toEqual([
            new ItemTypeViewModel('MyItemType', 'My Item Type'),
            new ItemTypeViewModel('MyOtherItemType', 'My Other Item Type'),
          ]);
          expect(viewmodel.powers).toEqual(['power 1', 'power 2']);
          expect(viewmodel.itemNames['MyItemType']).toBeDefined();
          expect(viewmodel.itemNames['MyItemType']).toEqual(['item 1', 'item 2']);
          expect(viewmodel.itemNames['MyOtherItemType']).toBeDefined();
          expect(viewmodel.itemNames['MyOtherItemType']).toEqual(['item 3', 'item 4']);
      });
  });
  
  describe('integration', () => {
    let viewmodel: TreasureGenViewModel;

    it('initializes the treasure view model', () => {
        viewmodel = new TreasureGenViewModel(
          [
            "Treasure",
            "Coin",
            "Goods",
            "Items"
          ],
          100,
          [
              new ItemTypeViewModel('AlchemicalItem', 'Alchemical Item'),
              new ItemTypeViewModel('Armor', 'Armor'),
              new ItemTypeViewModel('Potion', 'Potion'),
              new ItemTypeViewModel('Ring', 'Ring'),
              new ItemTypeViewModel('Rod', 'Rod'),
              new ItemTypeViewModel('Scroll', 'Scroll'),
              new ItemTypeViewModel('Staff', 'Staff'),
              new ItemTypeViewModel('Tool', 'Tool'),
              new ItemTypeViewModel('Wand', 'Wand'),
              new ItemTypeViewModel('Weapon', 'Weapon'),
              new ItemTypeViewModel('WondrousItem', 'Wondrous Item'),
          ],
          [
            "Mundane",
            "Minor",
            "Medium",
            "Major"
          ],
          {
            "AlchemicalItem": [
                "Acid",
                "Alchemist's Fire",
                "Antitoxin",
                "Everburning Torch",
                "Holy Water",
                "Smokestick",
                "Tanglefoot Bag",
                "Thunderstone"
            ],
            "Armor": [
                "Armor of Arrow Attraction",
                "Armor of Rage",
                "Banded mail",
                "Banded Mail of Luck",
                "Breastplate",
                "Breastplate of Command",
                "Celestial Armor",
                "Chain shirt",
                "Chainmail",
                "Demon Armor",
                "Dwarven Plate",
                "Elven Chain",
                "Full plate",
                "Full Plate of Speed",
                "Half-plate",
                "Hide armor",
                "Leather armor",
                "Padded armor",
                "Plate Armor of the Deep",
                "Rhino Hide",
                "Scale mail",
                "Splint mail",
                "Studded leather armor"
            ],
            "Potion": [
                "Oil of Bless Weapon",
                "Oil of Darkness",
                "Oil of Daylight",
                "Oil of Flame Arrow",
                "Oil of Greater Magic Weapon",
                "Oil of Invisibility",
                "Oil of Keen Edge",
                "Oil of Levitate",
                "Oil of Magic Stone",
                "Oil of Magic Vestment",
                "Oil of Magic Weapon",
                "Oil of Shillelagh",
                "Potion of Aid",
                "Potion of Barkskin",
                "Potion of Bear's Endurance",
                "Potion of Blur",
                "Potion of Bull's Strength",
                "Potion of Cat's Grace",
                "Potion of Cure Light Wounds",
                "Potion of Cure Moderate Wounds",
                "Potion of Cure Serious Wounds",
                "Potion of Darkvision",
                "Potion of Delay Poison",
                "Potion of Displacement",
                "Potion of Eagle's Splendor",
                "Potion of Endure Elements",
                "Potion of Enlarge Person",
                "Potion of Fly",
                "Potion of Fox's Cunning",
                "Potion of Gaseous Form",
                "Potion of Good Hope",
                "Potion of Greater Magic Fang",
                "Potion of Haste",
                "Potion of Heroism",
                "Potion of Hide from Animals",
                "Potion of Hide from Undead",
                "Potion of Invisibility",
                "Potion of Jump",
                "Potion of Lesser Restoration",
                "Potion of Levitate",
                "Potion of Mage Armor",
                "Potion of Magic Circle Against Chaos",
                "Potion of Magic Circle Against Evil",
                "Potion of Magic Circle Against Good",
                "Potion of Magic Circle Against Law",
                "Potion of Magic Fang",
                "Potion of Misdirection",
                "Potion of Neutralize Poison",
                "Potion of Nondetection",
                "Potion of Owl's Wisdom",
                "Potion of Pass Without Trace",
                "Potion of Poison",
                "Potion of Protection from Acid",
                "Potion of Protection from Arrows 10/magic",
                "Potion of Protection from Arrows 15/magic",
                "Potion of Protection from Chaos",
                "Potion of Protection from Cold",
                "Potion of Protection from Electricity",
                "Potion of Protection from Evil",
                "Potion of Protection from Fire",
                "Potion of Protection from Good",
                "Potion of Protection from Law",
                "Potion of Protection from Sonic",
                "Potion of Rage",
                "Potion of Reduce Person",
                "Potion of Remove Blindness/Deafness",
                "Potion of Remove Curse",
                "Potion of Remove Disease",
                "Potion of Remove Fear",
                "Potion of Remove Paralysis",
                "Potion of Resist Acid 10",
                "Potion of Resist Acid 20",
                "Potion of Resist Acid 30",
                "Potion of Resist Cold 10",
                "Potion of Resist Cold 20",
                "Potion of Resist Cold 30",
                "Potion of Resist Electricity 10",
                "Potion of Resist Electricity 20",
                "Potion of Resist Electricity 30",
                "Potion of Resist Fire 10",
                "Potion of Resist Fire 20",
                "Potion of Resist Fire 30",
                "Potion of Resist Sonic 10",
                "Potion of Resist Sonic 20",
                "Potion of Resist Sonic 30",
                "Potion of Sanctuary",
                "Potion of Shield of Faith",
                "Potion of Spider Climb",
                "Potion of Tongues",
                "Potion of Undetectable Alignment",
                "Potion of Water Breathing",
                "Potion of Water Walk"
            ],
            "Ring": [
                "Ring of Animal Friendship",
                "Ring of Blinking",
                "Ring of Chameleon Power",
                "Ring of Climbing",
                "Ring of Clumsiness",
                "Ring of Counterspells",
                "Ring of Djinni Calling",
                "Ring of Elemental Command (Air)",
                "Ring of Elemental Command (Earth)",
                "Ring of Elemental Command (Fire)",
                "Ring of Elemental Command (Water)",
                "Ring of Evasion",
                "Ring of Feather Falling",
                "Ring of Force Shield",
                "Ring of Freedom of Movement",
                "Ring of Friend Shield (pair)",
                "Ring of Greater Acid Resistance",
                "Ring of Greater Cold Resistance",
                "Ring of Greater Electricity Resistance",
                "Ring of Greater Fire Resistance",
                "Ring of Greater Sonic Resistance",
                "Ring of Improved Climbing",
                "Ring of Improved Jumping",
                "Ring of Improved Swimming",
                "Ring of Invisibility",
                "Ring of Jumping",
                "Ring of Major Acid Resistance",
                "Ring of Major Cold Resistance",
                "Ring of Major Electricity Resistance",
                "Ring of Major Fire Resistance",
                "Ring of Major Sonic Resistance",
                "Ring of Major Spell Storing",
                "Ring of Mind Shielding",
                "Ring of Minor Acid Resistance",
                "Ring of Minor Cold Resistance",
                "Ring of Minor Electricity Resistance",
                "Ring of Minor Fire Resistance",
                "Ring of Minor Sonic Resistance",
                "Ring of Minor Spell Storing",
                "Ring of Protection",
                "Ring of Ram",
                "Ring of Regeneration",
                "Ring of Shooting Stars",
                "Ring of Spell Storing",
                "Ring of Spell Turning",
                "Ring of Sustenance",
                "Ring of Swimming",
                "Ring of Telekinesis",
                "Ring of Three Wishes",
                "Ring of Water Walking",
                "Ring of Wizardry (I)",
                "Ring of Wizardry (II)",
                "Ring of Wizardry (III)",
                "Ring of Wizardry (IV)",
                "Ring of X-ray Vision"
            ],
            "Rod": [
                "Immovable Rod",
                "Rod of Absorption",
                "Rod of Alertness",
                "Rod of Cancellation",
                "Rod of Enemy Detection",
                "Rod of Flailing",
                "Rod of Flame Extinguishing",
                "Rod of Greater Metamagic: Empower",
                "Rod of Greater Metamagic: Enlarge",
                "Rod of Greater Metamagic: Extend",
                "Rod of Greater Metamagic: Maximize",
                "Rod of Greater Metamagic: Quicken",
                "Rod of Greater Metamagic: Silent",
                "Rod of Lesser Metamagic: Empower",
                "Rod of Lesser Metamagic: Enlarge",
                "Rod of Lesser Metamagic: Extend",
                "Rod of Lesser Metamagic: Maximize",
                "Rod of Lesser Metamagic: Quicken",
                "Rod of Lesser Metamagic: Silent",
                "Rod of Lordly Might",
                "Rod of Metal and Mineral Detection",
                "Rod of Metamagic: Empower",
                "Rod of Metamagic: Enlarge",
                "Rod of Metamagic: Extend",
                "Rod of Metamagic: Maximize",
                "Rod of Metamagic: Quicken",
                "Rod of Metamagic: Silent",
                "Rod of Negation",
                "Rod of Rulership",
                "Rod of Security",
                "Rod of Splendor",
                "Rod of the Python",
                "Rod of the Viper",
                "Rod of Thunder and Lightning",
                "Rod of Withering",
                "Rod of Wonder"
            ],
            "Scroll": [
                "Scroll"
            ],
            "Staff": [
                "Staff of Abjuration",
                "Staff of Charming",
                "Staff of Conjuration",
                "Staff of Defense",
                "Staff of Divination",
                "Staff of Earth and Stone",
                "Staff of Enchantment",
                "Staff of Evocation",
                "Staff of Fire",
                "Staff of Frost",
                "Staff of Healing",
                "Staff of Illumination",
                "Staff of Illusion",
                "Staff of Life",
                "Staff of Necromancy",
                "Staff of Passage",
                "Staff of Power",
                "Staff of Size Alteration",
                "Staff of Swarming Insects",
                "Staff of Transmutation",
                "Staff of Woodlands"
            ],
            "Tool": [
                "Average lock",
                "Bullseye lantern",
                "Climber's kit",
                "Crowbar",
                "Disguise kit",
                "Empty backpack",
                "Good lock",
                "Healer's kit",
                "Hourglass",
                "Magnifying glass",
                "Masterwork artisan's tools",
                "Masterwork manacles",
                "Masterwork musical instrument",
                "Masterwork thieves' tools",
                "Silk rope (50')",
                "Silver holy symbol",
                "Simple lock",
                "Small steel mirror",
                "Spyglass",
                "Superior lock"
            ],
            "Wand": [
                "Wand of Spell"
            ],
            "Weapon": [
                "Arrow",
                "Assassin's Dagger",
                "Bastard sword",
                "Battleaxe",
                "Berserking Sword",
                "Bolas",
                "Club",
                "Composite longbow",
                "Composite shortbow",
                "Crossbow bolt",
                "Cursed -2 Sword",
                "Cursed Backbiter Spear",
                "Dagger",
                "Dagger of Venom",
                "Dart",
                "Dire flail",
                "Dwarven Thrower",
                "Dwarven urgrosh",
                "Dwarven waraxe",
                "Falchion",
                "Flail",
                "Flame Tongue",
                "Frost Brand",
                "Gauntlet",
                "Glaive",
                "Gnome hooked hammer",
                "Greataxe",
                "Greatclub",
                "Greater Slaying Arrow",
                "Greatsword",
                "Guisarme",
                "Halberd",
                "Hand crossbow",
                "Handaxe",
                "Heavy crossbow",
                "Heavy flail",
                "Heavy mace",
                "Heavy pick",
                "Heavy repeating crossbow",
                "Holy Avenger",
                "Javelin",
                "Javelin of Lightning",
                "Kama",
                "Kukri",
                "Lance",
                "Life-Drinker",
                "Light crossbow",
                "Light hammer",
                "Light mace",
                "Light pick",
                "Light repeating crossbow",
                "Longbow",
                "Longspear",
                "Longsword",
                "Luck Blade",
                "Mace of Blood",
                "Mace of Smiting",
                "Mace of Terror",
                "Morningstar",
                "Net",
                "Net of Snaring",
                "Nine Lives Stealer",
                "Nunchaku",
                "Oathbow",
                "Orc double axe",
                "Pincer staff",
                "Punching dagger",
                "Quarterstaff",
                "Ranseur",
                "Rapier",
                "Rapier of Puncturing",
                "Sai",
                "Sap",
                "Scimitar",
                "Screaming Bolt",
                "Scythe",
                "Shatterspike",
                "Shifter's Sorrow",
                "Short sword",
                "Shortbow",
                "Shortspear",
                "Shuriken",
                "Siangham",
                "Sickle",
                "Slaying Arrow",
                "Sleep Arrow",
                "Sling",
                "Sling bullet",
                "Spear",
                "Spiked chain",
                "Spiked gauntlet",
                "Sun Blade",
                "Sword of Life Stealing",
                "Sword of Subtlety",
                "Sword of the Planes",
                "Sylvan Scimitar",
                "Throwing axe",
                "Trident",
                "Trident of Fish Command",
                "Trident of Warning",
                "Two-bladed sword",
                "Warhammer",
                "Whip"
            ],
            "WondrousItem": [
                "10 ft. by 10 ft. Carpet of Flying",
                "1st-level Spell Pearl of Power",
                "2nd-level Spell Pearl of Power",
                "3rd-level Spell Pearl of Power",
                "4th-level Spell Pearl of Power",
                "5 ft. by 10 ft. Carpet of Flying",
                "5 ft. by 5 ft. Carpet of Flying",
                "5th-level Spell Pearl of Power",
                "6 ft. by 9 ft. Carpet of Flying",
                "6th-level Spell Pearl of Power",
                "7th-level Spell Pearl of Power",
                "8th-level Spell Pearl of Power",
                "9th-level Spell Pearl of Power",
                "Amulet of Health",
                "Amulet of Mighty Fists",
                "Amulet of Natural Armor",
                "Amulet of Proof Against Detection and Location",
                "Amulet of the Planes",
                "Apparatus of Kwalish",
                "Bag of Holding Type I",
                "Bag of Holding Type II",
                "Bag of Holding Type III",
                "Bag of Holding Type IV",
                "Bead of Force",
                "Belt of Dwarvenkind",
                "Belt of Giant Strength",
                "Boccob's Blessed Book",
                "Boots of Elvenkind",
                "Boots of Levitation",
                "Boots of Speed",
                "Boots of Striding and Springing",
                "Boots of Teleportation",
                "Boots of the Winterlands",
                "Bottle of Air",
                "Bowl of Commanding Water Elementals",
                "Bracelet of Friends",
                "Bracers of Armor",
                "Brazier of Commanding Fire Elementals",
                "Bronze Griffon Figurine of Wondrous Power",
                "Brooch of Shielding",
                "Broom of Flying",
                "Candle of Invocation",
                "Candle of Truth",
                "Cape of the Mountebank",
                "Censer of Controlling Air Elementals",
                "Chaos Diamond",
                "Chime of Interruption",
                "Chime of Opening",
                "Circlet of Persuasion",
                "Clay Golem Manual",
                "Clear Spindle Ioun Stone",
                "Cloak of Arachnida",
                "Cloak of Charisma",
                "Cloak of Elvenkind",
                "Cloak of Etherealness",
                "Cloak of Resistance",
                "Cloak of the Bat",
                "Cloak of the Manta Ray",
                "Courser Stone Horse",
                "Crystal Ball",
                "Crystal Ball with Detect Thoughts",
                "Crystal Ball with See Invisibility",
                "Crystal Ball with Telepathy",
                "Crystal Ball with True Seeing",
                "Cube of Force",
                "Cube of Frost Resistance",
                "Cubic Gate",
                "Daern's Instant Fortress",
                "Dark Blue Rhomboid Ioun Stone",
                "Darkskull",
                "Decanter of Endless Water",
                "Deck of Illusions",
                "Deep Red Sphere Ioun Stone",
                "Destrier Stone Horse",
                "Dimensional Shackles",
                "Druid's Vestments",
                "Drums of Panic",
                "Dust of Appearance",
                "Dust of Disappearance",
                "Dust of Dryness",
                "Dust of Illusion",
                "Dust of Tracelessness",
                "Dusty Rose Prism Ioun Stone",
                "Ebony Fly Figurine of Wondrous Power",
                "Efreeti Bottle",
                "Elemental Gem",
                "Elixer of Fire Breath",
                "Elixer of Hiding",
                "Elixer of Love",
                "Elixer of Sneaking",
                "Elixer of Swimming",
                "Elixer of Truth",
                "Elixer of Vision",
                "Eversmoking Bottle",
                "Eyes of Charming",
                "Eyes of Doom",
                "Eyes of Petrification",
                "Eyes of the Eagle",
                "Flesh Golem Manual",
                "Folding Boat",
                "Gauntlet of Rust",
                "Gauntlets of Ogre Power",
                "Gem of Brightness",
                "Gem of Seeing",
                "Glove of Storing",
                "Gloves of Arrow Snaring",
                "Gloves of Dexterity",
                "Gloves of Swimming and Climbing",
                "Goggles of Minute Seeing",
                "Goggles of Night",
                "Golden Lions Figurine of Wondrous Power",
                "Golembane Scarab",
                "Gray Bag of Tricks",
                "Greater Bracers of Archery",
                "Greater Horn of Blasting",
                "Greater Stone Golem Manual",
                "Greater Strand of Prayer Beads",
                "Hand of Glory",
                "Hand of the Mage",
                "Harp of Charming",
                "Hat of Disguise",
                "Headband of Intellect",
                "Helm of Brilliance",
                "Helm of Comprehend Languages and Read Magic",
                "Helm of Telepathy",
                "Helm of Teleportation",
                "Helm of Underwater Action",
                "Heward's Handy Haversack",
                "Horn of Blasting",
                "Horn of Fog",
                "Horn of Goodness/Evil",
                "Horn of the Tritons",
                "Horn of Valhalla",
                "Horseshoes of a Zephyr",
                "Horseshoes of Speed",
                "Incandescent Blue Sphere Ioun Stone",
                "Incense of Meditation",
                "Iridescent Spindle Ioun Stone",
                "Iron Bands of Bilarro",
                "Iron Flask",
                "Iron Golem Manual",
                "Ivory Goats Figurine of Wondrous Power",
                "Keoghtom's Ointment",
                "Lantern of Revealing",
                "Lavender and Green Ellipsoid Ioun Stone",
                "Lens of Detection",
                "Lesser Bracers of Archery",
                "Lesser Strand of Prayer Beads",
                "Lyre of Building",
                "Major Circlet of Blasting",
                "Major Cloak of Displacement",
                "Mantle of Faith",
                "Mantle of Spell Resistance",
                "Manual of Bodily Health",
                "Manual of Gainful Exercise",
                "Manual of Quickness in Action",
                "Marble Elephant Figurine of Wondrous Power",
                "Mask of the Skull",
                "Mattock of the Titans",
                "Maul of the Titans",
                "Medallion of Thoughts",
                "Minor Circlet of Blasting",
                "Minor Cloak of Displacement",
                "Mirror of Life Trapping",
                "Mirror of Mental Prowess",
                "Mirror of Opposition",
                "Monk's Belt",
                "Murlynd's Spoon",
                "Necklace of Adaptation",
                "Necklace of Fireballs Type I",
                "Necklace of Fireballs Type II",
                "Necklace of Fireballs Type III",
                "Necklace of Fireballs Type IV",
                "Necklace of Fireballs Type V",
                "Necklace of Fireballs Type VI",
                "Necklace of Fireballs Type VII",
                "Nolzur's Marvelous Pigments",
                "Obsidian Steed Figurine of Wondrous Power",
                "Onyx Dog Figurine of Wondrous Power",
                "Orange Prism Ioun Stone",
                "Orb of Storms",
                "Pale Blue Rhomboid Ioun Stone",
                "Pale Green Prism Ioun Stone",
                "Pale Lavender Ellipsoid Ioun Stone",
                "Pearl of the Sirines",
                "Pearly White Spindle Ioun Stone",
                "Periapt of Health",
                "Periapt of Proof Against Poison",
                "Periapt of Wisdom",
                "Periapt of Wound-Closure",
                "Phylactery of Faithfulness",
                "Phylactery of Undead Turning",
                "Pink and Green Sphere Ioun Stone",
                "Pink Rhomboid Ioun Stone",
                "Pipes of Haunting",
                "Pipes of Pain",
                "Pipes of Sounding",
                "Pipes of the Sewers",
                "Portable Hole",
                "Quaal's Anchor Feather Token",
                "Quaal's Bird Feather Token",
                "Quaal's Fan Feather Token",
                "Quaal's Swan Boat Feather Token",
                "Quaal's Tree Feather Token",
                "Quaal's Whip Feather Token",
                "Quiver of Ehlonna",
                "Ring Gates",
                "Robe of Blending",
                "Robe of Bones",
                "Robe of Eyes",
                "Robe of Scintillating Colors",
                "Robe of Stars",
                "Robe of the Archmagi",
                "Robe of Useful Items",
                "Rope of Climbing",
                "Rope of Entanglement",
                "Rust Bag of Tricks",
                "Salve of Slipperiness",
                "Scabbard of Keen Edges",
                "Scarab of Protection",
                "Scarlet and Blue Sphere Ioun Stone",
                "Serpentine Owl Figurine of Wondrous Power",
                "Silver Raven Figurine of Wondrous Power",
                "Silversheen",
                "Slippers of Spider Climbing",
                "Sovereign Glue",
                "Stone Golem Manual",
                "Stone of Alarm",
                "Stone of Controlling Earth Elementals",
                "Stone of Good Luck (Luckstone)",
                "Stone Salve",
                "Strand of Prayer Beads",
                "Talisman of the Sphere",
                "Tan Bag of Tricks",
                "Tome of Clear Thought",
                "Tome of Leadership and Influence",
                "Tome of Understanding",
                "Two Spells Pearl of Power",
                "Unguent of Timelessness",
                "Universal Solvent",
                "Vest of Escape",
                "Vibrant Purple Prism Ioun Stone",
                "Well of Many Worlds",
                "Wind Fan",
                "Winged Boots",
                "Wings of Flying"
            ]
        });

        expect(viewmodel.treasureTypes).toEqual([
          "Treasure",
          "Coin",
          "Goods",
          "Items"
        ]);
        expect(viewmodel.maxTreasureLevel).toEqual(100);
        expect(viewmodel.itemTypeViewModels).toEqual([
          new ItemTypeViewModel('AlchemicalItem', 'Alchemical Item'),
          new ItemTypeViewModel('Armor', 'Armor'),
          new ItemTypeViewModel('Potion', 'Potion'),
          new ItemTypeViewModel('Ring', 'Ring'),
          new ItemTypeViewModel('Rod', 'Rod'),
          new ItemTypeViewModel('Scroll', 'Scroll'),
          new ItemTypeViewModel('Staff', 'Staff'),
          new ItemTypeViewModel('Tool', 'Tool'),
          new ItemTypeViewModel('Wand', 'Wand'),
          new ItemTypeViewModel('Weapon', 'Weapon'),
          new ItemTypeViewModel('WondrousItem', 'Wondrous Item'),
        ]);
        expect(viewmodel.powers).toEqual([
          "Mundane",
          "Minor",
          "Medium",
          "Major"
        ]);
        // expect(viewmodel.itemNamesMap.size).toEqual(viewmodel.itemTypeViewModels.length);
        
        for(var i = 0; i < viewmodel.itemTypeViewModels.length; i++) {
          const itemType = viewmodel.itemTypeViewModels[i].itemType;
          const names = viewmodel.itemNames[itemType];
          expect(names).toBeDefined();
          expect(names?.length).toBeGreaterThanOrEqual(1);
        }
        expect(viewmodel.itemNames['AlchemicalItem']?.length).toEqual(8);
        expect(viewmodel.itemNames['Armor']?.length).toEqual(23);
        expect(viewmodel.itemNames['Potion']?.length).toEqual(92);
        expect(viewmodel.itemNames['Ring']?.length).toEqual(55);
        expect(viewmodel.itemNames['Rod']?.length).toEqual(36);
        expect(viewmodel.itemNames['Scroll']?.length).toEqual(1);
        expect(viewmodel.itemNames['Staff']?.length).toEqual(21);
        expect(viewmodel.itemNames['Tool']?.length).toEqual(20);
        expect(viewmodel.itemNames['Wand']?.length).toEqual(1);
        expect(viewmodel.itemNames['Weapon']?.length).toEqual(103);
        expect(viewmodel.itemNames['WondrousItem']?.length).toEqual(246);
    });
  });
});