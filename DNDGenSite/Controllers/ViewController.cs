using CharacterGen.Common.CharacterClasses;
using CharacterGen.Common.Races;
using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Randomizers.Stats;
using DNDGenSite.App_Start.Factories;
using DNDGenSite.Models;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using TreasureGen.Common.Items;

namespace DNDGenSite.Controllers
{
    public class ViewController : Controller
    {
        [HttpGet]
        public ActionResult Home()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Roll()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Treasure()
        {
            var model = new TreasureModel();

            model.MaxTreasureLevel = 20;
            model.MundaneItemTypes = new[] { ItemTypeConstants.AlchemicalItem, ItemTypeConstants.Tool };
            model.TreasureTypes = new[] { "Treasure", "Coin", "Goods", "Items" };

            var powers = GetPowers();
            model.PoweredItemTypes = powers.Keys;
            model.ItemPowers = powers.Values;

            return View(model);
        }

        private Dictionary<String, IEnumerable<String>> GetPowers()
        {
            var powers = new Dictionary<String, IEnumerable<String>>();
            powers[ItemTypeConstants.Armor] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Potion] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Ring] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Rod] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Scroll] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Staff] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Wand] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Weapon] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.WondrousItem] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            return powers;
        }

        [HttpGet]
        public ActionResult Character()
        {
            var model = new CharacterModel();
            model.AlignmentRandomizerTypes = new[]
            {
                AlignmentRandomizerTypeConstants.Any,
                AlignmentRandomizerTypeConstants.Chaotic,
                AlignmentRandomizerTypeConstants.Evil,
                AlignmentRandomizerTypeConstants.Good,
                AlignmentRandomizerTypeConstants.Lawful,
                AlignmentRandomizerTypeConstants.Neutral,
                AlignmentRandomizerTypeConstants.NonChaotic,
                AlignmentRandomizerTypeConstants.NonEvil,
                AlignmentRandomizerTypeConstants.NonGood,
                AlignmentRandomizerTypeConstants.NonLawful,
                AlignmentRandomizerTypeConstants.NonNeutral,
                RandomizerTypeConstants.Set
            };

            model.Alignments = new[]
            {
                "Lawful Good",
                "Neutral Good",
                "Chaotic Good",
                "Lawful Neutral",
                "True Neutral",
                "Chaotic Neutral",
                "Lawful Evil",
                "Neutral Evil",
                "Chaotic Evil"
            };

            model.BaseRaceRandomizerTypes = new[]
            {
                RaceRandomizerTypeConstants.BaseRace.AnyBase,
                RaceRandomizerTypeConstants.BaseRace.EvilBase,
                RaceRandomizerTypeConstants.BaseRace.GoodBase,
                RaceRandomizerTypeConstants.BaseRace.NeutralBase,
                RaceRandomizerTypeConstants.BaseRace.NonEvilBase,
                RaceRandomizerTypeConstants.BaseRace.NonGoodBase,
                RaceRandomizerTypeConstants.BaseRace.NonNeutralBase,
                RaceRandomizerTypeConstants.BaseRace.NonStandardBase,
                RaceRandomizerTypeConstants.BaseRace.StandardBase,
                RandomizerTypeConstants.Set
            };

            model.BaseRaces = new[]
            {
                RaceConstants.BaseRaces.Aasimar,
                RaceConstants.BaseRaces.Bugbear,
                RaceConstants.BaseRaces.DeepDwarf,
                RaceConstants.BaseRaces.DeepHalfling,
                RaceConstants.BaseRaces.Derro,
                RaceConstants.BaseRaces.Doppelganger,
                RaceConstants.BaseRaces.Drow,
                RaceConstants.BaseRaces.DuergarDwarf,
                RaceConstants.BaseRaces.ForestGnome,
                RaceConstants.BaseRaces.Gnoll,
                RaceConstants.BaseRaces.Goblin,
                RaceConstants.BaseRaces.GrayElf,
                RaceConstants.BaseRaces.HalfElf,
                RaceConstants.BaseRaces.HalfOrc,
                RaceConstants.BaseRaces.HighElf,
                RaceConstants.BaseRaces.HillDwarf,
                RaceConstants.BaseRaces.Hobgoblin,
                RaceConstants.BaseRaces.Human,
                RaceConstants.BaseRaces.Kobold,
                RaceConstants.BaseRaces.LightfootHalfling,
                RaceConstants.BaseRaces.Lizardfolk,
                RaceConstants.BaseRaces.MindFlayer,
                RaceConstants.BaseRaces.Minotaur,
                RaceConstants.BaseRaces.MountainDwarf,
                RaceConstants.BaseRaces.Ogre,
                RaceConstants.BaseRaces.OgreMage,
                RaceConstants.BaseRaces.Orc,
                RaceConstants.BaseRaces.RockGnome,
                RaceConstants.BaseRaces.Svirfneblin,
                RaceConstants.BaseRaces.TallfellowHalfling,
                RaceConstants.BaseRaces.Tiefling,
                RaceConstants.BaseRaces.Troglodyte,
                RaceConstants.BaseRaces.WildElf,
                RaceConstants.BaseRaces.WoodElf
            };

            model.ClassNameRandomizerTypes = new[]
            {
                ClassNameRandomizerTypeConstants.Any,
                ClassNameRandomizerTypeConstants.Healer,
                ClassNameRandomizerTypeConstants.Mage,
                ClassNameRandomizerTypeConstants.NonSpellcaster,
                ClassNameRandomizerTypeConstants.Spellcaster,
                ClassNameRandomizerTypeConstants.Stealth,
                ClassNameRandomizerTypeConstants.Warrior,
                RandomizerTypeConstants.Set
            };

            model.ClassNames = new[]
            {
                CharacterClassConstants.Barbarian,
                CharacterClassConstants.Bard,
                CharacterClassConstants.Cleric,
                CharacterClassConstants.Druid,
                CharacterClassConstants.Fighter,
                CharacterClassConstants.Monk,
                CharacterClassConstants.Paladin,
                CharacterClassConstants.Ranger,
                CharacterClassConstants.Rogue,
                CharacterClassConstants.Sorcerer,
                CharacterClassConstants.Wizard
            };

            model.LevelRandomizerTypes = new[]
            {
                LevelRandomizerTypeConstants.Any,
                LevelRandomizerTypeConstants.High,
                LevelRandomizerTypeConstants.Low,
                LevelRandomizerTypeConstants.Medium,
                LevelRandomizerTypeConstants.VeryHigh,
                RandomizerTypeConstants.Set
            };

            model.MetaraceRandomizerTypes = new[]
            {
                RaceRandomizerTypeConstants.Metarace.AnyMeta,
                RaceRandomizerTypeConstants.Metarace.EvilMeta,
                RaceRandomizerTypeConstants.Metarace.GeneticMeta,
                RaceRandomizerTypeConstants.Metarace.GoodMeta,
                RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,
                RaceRandomizerTypeConstants.Metarace.NeutralMeta,
                RaceRandomizerTypeConstants.Metarace.NoMeta,
                RaceRandomizerTypeConstants.Metarace.NonEvilMeta,
                RaceRandomizerTypeConstants.Metarace.NonGoodMeta,
                RaceRandomizerTypeConstants.Metarace.NonNeutralMeta,
                RandomizerTypeConstants.Set
            };

            model.Metaraces = new[]
            {
                RaceConstants.Metaraces.HalfCelestial,
                RaceConstants.Metaraces.HalfDragon,
                RaceConstants.Metaraces.HalfFiend,
                RaceConstants.Metaraces.Werebear,
                RaceConstants.Metaraces.Wereboar,
                RaceConstants.Metaraces.Wererat,
                RaceConstants.Metaraces.Weretiger,
                RaceConstants.Metaraces.Werewolf
            };

            model.StatsRandomizerTypes = new[]
            {
                StatsRandomizerTypeConstants.Raw,
                StatsRandomizerTypeConstants.Average,
                StatsRandomizerTypeConstants.BestOfFour,
                StatsRandomizerTypeConstants.Good,
                StatsRandomizerTypeConstants.Heroic,
                StatsRandomizerTypeConstants.OnesAsSixes,
                StatsRandomizerTypeConstants.Poor,
                StatsRandomizerTypeConstants.TwoTenSidedDice,
                RandomizerTypeConstants.Set
            };

            return View(model);
        }

        [HttpGet]
        public ActionResult Encounter()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Dungeon()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Error()
        {
            return View();
        }
    }
}