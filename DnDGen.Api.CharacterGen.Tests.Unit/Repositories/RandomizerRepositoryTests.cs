﻿using DnDGen.Api.CharacterGen.Models;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using DnDGen.Infrastructure.Generators;
using Moq;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Repositories
{
    [TestFixture]
    public class RandomizerRepositoryTests
    {
        private IRandomizerRepository randomizerRepository;
        private Mock<JustInTimeFactory> mockJustInTimeFactory;

        [SetUp]
        public void Setup()
        {
            mockJustInTimeFactory = new Mock<JustInTimeFactory>();
            randomizerRepository = new RandomizerRepository(mockJustInTimeFactory.Object);
        }

        [Test]
        public void GetAlignmentRandomizer()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IAlignmentRandomizer>("alignment randomizer type")).Returns(mockAlignmentRandomizer.Object);

            var mockSetAlignmentRandomizer = new Mock<ISetAlignmentRandomizer>();
            var setAlignment = new Alignment();
            mockSetAlignmentRandomizer.SetupAllProperties();
            mockSetAlignmentRandomizer.Object.SetAlignment = setAlignment;
            mockJustInTimeFactory.Setup(f => f.Build<ISetAlignmentRandomizer>()).Returns(mockSetAlignmentRandomizer.Object);

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer("alignment randomizer type", "set alignment");
            Assert.That(alignmentRandomizer, Is.EqualTo(mockAlignmentRandomizer.Object));
        }

        [Test]
        public void GetSetAlignmentRandomizer()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IAlignmentRandomizer>("alignment randomizer type")).Returns(mockAlignmentRandomizer.Object);

            var mockSetAlignmentRandomizer = new Mock<ISetAlignmentRandomizer>();
            var setAlignment = new Alignment();
            mockSetAlignmentRandomizer.SetupAllProperties();
            mockSetAlignmentRandomizer.Object.SetAlignment = setAlignment;
            mockJustInTimeFactory.Setup(f => f.Build<ISetAlignmentRandomizer>()).Returns(mockSetAlignmentRandomizer.Object);

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(RandomizerTypeConstants.Set, "set alignment");
            Assert.That(alignmentRandomizer, Is.EqualTo(mockSetAlignmentRandomizer.Object));

            var setAlignmentRandomizer = alignmentRandomizer as ISetAlignmentRandomizer;
            Assert.That(setAlignmentRandomizer.SetAlignment.Lawfulness, Is.EqualTo("set"));
            Assert.That(setAlignmentRandomizer.SetAlignment.Goodness, Is.EqualTo("alignment"));
        }

        [Test]
        public void TrueNeutralBecomesNeutralNeutral()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IAlignmentRandomizer>("alignment randomizer type")).Returns(mockAlignmentRandomizer.Object);

            var mockSetAlignmentRandomizer = new Mock<ISetAlignmentRandomizer>();
            var setAlignment = new Alignment();
            mockSetAlignmentRandomizer.SetupAllProperties();
            mockSetAlignmentRandomizer.Object.SetAlignment = setAlignment;
            mockJustInTimeFactory.Setup(f => f.Build<ISetAlignmentRandomizer>()).Returns(mockSetAlignmentRandomizer.Object);

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(RandomizerTypeConstants.Set, "True Neutral");
            Assert.That(alignmentRandomizer, Is.EqualTo(mockSetAlignmentRandomizer.Object));

            var setAlignmentRandomizer = alignmentRandomizer as ISetAlignmentRandomizer;
            Assert.That(setAlignmentRandomizer.SetAlignment.Lawfulness, Is.EqualTo(AlignmentConstants.Neutral));
            Assert.That(setAlignmentRandomizer.SetAlignment.Goodness, Is.EqualTo(AlignmentConstants.Neutral));
        }

        [Test]
        public void GetClassNameRandomizer()
        {
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IClassNameRandomizer>("class name randomizer type")).Returns(mockClassNameRandomizer.Object);

            var mockSetClassNameRandomizer = new Mock<ISetClassNameRandomizer>();
            mockSetClassNameRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetClassNameRandomizer>()).Returns(mockSetClassNameRandomizer.Object);

            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer("class name randomizer type", "set class name");
            Assert.That(classNameRandomizer, Is.EqualTo(mockClassNameRandomizer.Object));
        }

        [Test]
        public void GetSetClassNameRandomizer()
        {
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IClassNameRandomizer>("class name randomizer type")).Returns(mockClassNameRandomizer.Object);

            var mockSetClassNameRandomizer = new Mock<ISetClassNameRandomizer>();
            mockSetClassNameRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetClassNameRandomizer>()).Returns(mockSetClassNameRandomizer.Object);

            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(RandomizerTypeConstants.Set, "set class name");
            Assert.That(classNameRandomizer, Is.EqualTo(mockSetClassNameRandomizer.Object));

            var setClassNameRandomizer = classNameRandomizer as ISetClassNameRandomizer;
            Assert.That(setClassNameRandomizer.SetClassName, Is.EqualTo("set class name"));
        }

        [Test]
        public void GetLevelRandomizer()
        {
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<ILevelRandomizer>("level randomizer type")).Returns(mockLevelRandomizer.Object);

            var mockSetLevelRandomizer = new Mock<ISetLevelRandomizer>();
            mockSetLevelRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetLevelRandomizer>()).Returns(mockSetLevelRandomizer.Object);

            var levelRandomizer = randomizerRepository.GetLevelRandomizer("level randomizer type", 9266);
            Assert.That(levelRandomizer, Is.EqualTo(mockLevelRandomizer.Object));
        }

        [Test]
        public void GetSetLevelRandomizer()
        {
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<ILevelRandomizer>("level randomizer type")).Returns(mockLevelRandomizer.Object);

            var mockSetLevelRandomizer = new Mock<ISetLevelRandomizer>();
            mockSetLevelRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetLevelRandomizer>()).Returns(mockSetLevelRandomizer.Object);

            var levelRandomizer = randomizerRepository.GetLevelRandomizer(RandomizerTypeConstants.Set, 9266);
            Assert.That(levelRandomizer, Is.EqualTo(mockSetLevelRandomizer.Object));

            var setLevelRandomizer = levelRandomizer as ISetLevelRandomizer;
            Assert.That(setLevelRandomizer.SetLevel, Is.EqualTo(9266));
        }

        [Test]
        public void GetBaseRaceRandomizer()
        {
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<RaceRandomizer>("base race randomizer type")).Returns(mockBaseRaceRandomizer.Object);

            var mockSetBaseRaceRandomizer = new Mock<ISetBaseRaceRandomizer>();
            mockSetBaseRaceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetBaseRaceRandomizer>()).Returns(mockSetBaseRaceRandomizer.Object);

            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer("base race randomizer type", "set base race");
            Assert.That(baseRaceRandomizer, Is.EqualTo(mockBaseRaceRandomizer.Object));
        }

        [Test]
        public void GetSetBaseRaceRandomizer()
        {
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<RaceRandomizer>("base race randomizer type")).Returns(mockBaseRaceRandomizer.Object);

            var mockSetBaseRaceRandomizer = new Mock<ISetBaseRaceRandomizer>();
            mockSetBaseRaceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetBaseRaceRandomizer>()).Returns(mockSetBaseRaceRandomizer.Object);

            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(RandomizerTypeConstants.Set, "set base race");
            Assert.That(baseRaceRandomizer, Is.EqualTo(mockSetBaseRaceRandomizer.Object));

            var setBaseRaceRandomizer = baseRaceRandomizer as ISetBaseRaceRandomizer;
            Assert.That(setBaseRaceRandomizer.SetBaseRace, Is.EqualTo("set base race"));
        }

        [Test]
        public void GetMetaraceRandomizer()
        {
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<RaceRandomizer>("metarace randomizer type")).Returns(mockMetaraceRandomizer.Object);

            var mockSetMetaraceRandomizer = new Mock<ISetMetaraceRandomizer>();
            mockSetMetaraceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetMetaraceRandomizer>()).Returns(mockSetMetaraceRandomizer.Object);

            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer("metarace randomizer type", true, "set metarace");
            Assert.That(metaraceRandomizer, Is.EqualTo(mockMetaraceRandomizer.Object));
        }

        [Test]
        public void GetForcedMetaraceRandomizer()
        {
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            mockMetaraceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<RaceRandomizer>("metarace randomizer type")).Returns(mockMetaraceRandomizer.Object);

            var mockSetMetaraceRandomizer = new Mock<ISetMetaraceRandomizer>();
            mockSetMetaraceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetMetaraceRandomizer>()).Returns(mockSetMetaraceRandomizer.Object);

            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer("metarace randomizer type", true, "set metarace");
            Assert.That(metaraceRandomizer, Is.EqualTo(mockMetaraceRandomizer.Object));

            var forcableMetaraceRandomizer = metaraceRandomizer as IForcableMetaraceRandomizer;
            Assert.That(forcableMetaraceRandomizer.ForceMetarace, Is.True);
        }

        [Test]
        public void GetNonForcedMetaraceRandomizer()
        {
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            mockMetaraceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<RaceRandomizer>("metarace randomizer type")).Returns(mockMetaraceRandomizer.Object);

            var mockSetMetaraceRandomizer = new Mock<ISetMetaraceRandomizer>();
            mockSetMetaraceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetMetaraceRandomizer>()).Returns(mockSetMetaraceRandomizer.Object);

            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer("metarace randomizer type", false, "set metarace");
            Assert.That(metaraceRandomizer, Is.EqualTo(mockMetaraceRandomizer.Object));

            var forcableMetaraceRandomizer = metaraceRandomizer as IForcableMetaraceRandomizer;
            Assert.That(forcableMetaraceRandomizer.ForceMetarace, Is.False);
        }

        [Test]
        public void GetSetMetaraceRandomizer()
        {
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<RaceRandomizer>("metarace randomizer type")).Returns(mockMetaraceRandomizer.Object);

            var mockSetMetaraceRandomizer = new Mock<ISetMetaraceRandomizer>();
            mockSetMetaraceRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetMetaraceRandomizer>()).Returns(mockSetMetaraceRandomizer.Object);

            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(RandomizerTypeConstants.Set, true, "set metarace");
            Assert.That(metaraceRandomizer, Is.EqualTo(mockSetMetaraceRandomizer.Object));

            var setMetaraceRandomizer = metaraceRandomizer as ISetMetaraceRandomizer;
            Assert.That(setMetaraceRandomizer.SetMetarace, Is.EqualTo("set metarace"));
        }

        [Test]
        public void GetStatsRandomizer()
        {
            var mockStatsRandomizer = new Mock<IAbilitiesRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IAbilitiesRandomizer>("stat randomizer type")).Returns(mockStatsRandomizer.Object);

            var mockSetStatsRandomizer = new Mock<ISetAbilitiesRandomizer>();
            mockSetStatsRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetAbilitiesRandomizer>()).Returns(mockSetStatsRandomizer.Object);

            var statsRandomizer = randomizerRepository.GetAbilitiesRandomizer("stat randomizer type", 90210, 42, 600, 1337, 12345, 23456, true);
            Assert.That(statsRandomizer, Is.EqualTo(mockStatsRandomizer.Object));
        }

        [Test]
        public void GetSetStatsRandomizer()
        {
            var mockStatsRandomizer = new Mock<IAbilitiesRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IAbilitiesRandomizer>("stat randomizer type")).Returns(mockStatsRandomizer.Object);

            var mockSetStatsRandomizer = new Mock<ISetAbilitiesRandomizer>();
            mockSetStatsRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetAbilitiesRandomizer>()).Returns(mockSetStatsRandomizer.Object);

            var statsRandomizer = randomizerRepository.GetAbilitiesRandomizer(RandomizerTypeConstants.Set, 90210, 42, 600, 1337, 12345, 23456, true);
            Assert.That(statsRandomizer, Is.EqualTo(mockSetStatsRandomizer.Object));

            var setStatsRandomizer = statsRandomizer as ISetAbilitiesRandomizer;
            Assert.That(setStatsRandomizer.SetCharisma, Is.EqualTo(23456));
            Assert.That(setStatsRandomizer.SetConstitution, Is.EqualTo(42));
            Assert.That(setStatsRandomizer.SetDexterity, Is.EqualTo(600));
            Assert.That(setStatsRandomizer.SetIntelligence, Is.EqualTo(1337));
            Assert.That(setStatsRandomizer.SetStrength, Is.EqualTo(90210));
            Assert.That(setStatsRandomizer.SetWisdom, Is.EqualTo(12345));
            Assert.That(setStatsRandomizer.AllowAdjustments, Is.True);
        }

        [Test]
        public void GetSetStatsRandomizerNotAllowingAdjustments()
        {
            var mockStatsRandomizer = new Mock<IAbilitiesRandomizer>();
            mockJustInTimeFactory.Setup(f => f.Build<IAbilitiesRandomizer>("stat randomizer type")).Returns(mockStatsRandomizer.Object);

            var mockSetStatsRandomizer = new Mock<ISetAbilitiesRandomizer>();
            mockSetStatsRandomizer.SetupAllProperties();
            mockJustInTimeFactory.Setup(f => f.Build<ISetAbilitiesRandomizer>()).Returns(mockSetStatsRandomizer.Object);

            var statsRandomizer = randomizerRepository.GetAbilitiesRandomizer(RandomizerTypeConstants.Set, 90210, 42, 600, 1337, 12345, 23456, false);
            Assert.That(statsRandomizer, Is.EqualTo(mockSetStatsRandomizer.Object));

            var setStatsRandomizer = statsRandomizer as ISetAbilitiesRandomizer;
            Assert.That(setStatsRandomizer.SetCharisma, Is.EqualTo(23456));
            Assert.That(setStatsRandomizer.SetConstitution, Is.EqualTo(42));
            Assert.That(setStatsRandomizer.SetDexterity, Is.EqualTo(600));
            Assert.That(setStatsRandomizer.SetIntelligence, Is.EqualTo(1337));
            Assert.That(setStatsRandomizer.SetStrength, Is.EqualTo(90210));
            Assert.That(setStatsRandomizer.SetWisdom, Is.EqualTo(12345));
            Assert.That(setStatsRandomizer.AllowAdjustments, Is.False);
        }
    }
}
