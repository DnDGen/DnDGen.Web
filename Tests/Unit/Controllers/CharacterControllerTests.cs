using CharacterGen.Common;
using CharacterGen.Common.Abilities.Feats;
using CharacterGen.Common.Abilities.Skills;
using CharacterGen.Common.CharacterClasses;
using CharacterGen.Common.Races;
using CharacterGen.Generators;
using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Randomizers.Stats;
using DNDGenSite.App_Start.Factories;
using DNDGenSite.Controllers;
using DNDGenSite.Models;
using DNDGenSite.Repositories;
using Moq;
using NUnit.Framework;
using System.Linq;
using System.Web.Mvc;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class CharacterControllerTests
    {
        private CharacterController controller;
        private Mock<ICharacterGenerator> mockCharacterGenerator;
        private Mock<IRandomizerRepository> mockRandomizerRepository;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockCharacterGenerator = new Mock<ICharacterGenerator>();
            controller = new CharacterController(mockRandomizerRepository.Object, mockCharacterGenerator.Object);
        }

        [TestCase("Index")]
        [TestCase("Generate")]
        public void ActionHandlesGetVerb(string action)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, action);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void IndexReturnsView()
        {
            var result = controller.Index();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void IndexViewContainsModel()
        {
            var result = controller.Index() as ViewResult;
            Assert.That(result.Model, Is.InstanceOf<CharacterModel>());
        }

        [Test]
        public void IndexViewHasAlignmentRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.Any));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.Chaotic));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.Evil));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.Good));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.Lawful));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.Neutral));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.NonChaotic));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.NonEvil));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.NonGood));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.NonLawful));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(AlignmentRandomizerTypeConstants.NonNeutral));
            Assert.That(model.AlignmentRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.AlignmentRandomizerTypes.Count(), Is.EqualTo(12));
        }

        [Test]
        public void IndexViewHasAlignments()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.Alignments, Contains.Item("Lawful Good"));
            Assert.That(model.Alignments, Contains.Item("Neutral Good"));
            Assert.That(model.Alignments, Contains.Item("Chaotic Good"));
            Assert.That(model.Alignments, Contains.Item("Lawful Neutral"));
            Assert.That(model.Alignments, Contains.Item("True Neutral"));
            Assert.That(model.Alignments, Contains.Item("Chaotic Neutral"));
            Assert.That(model.Alignments, Contains.Item("Lawful Evil"));
            Assert.That(model.Alignments, Contains.Item("Neutral Evil"));
            Assert.That(model.Alignments, Contains.Item("Chaotic Evil"));
            Assert.That(model.Alignments.Count(), Is.EqualTo(9));
        }

        [Test]
        public void IndexViewHasClassNameRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.AnyNPC));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Healer));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Mage));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.NonSpellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Spellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Stealth));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Warrior));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.ClassNameRandomizerTypes.Count(), Is.EqualTo(9));
        }

        [Test]
        public void IndexViewHasClassNames()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Barbarian));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Bard));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Cleric));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Druid));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Fighter));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Monk));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Paladin));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Ranger));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Rogue));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Sorcerer));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Wizard));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Adept));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Aristocrat));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Commoner));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Expert));
            Assert.That(model.ClassNames, Contains.Item(CharacterClassConstants.Warrior));
            Assert.That(model.ClassNames.Count(), Is.EqualTo(16));
        }

        [Test]
        public void IndexViewHasLevelRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.LevelRandomizerTypes, Contains.Item(LevelRandomizerTypeConstants.Any));
            Assert.That(model.LevelRandomizerTypes, Contains.Item(LevelRandomizerTypeConstants.High));
            Assert.That(model.LevelRandomizerTypes, Contains.Item(LevelRandomizerTypeConstants.Low));
            Assert.That(model.LevelRandomizerTypes, Contains.Item(LevelRandomizerTypeConstants.Medium));
            Assert.That(model.LevelRandomizerTypes, Contains.Item(LevelRandomizerTypeConstants.VeryHigh));
            Assert.That(model.LevelRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.LevelRandomizerTypes.Count(), Is.EqualTo(6));
        }

        [Test]
        public void IndexViewHasBaseRaceRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.EvilBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.GoodBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.NeutralBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.NonEvilBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.NonGoodBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.NonNeutralBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.NonStandardBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.StandardBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.BaseRaceRandomizerTypes.Count(), Is.EqualTo(10));
        }

        [Test]
        public void IndexViewHasBaseRaces()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Aasimar));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Bugbear));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.DeepDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.DeepHalfling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Derro));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Doppelganger));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Drow));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.DuergarDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.ForestGnome));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Gnoll));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Goblin));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.GrayElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HalfElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HalfOrc));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HighElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HillDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Hobgoblin));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Human));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Kobold));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.LightfootHalfling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Lizardfolk));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.MindFlayer));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Minotaur));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.MountainDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Ogre));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.OgreMage));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Orc));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.RockGnome));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Svirfneblin));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.TallfellowHalfling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Tiefling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Troglodyte));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.WildElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.WoodElf));
            Assert.That(model.BaseRaces.Count(), Is.EqualTo(34));
        }

        [Test]
        public void IndexViewHasMetaraceRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.EvilMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.GeneticMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.GoodMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.NeutralMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.NoMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.NonEvilMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.NonGoodMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.NonNeutralMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.UndeadMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.MetaraceRandomizerTypes.Count(), Is.EqualTo(12));
        }

        [Test]
        public void IndexViewHasMetaraces()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfCelestial));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfDragon));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfFiend));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Werebear));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Wereboar));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Wererat));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Weretiger));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Werewolf));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Ghost));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Lich));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Vampire));
            Assert.That(model.Metaraces.Count(), Is.EqualTo(11));
        }

        [Test]
        public void IndexViewHasStatsRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.Average));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.BestOfFour));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.Good));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.Heroic));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.OnesAsSixes));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.Poor));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.Raw));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(StatsRandomizerTypeConstants.TwoTenSidedDice));
            Assert.That(model.StatsRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.StatsRandomizerTypes.Count(), Is.EqualTo(9));
        }

        [Test]
        public void IndexViewHasDefaultRandomizerTypeFirst()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.AlignmentRandomizerTypes.First(), Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(model.ClassNameRandomizerTypes.First(), Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(model.LevelRandomizerTypes.First(), Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(model.BaseRaceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(model.MetaraceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(model.StatsRandomizerTypes.First(), Is.EqualTo(StatsRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", string.Empty)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", string.Empty)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0, true)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", string.Empty)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, string.Empty)).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 0, 0, 0, 0, 0, 0, true)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", string.Empty)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", string.Empty)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0, true)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", string.Empty)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, string.Empty)).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 0, 0, 0, 0, 0, 0, true)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsCharacterFromGenerator()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", "set alignment")).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", "set class name")).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 9266, false)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", "set base race")).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", true, "set metarace")).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 90210, 42, 600, 1337, 12345, 23456, false)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type", "set alignment", "set class name", 9266, false, "set base race", true, "set metarace", 90210, 42, 600, 1337, 12345, 23456, false) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.character, Is.EqualTo(character));
        }

        [Test]
        public void DoNotHaveToPassInOptionalParameters()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", string.Empty)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", string.Empty)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0, true)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", string.Empty)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, string.Empty)).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 0, 0, 0, 0, 0, 0, true)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.character, Is.EqualTo(character));
        }

        [Test]
        public void GenerateSortsCharacterFeats()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", string.Empty)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", string.Empty)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0, true)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", string.Empty)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, string.Empty)).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 0, 0, 0, 0, 0, 0, true)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            character.Ability.Feats = new[]
            {
                new Feat { Name = "zzzz" },
                new Feat { Name = "aaa" },
                new Feat { Name = "kkkk" }
            };

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.character, Is.EqualTo(character));
            Assert.That(data.character.Ability.Feats, Is.Ordered.By("Name"));
        }

        [Test]
        public void GenerateSortsCharacterSkills()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", string.Empty)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", string.Empty)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0, true)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", string.Empty)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, string.Empty)).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 0, 0, 0, 0, 0, 0, true)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            character.Ability.Skills["zzzz"] = new Skill { Ranks = 42 };
            character.Ability.Skills["aaaa"] = new Skill { Ranks = 600 };
            character.Ability.Skills["kkkk"] = new Skill { Ranks = 1337 };

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.character, Is.EqualTo(character));
            Assert.That(data.character.Ability.Skills, Is.Ordered.By("Key"));
            Assert.That(data.character.Ability.Skills["aaaa"].Ranks, Is.EqualTo(600));
            Assert.That(data.character.Ability.Skills["kkkk"].Ranks, Is.EqualTo(1337));
            Assert.That(data.character.Ability.Skills["zzzz"].Ranks, Is.EqualTo(42));
        }
    }
}
