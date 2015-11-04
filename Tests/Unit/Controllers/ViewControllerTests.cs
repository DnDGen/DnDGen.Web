using CharacterGen.Common.CharacterClasses;
using CharacterGen.Common.Races;
using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Randomizers.Stats;
using DNDGenSite.App_Start.Factories;
using DNDGenSite.Controllers;
using DNDGenSite.Models;
using NUnit.Framework;
using System;
using System.Linq;
using System.Web.Mvc;
using TreasureGen.Common.Items;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class ViewControllerTests
    {
        private ViewController controller;

        [SetUp]
        public void Setup()
        {
            controller = new ViewController();
        }

        [TestCase("Home")]
        [TestCase("Roll")]
        [TestCase("Treasure")]
        [TestCase("Character")]
        [TestCase("Encounter")]
        [TestCase("Dungeon")]
        [TestCase("Error")]
        public void ActionHandlesGetVerb(String methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void HomeReturnsView()
        {
            var result = controller.Home();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void RollReturnsView()
        {
            var result = controller.Roll();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void TreasureReturnsView()
        {
            var result = controller.Treasure();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void TreasureViewContainsModel()
        {
            var result = controller.Treasure() as ViewResult;
            Assert.That(result.Model, Is.InstanceOf<TreasureModel>());
        }

        [Test]
        public void TreasureViewHasMaxLevel()
        {
            var result = controller.Treasure() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.MaxTreasureLevel, Is.EqualTo(20));
        }

        [Test]
        public void TreasureViewHasMundaneItemTypes()
        {
            var result = controller.Treasure() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.MundaneItemTypes, Contains.Item(ItemTypeConstants.AlchemicalItem));
            Assert.That(model.MundaneItemTypes, Contains.Item(ItemTypeConstants.Tool));
            Assert.That(model.MundaneItemTypes.Count(), Is.EqualTo(2));
        }

        [TestCase(ItemTypeConstants.Armor,
            PowerConstants.Mundane,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Potion,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Ring,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Rod,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Scroll,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Staff,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Wand,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Weapon,
            PowerConstants.Mundane,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.WondrousItem,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        public void TreasureViewHasPoweredItemTypes(String itemType, params String[] powers)
        {
            var result = controller.Treasure() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.PoweredItemTypes, Contains.Item(itemType));

            var index = model.PoweredItemTypes.ToList().IndexOf(itemType);
            var itemPowers = model.ItemPowers.ElementAt(index);

            foreach (var power in powers)
                Assert.That(itemPowers, Contains.Item(power));

            var extraPowers = itemPowers.Except(powers);
            Assert.That(extraPowers, Is.Empty);
        }

        [Test]
        public void TreasureViewHas9PoweredItemTypes()
        {
            var result = controller.Treasure() as ViewResult;
            var model = result.Model as TreasureModel;
            Assert.That(model.PoweredItemTypes.Count(), Is.EqualTo(9));
        }

        [Test]
        public void TreasureViewHasTreasureTypes()
        {
            var result = controller.Treasure() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.TreasureTypes, Contains.Item("Treasure"));
            Assert.That(model.TreasureTypes, Contains.Item("Coin"));
            Assert.That(model.TreasureTypes, Contains.Item("Goods"));
            Assert.That(model.TreasureTypes, Contains.Item("Items"));
            Assert.That(model.TreasureTypes.Count(), Is.EqualTo(4));
        }

        [Test]
        public void CharacterReturnsView()
        {
            var result = controller.Character();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void CharacterViewContainsModel()
        {
            var result = controller.Character() as ViewResult;
            Assert.That(result.Model, Is.InstanceOf<CharacterModel>());
        }

        [Test]
        public void CharacterViewHasAlignmentRandomizerTypes()
        {
            var result = controller.Character() as ViewResult;
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
        public void CharacterViewHasAlignments()
        {
            var result = controller.Character() as ViewResult;
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
        public void CharacterViewHasClassNameRandomizerTypes()
        {
            var result = controller.Character() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Any));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Healer));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Mage));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.NonSpellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Spellcaster));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Stealth));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(ClassNameRandomizerTypeConstants.Warrior));
            Assert.That(model.ClassNameRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.ClassNameRandomizerTypes.Count(), Is.EqualTo(8));
        }

        [Test]
        public void CharacterViewHasClassNames()
        {
            var result = controller.Character() as ViewResult;
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
            Assert.That(model.ClassNames.Count(), Is.EqualTo(11));
        }

        [Test]
        public void CharacterViewHasLevelRandomizerTypes()
        {
            var result = controller.Character() as ViewResult;
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
        public void CharacterViewHasBaseRaceRandomizerTypes()
        {
            var result = controller.Character() as ViewResult;
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
        public void CharacterViewHasBaseRaces()
        {
            var result = controller.Character() as ViewResult;
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
        public void CharacterViewHasMetaraceRandomizerTypes()
        {
            var result = controller.Character() as ViewResult;
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
            Assert.That(model.MetaraceRandomizerTypes, Contains.Item(RandomizerTypeConstants.Set));
            Assert.That(model.MetaraceRandomizerTypes.Count(), Is.EqualTo(11));
        }

        [Test]
        public void CharacterViewHasMetaraces()
        {
            var result = controller.Character() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfCelestial));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfDragon));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.HalfFiend));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Werebear));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Wereboar));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Wererat));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Weretiger));
            Assert.That(model.Metaraces, Contains.Item(RaceConstants.Metaraces.Werewolf));
            Assert.That(model.Metaraces.Count(), Is.EqualTo(8));
        }

        [Test]
        public void CharacterViewHasStatsRandomizerTypes()
        {
            var result = controller.Character() as ViewResult;
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
        public void CharacterViewHasDefaultRandomizerTypeFirst()
        {
            var result = controller.Character() as ViewResult;
            var model = result.Model as CharacterModel;
            Assert.That(model.AlignmentRandomizerTypes.First(), Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(model.ClassNameRandomizerTypes.First(), Is.EqualTo(ClassNameRandomizerTypeConstants.Any));
            Assert.That(model.LevelRandomizerTypes.First(), Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(model.BaseRaceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(model.MetaraceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(model.StatsRandomizerTypes.First(), Is.EqualTo(StatsRandomizerTypeConstants.Raw));
        }

        [Test]
        public void EncounterReturnsView()
        {
            var result = controller.Encounter();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void DungeonReturnsView()
        {
            var result = controller.Dungeon();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void ErrorReturnsView()
        {
            var result = controller.Error();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }
    }
}