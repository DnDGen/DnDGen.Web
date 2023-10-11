using CharacterGen.Abilities;
using CharacterGen.CharacterClasses;
using CharacterGen.Characters;
using CharacterGen.Races;
using CharacterGen.Randomizers.Abilities;
using CharacterGen.Randomizers.Alignments;
using CharacterGen.Randomizers.CharacterClasses;
using CharacterGen.Randomizers.Races;
using CharacterGen.Skills;
using DnDGen.Web.App_Start;
using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using DnDGen.Web.Repositories;
using EventGen;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Linq;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class CharacterControllerTests
    {
        private CharacterController controller;
        private Mock<ICharacterGenerator> mockCharacterGenerator;
        private Mock<IRandomizerRepository> mockRandomizerRepository;
        private Mock<ClientIDManager> mockClientIdManager;
        private CharacterSpecifications characterSpecifications;
        private Guid clientId;
        private Character character;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockCharacterGenerator = new Mock<ICharacterGenerator>();
            mockClientIdManager = new Mock<ClientIDManager>();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IRandomizerRepository>()).Returns(mockRandomizerRepository.Object);
            mockDependencyFactory.Setup(f => f.Get<ICharacterGenerator>()).Returns(mockCharacterGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<ClientIDManager>()).Returns(mockClientIdManager.Object);

            controller = new CharacterController(mockDependencyFactory.Object);
            characterSpecifications = new CharacterSpecifications();

            characterSpecifications.AbilitiesRandomizerType = "abilities randomizer type";
            characterSpecifications.AlignmentRandomizerType = "alignment randomizer type";
            characterSpecifications.BaseRaceRandomizerType = "base race randomizer type";
            characterSpecifications.ClassNameRandomizerType = "class name randomizer type";
            characterSpecifications.LevelRandomizerType = "level randomizer type";
            characterSpecifications.MetaraceRandomizerType = "metarace randomizer type";
            characterSpecifications.SetAlignment = "set alignment";
            characterSpecifications.SetBaseRace = "set base race";
            characterSpecifications.SetCharisma = 9266;
            characterSpecifications.SetClassName = "set class name";
            characterSpecifications.SetConstitution = 90210;
            characterSpecifications.SetDexterity = 42;
            characterSpecifications.SetIntelligence = 600;
            characterSpecifications.SetLevel = 1337;
            characterSpecifications.SetMetarace = "set metarace";
            characterSpecifications.SetStrength = 1234;
            characterSpecifications.SetWisdom = 2345;

            clientId = Guid.NewGuid();

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer(characterSpecifications.MetaraceRandomizerType, characterSpecifications.ForceMetarace, characterSpecifications.SetMetarace)).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetAbilitiesRandomizer(
                characterSpecifications.AbilitiesRandomizerType,
                characterSpecifications.SetStrength,
                characterSpecifications.SetConstitution,
                characterSpecifications.SetDexterity,
                characterSpecifications.SetIntelligence,
                characterSpecifications.SetWisdom,
                characterSpecifications.SetCharisma,
                characterSpecifications.AllowAbilityAdjustments)).Returns(mockAbilitiesRandomizer.Object);

            character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object,
                mockClassNameRandomizer.Object,
                mockLevelRandomizer.Object,
                mockBaseRaceRandomizer.Object,
                mockMetaraceRandomizer.Object,
                mockAbilitiesRandomizer.Object)).Returns(character);
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
            Assert.That(result.Model, Is.InstanceOf<CharacterViewModel>());
        }

        [Test]
        public void IndexViewHasAlignmentRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterViewModel;
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
            var model = result.Model as CharacterViewModel;
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
            var model = result.Model as CharacterViewModel;
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.AnyNPC));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.DivineSpellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.ArcaneSpellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.NonSpellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Spellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Stealth));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.PhysicalCombat));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.ClassNameRandomizerTypes.Count(), Is.EqualTo(9));
        }

        [Test]
        public void IndexViewHasClassNames()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterViewModel;
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
            var model = result.Model as CharacterViewModel;
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
            var model = result.Model as CharacterViewModel;
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.AquaticBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.MonsterBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.NonStandardBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.BaseRace.StandardBase));
            Assert.That(model.BaseRaceRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.BaseRaceRandomizerTypes.Count(), Is.EqualTo(7));
        }

        [Test]
        public void IndexViewHasBaseRaces()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterViewModel;
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Aasimar));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.AquaticElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Azer));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.BlueSlaad));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Bugbear));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Centaur));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.CloudGiant));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.DeathSlaad));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.DeepDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.DeepHalfling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Derro));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Doppelganger));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Drow));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.DuergarDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.FireGiant));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.ForestGnome));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.FrostGiant));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Gargoyle));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Githyanki));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Githzerai));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Gnoll));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Goblin));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.GrayElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.GraySlaad));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.GreenSlaad));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Grimlock));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HalfElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HalfOrc));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Harpy));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HighElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HillDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HillGiant));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Hobgoblin));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.HoundArchon));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Human));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Janni));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Kapoacinth));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Kobold));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.KuoToa));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.LightfootHalfling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Lizardfolk));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Locathah));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Merfolk));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Merrow));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.MindFlayer));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Minotaur));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.MountainDwarf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Ogre));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.OgreMage));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Orc));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Pixie));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Rakshasa));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.RedSlaad));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.RockGnome));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Sahuagin));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Satyr));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Scorpionfolk));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Scrag));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.StoneGiant));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.StormGiant));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Svirfneblin));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.TallfellowHalfling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Tiefling));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.Troglodyte));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.WildElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.WoodElf));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.YuanTiAbomination));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.YuanTiHalfblood));
            Assert.That(model.BaseRaces, Contains.Item(RaceConstants.BaseRaces.YuanTiPureblood));
            Assert.That(model.BaseRaces.Count(), Is.EqualTo(70));
        }

        [Test]
        public void IndexViewHasMetaraceRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterViewModel;
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.GeneticMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.NoMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RaceRandomizerTypeConstants.Metarace.UndeadMeta));
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.MetaraceRandomizerTypes.Count(), Is.EqualTo(6));
        }

        [Test]
        public void IndexViewHasMetaraces()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterViewModel;
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Ghost));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfCelestial));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfDragon));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfFiend));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Lich));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Mummy));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Vampire));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Werebear));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Wereboar));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Wererat));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Weretiger));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Werewolf));
            Assert.That(model.Metaraces.Count(), Is.EqualTo(12));
        }

        [Test]
        public void IndexViewHasStatsRandomizerTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterViewModel;
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.Average));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.BestOfFour));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.Good));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.Heroic));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.OnesAsSixes));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.Poor));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.Raw));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(AbilitiesRandomizerTypeConstants.TwoTenSidedDice));
            Assert.That(model.AbilitiesRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.AbilitiesRandomizerTypes.Count(), Is.EqualTo(9));
        }

        [Test]
        public void IndexViewHasDefaultRandomizerTypeFirst()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as CharacterViewModel;
            Assert.That(model.AlignmentRandomizerTypes.First(), Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(model.ClassNameRandomizerTypes.First(), Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(model.LevelRandomizerTypes.First(), Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(model.BaseRaceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(model.MetaraceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(model.AbilitiesRandomizerTypes.First(), Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GenerateSetsClientId()
        {
            var result = controller.Generate(clientId, characterSpecifications);
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var result = controller.Generate(clientId, characterSpecifications);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateReturnsCharacterFromGenerator()
        {
            var result = controller.Generate(clientId, characterSpecifications);
            dynamic data = result.Value;
            Assert.That(data.character, Is.EqualTo(character));
        }

        [Test]
        public void GenerateSortsCharacterSkills()
        {
            character.Skills = new[]
            {
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            };

            Assert.That(character.Skills, Is.Not.Ordered.By("Name"));

            var result = controller.Generate(clientId, characterSpecifications);
            dynamic data = result.Value;
            Assert.That(data.character, Is.EqualTo(character));
            Assert.That(character.Skills, Is.Ordered.By("Name").Then.By("Focus"));
        }
    }
}
