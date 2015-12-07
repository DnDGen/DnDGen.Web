using CharacterGen.Common.CharacterClasses;
using CharacterGen.Common.Races;
using CharacterGen.Generators;
using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Randomizers.Stats;
using DNDGenSite.App_Start.Factories;
using DNDGenSite.Models;
using DNDGenSite.Repositories;
using System;
using System.Linq;
using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class CharacterController : Controller
    {
        private IRandomizerRepository randomizerRepository;
        private ICharacterGenerator characterGenerator;

        public CharacterController(IRandomizerRepository randomizerRepository, ICharacterGenerator characterGenerator)
        {
            this.randomizerRepository = randomizerRepository;
            this.characterGenerator = characterGenerator;
        }

        [HttpGet]
        public ActionResult Index()
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
                RaceRandomizerTypeConstants.Metarace.UndeadMeta,
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
                RaceConstants.Metaraces.Werewolf,
                RaceConstants.Metaraces.Ghost,
                RaceConstants.Metaraces.Lich,
                RaceConstants.Metaraces.Vampire
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
        public JsonResult Generate(String alignmentRandomizerType, String classNameRandomizerType, String levelRandomizerType, String baseRaceRandomizerType, String metaraceRandomizerType, String statsRandomizerType, String setAlignment = "", String setClassName = "", Int32 setLevel = 0, Boolean allowLevelAdjustments = true, String setBaseRace = "", Boolean forceMetarace = false, String setMetarace = "", Int32 setStrength = 0, Int32 setConstitution = 0, Int32 setDexterity = 0, Int32 setIntelligence = 0, Int32 setWisdom = 0, Int32 setCharisma = 0, Boolean allowStatsAdjustments = true)
        {
            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(alignmentRandomizerType, setAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(classNameRandomizerType, setClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(levelRandomizerType, setLevel, allowLevelAdjustments);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(baseRaceRandomizerType, setBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(metaraceRandomizerType, forceMetarace, setMetarace);
            var statsRandomizer = randomizerRepository.GetStatsRandomizer(statsRandomizerType, setStrength, setConstitution, setDexterity, setIntelligence, setWisdom, setCharisma, allowStatsAdjustments);

            var character = characterGenerator.GenerateWith(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer, statsRandomizer);

            character.Ability.Feats = character.Ability.Feats.OrderBy(f => f.Name);
            character.Ability.Skills = character.Ability.Skills.OrderBy(kvp => kvp.Key).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            return Json(new { character = character }, JsonRequestBehavior.AllowGet);
        }
    }
}