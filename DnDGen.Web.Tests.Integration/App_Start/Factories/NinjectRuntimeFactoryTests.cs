using CharacterGen.Randomizers.Alignments;
using CharacterGen.Randomizers.CharacterClasses;
using CharacterGen.Randomizers.Races;
using CharacterGen.Randomizers.Stats;
using DnDGen.Web.App_Start.Factories;
using Ninject;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Integration.App_Start.Factories
{
    [TestFixture]
    public class NinjectRuntimeFactoryTests : IntegrationTests
    {
        [Inject]
        public RuntimeFactory NinjectRuntimeFactory { get; set; }

        [Test]
        public void CreateSetAlignmentRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<ISetAlignmentRandomizer>();
            Assert.That(randomizer, Is.InstanceOf<IAlignmentRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<ISetAlignmentRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [TestCase(AlignmentRandomizerTypeConstants.Any)]
        [TestCase(AlignmentRandomizerTypeConstants.Chaotic)]
        [TestCase(AlignmentRandomizerTypeConstants.Evil)]
        [TestCase(AlignmentRandomizerTypeConstants.Good)]
        [TestCase(AlignmentRandomizerTypeConstants.Lawful)]
        [TestCase(AlignmentRandomizerTypeConstants.Neutral)]
        [TestCase(AlignmentRandomizerTypeConstants.NonChaotic)]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.NonGood)]
        [TestCase(AlignmentRandomizerTypeConstants.NonLawful)]
        [TestCase(AlignmentRandomizerTypeConstants.NonNeutral)]
        public void CreateNamedAlignmentRandomizer(string name)
        {
            var randomizer = NinjectRuntimeFactory.Create<IAlignmentRandomizer>(name);
            Assert.That(randomizer, Is.InstanceOf<IAlignmentRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [Test]
        public void CreateSetClassNameRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<ISetClassNameRandomizer>();
            Assert.That(randomizer, Is.InstanceOf<IClassNameRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<ISetClassNameRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [TestCase(ClassNameRandomizerTypeConstants.AnyNPC)]
        [TestCase(ClassNameRandomizerTypeConstants.AnyPlayer)]
        [TestCase(ClassNameRandomizerTypeConstants.Healer)]
        [TestCase(ClassNameRandomizerTypeConstants.Mage)]
        [TestCase(ClassNameRandomizerTypeConstants.NonSpellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.Spellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.Stealth)]
        [TestCase(ClassNameRandomizerTypeConstants.Warrior)]
        public void CreateNamedClassNameRandomizer(string name)
        {
            var randomizer = NinjectRuntimeFactory.Create<IClassNameRandomizer>(name);
            Assert.That(randomizer, Is.InstanceOf<IClassNameRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [Test]
        public void CreateSetLevelRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<ISetLevelRandomizer>();
            Assert.That(randomizer, Is.InstanceOf<ILevelRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<ISetLevelRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [TestCase(LevelRandomizerTypeConstants.Any)]
        [TestCase(LevelRandomizerTypeConstants.High)]
        [TestCase(LevelRandomizerTypeConstants.Low)]
        [TestCase(LevelRandomizerTypeConstants.Medium)]
        [TestCase(LevelRandomizerTypeConstants.VeryHigh)]
        public void CreateNamedLevelRandomizer(string name)
        {
            var randomizer = NinjectRuntimeFactory.Create<ILevelRandomizer>(name);
            Assert.That(randomizer, Is.InstanceOf<ILevelRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [Test]
        public void CreateSetBaseRaceRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<ISetBaseRaceRandomizer>();
            Assert.That(randomizer, Is.InstanceOf<RaceRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<ISetBaseRaceRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [Test]
        public void CreateSetMetaraceRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<ISetMetaraceRandomizer>();
            Assert.That(randomizer, Is.InstanceOf<RaceRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<ISetMetaraceRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [TestCase(RaceRandomizerTypeConstants.BaseRace.AnyBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.EvilBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.GoodBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NeutralBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonEvilBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonGoodBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonNeutralBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonStandardBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.StandardBase)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.EvilMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GoodMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NeutralMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NonEvilMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NonGoodMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NonNeutralMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta)]
        public void CreateNamedRaceRandomizer(string name)
        {
            var randomizer = NinjectRuntimeFactory.Create<RaceRandomizer>(name);
            Assert.That(randomizer, Is.InstanceOf<RaceRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [Test]
        public void CreateSetStatsRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<ISetStatsRandomizer>();
            Assert.That(randomizer, Is.InstanceOf<IStatsRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<ISetStatsRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }

        [TestCase(StatsRandomizerTypeConstants.Average)]
        [TestCase(StatsRandomizerTypeConstants.BestOfFour)]
        [TestCase(StatsRandomizerTypeConstants.Good)]
        [TestCase(StatsRandomizerTypeConstants.Heroic)]
        [TestCase(StatsRandomizerTypeConstants.OnesAsSixes)]
        [TestCase(StatsRandomizerTypeConstants.Poor)]
        [TestCase(StatsRandomizerTypeConstants.Raw)]
        [TestCase(StatsRandomizerTypeConstants.TwoTenSidedDice)]
        public void CreateNamedStatsRandomizer(string name)
        {
            var randomizer = NinjectRuntimeFactory.Create<IStatsRandomizer>(name);
            Assert.That(randomizer, Is.InstanceOf<IStatsRandomizer>());
            Assert.That(randomizer, Is.Not.Null);
        }
    }
}
