using CharacterGen;
using CharacterGen.CharacterClasses;
using CharacterGen.Races;
using CharacterGen.Randomizers.Alignments;
using CharacterGen.Randomizers.CharacterClasses;
using CharacterGen.Randomizers.Races;
using CharacterGen.Randomizers.Stats;
using DnDGen.Web.App_Start.Factories;
using DnDGen.Web.Models;
using DnDGen.Web.Repositories;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
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
            var model = new CharacterViewModel();
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
                ClassNameRandomizerTypeConstants.AnyPlayer,
                ClassNameRandomizerTypeConstants.Healer,
                ClassNameRandomizerTypeConstants.Mage,
                ClassNameRandomizerTypeConstants.NonSpellcaster,
                ClassNameRandomizerTypeConstants.Spellcaster,
                ClassNameRandomizerTypeConstants.Stealth,
                ClassNameRandomizerTypeConstants.Warrior,
                ClassNameRandomizerTypeConstants.AnyNPC,
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
                CharacterClassConstants.Wizard,
                CharacterClassConstants.Adept,
                CharacterClassConstants.Aristocrat,
                CharacterClassConstants.Commoner,
                CharacterClassConstants.Expert,
                CharacterClassConstants.Warrior
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
        public JsonResult Generate(string alignmentRandomizerType, string classNameRandomizerType, string levelRandomizerType, string baseRaceRandomizerType, string metaraceRandomizerType, string statsRandomizerType, string setAlignment = "", string setClassName = "", int setLevel = 0, bool allowLevelAdjustments = true, string setBaseRace = "", bool forceMetarace = false, string setMetarace = "", int setStrength = 0, int setConstitution = 0, int setDexterity = 0, int setIntelligence = 0, int setWisdom = 0, int setCharisma = 0, bool allowStatsAdjustments = true)
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