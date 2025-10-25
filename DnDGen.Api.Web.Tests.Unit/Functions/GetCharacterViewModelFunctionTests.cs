using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models;
using DnDGen.CharacterGen.Abilities.Randomizers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.Alignments.Randomizers;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.CharacterClasses.Randomizers.ClassNames;
using DnDGen.CharacterGen.CharacterClasses.Randomizers.Levels;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Races.Randomizers;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.Web.Tests.Unit.Functions
{
    public class GetCharacterViewModelFunctionTests
    {
        private GetCharacterViewModelFunction function;
        private Mock<ILogger<GetCharacterViewModelFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger<GetCharacterViewModelFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.Web.Functions.GetCharacterViewModelFunction")).Returns(mockLogger.Object);

            function = new GetCharacterViewModelFunction(mockLoggerFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheCharacterViewModel()
        {
            var request = requestHelper.BuildRequest();

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var model = StreamHelper.Read<CharacterViewModel>(response.Body);
            Assert.That(model, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(model.AlignmentRandomizerTypes, Is.EquivalentTo(
                        [
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
                    RandomizerTypeConstants.Set,
                ]));
                Assert.That(model.Alignments, Is.EquivalentTo(
                [
                    AlignmentConstants.ChaoticEvil,
                    AlignmentConstants.ChaoticGood,
                    AlignmentConstants.ChaoticNeutral,
                    AlignmentConstants.LawfulEvil,
                    AlignmentConstants.LawfulGood,
                    AlignmentConstants.LawfulNeutral,
                    AlignmentConstants.NeutralEvil,
                    AlignmentConstants.NeutralGood,
                    AlignmentConstants.TrueNeutral,
                ]));
                Assert.That(model.ClassNameRandomizerTypes, Is.EquivalentTo(
                [
                    ClassNameRandomizerTypeConstants.AnyPlayer,
                    ClassNameRandomizerTypeConstants.AnyNPC,
                    ClassNameRandomizerTypeConstants.DivineSpellcaster,
                    ClassNameRandomizerTypeConstants.ArcaneSpellcaster,
                    ClassNameRandomizerTypeConstants.NonSpellcaster,
                    ClassNameRandomizerTypeConstants.Spellcaster,
                    ClassNameRandomizerTypeConstants.Stealth,
                    ClassNameRandomizerTypeConstants.PhysicalCombat,
                    RandomizerTypeConstants.Set,
                ]));
                Assert.That(model.ClassNames, Is.EquivalentTo(
                [
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
                    CharacterClassConstants.Warrior,
                ]));
                Assert.That(model.LevelRandomizerTypes, Is.EquivalentTo(
                [
                    LevelRandomizerTypeConstants.Any,
                    LevelRandomizerTypeConstants.High,
                    LevelRandomizerTypeConstants.Low,
                    LevelRandomizerTypeConstants.Medium,
                    LevelRandomizerTypeConstants.VeryHigh,
                    RandomizerTypeConstants.Set,
                ]));
                Assert.That(model.BaseRaceRandomizerTypes, Is.EquivalentTo(
                [
                    RaceRandomizerTypeConstants.BaseRace.AnyBase,
                    RaceRandomizerTypeConstants.BaseRace.AquaticBase,
                    RaceRandomizerTypeConstants.BaseRace.MonsterBase,
                    RaceRandomizerTypeConstants.BaseRace.NonMonsterBase,
                    RaceRandomizerTypeConstants.BaseRace.NonStandardBase,
                    RaceRandomizerTypeConstants.BaseRace.StandardBase,
                    RandomizerTypeConstants.Set,
                ]));
                Assert.That(model.BaseRaces, Is.EquivalentTo(
                [
                    RaceConstants.BaseRaces.Aasimar,
                    RaceConstants.BaseRaces.AquaticElf,
                    RaceConstants.BaseRaces.Azer,
                    RaceConstants.BaseRaces.BlueSlaad,
                    RaceConstants.BaseRaces.Bugbear,
                    RaceConstants.BaseRaces.Centaur,
                    RaceConstants.BaseRaces.CloudGiant,
                    RaceConstants.BaseRaces.DeathSlaad,
                    RaceConstants.BaseRaces.DeepDwarf,
                    RaceConstants.BaseRaces.DeepHalfling,
                    RaceConstants.BaseRaces.Derro,
                    RaceConstants.BaseRaces.Doppelganger,
                    RaceConstants.BaseRaces.Drow,
                    RaceConstants.BaseRaces.DuergarDwarf,
                    RaceConstants.BaseRaces.FireGiant,
                    RaceConstants.BaseRaces.ForestGnome,
                    RaceConstants.BaseRaces.FrostGiant,
                    RaceConstants.BaseRaces.Gargoyle,
                    RaceConstants.BaseRaces.Githyanki,
                    RaceConstants.BaseRaces.Githzerai,
                    RaceConstants.BaseRaces.Gnoll,
                    RaceConstants.BaseRaces.Goblin,
                    RaceConstants.BaseRaces.GrayElf,
                    RaceConstants.BaseRaces.GraySlaad,
                    RaceConstants.BaseRaces.GreenSlaad,
                    RaceConstants.BaseRaces.Grimlock,
                    RaceConstants.BaseRaces.HalfElf,
                    RaceConstants.BaseRaces.HalfOrc,
                    RaceConstants.BaseRaces.Harpy,
                    RaceConstants.BaseRaces.HighElf,
                    RaceConstants.BaseRaces.HillDwarf,
                    RaceConstants.BaseRaces.HillGiant,
                    RaceConstants.BaseRaces.Hobgoblin,
                    RaceConstants.BaseRaces.HoundArchon,
                    RaceConstants.BaseRaces.Human,
                    RaceConstants.BaseRaces.Janni,
                    RaceConstants.BaseRaces.Kapoacinth,
                    RaceConstants.BaseRaces.Kobold,
                    RaceConstants.BaseRaces.KuoToa,
                    RaceConstants.BaseRaces.LightfootHalfling,
                    RaceConstants.BaseRaces.Lizardfolk,
                    RaceConstants.BaseRaces.Locathah,
                    RaceConstants.BaseRaces.Merfolk,
                    RaceConstants.BaseRaces.Merrow,
                    RaceConstants.BaseRaces.MindFlayer,
                    RaceConstants.BaseRaces.Minotaur,
                    RaceConstants.BaseRaces.MountainDwarf,
                    RaceConstants.BaseRaces.Mummy,
                    RaceConstants.BaseRaces.Ogre,
                    RaceConstants.BaseRaces.OgreMage,
                    RaceConstants.BaseRaces.Orc,
                    RaceConstants.BaseRaces.Pixie,
                    RaceConstants.BaseRaces.Rakshasa,
                    RaceConstants.BaseRaces.RedSlaad,
                    RaceConstants.BaseRaces.RockGnome,
                    RaceConstants.BaseRaces.Sahuagin,
                    RaceConstants.BaseRaces.Satyr,
                    RaceConstants.BaseRaces.Scorpionfolk,
                    RaceConstants.BaseRaces.Scrag,
                    RaceConstants.BaseRaces.StoneGiant,
                    RaceConstants.BaseRaces.StormGiant,
                    RaceConstants.BaseRaces.Svirfneblin,
                    RaceConstants.BaseRaces.TallfellowHalfling,
                    RaceConstants.BaseRaces.Tiefling,
                    RaceConstants.BaseRaces.Troglodyte,
                    RaceConstants.BaseRaces.Troll,
                    RaceConstants.BaseRaces.WildElf,
                    RaceConstants.BaseRaces.WoodElf,
                    RaceConstants.BaseRaces.YuanTiAbomination,
                    RaceConstants.BaseRaces.YuanTiHalfblood,
                    RaceConstants.BaseRaces.YuanTiPureblood,
                ]));
                Assert.That(model.MetaraceRandomizerTypes, Is.EquivalentTo(
                [
                    RaceRandomizerTypeConstants.Metarace.AnyMeta,
                    RaceRandomizerTypeConstants.Metarace.GeneticMeta,
                    RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,
                    RaceRandomizerTypeConstants.Metarace.NoMeta,
                    RaceRandomizerTypeConstants.Metarace.UndeadMeta,
                    RandomizerTypeConstants.Set,
                ]));
                Assert.That(model.Metaraces, Is.EquivalentTo(
                [
                    RaceConstants.Metaraces.Ghost,
                    RaceConstants.Metaraces.HalfCelestial,
                    RaceConstants.Metaraces.HalfDragon,
                    RaceConstants.Metaraces.HalfFiend,
                    RaceConstants.Metaraces.Lich,
                    RaceConstants.Metaraces.Vampire,
                    RaceConstants.Metaraces.Werebear,
                    RaceConstants.Metaraces.Wereboar,
                    RaceConstants.Metaraces.Wereboar_Dire,
                    RaceConstants.Metaraces.Wererat,
                    RaceConstants.Metaraces.Weretiger,
                    RaceConstants.Metaraces.Werewolf,
                    RaceConstants.Metaraces.Werewolf_Dire,
                ]));
                Assert.That(model.AbilitiesRandomizerTypes, Is.EquivalentTo(
                [
                    AbilitiesRandomizerTypeConstants.Average,
                    AbilitiesRandomizerTypeConstants.BestOfFour,
                    AbilitiesRandomizerTypeConstants.Good,
                    AbilitiesRandomizerTypeConstants.Heroic,
                    AbilitiesRandomizerTypeConstants.OnesAsSixes,
                    AbilitiesRandomizerTypeConstants.Poor,
                    AbilitiesRandomizerTypeConstants.TwoTenSidedDice,
                    RandomizerTypeConstants.Set,
                ]));
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(model.AlignmentRandomizerTypes.First(), Is.EqualTo(AlignmentRandomizerTypeConstants.Default));
                Assert.That(model.ClassNameRandomizerTypes.First(), Is.EqualTo(ClassNameRandomizerTypeConstants.Default));
                Assert.That(model.LevelRandomizerTypes.First(), Is.EqualTo(LevelRandomizerTypeConstants.Default));
                Assert.That(model.BaseRaceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.Default));
                Assert.That(model.MetaraceRandomizerTypes.First(), Is.EqualTo(RaceRandomizerTypeConstants.Metarace.Default));
                Assert.That(model.AbilitiesRandomizerTypes.First(), Is.EqualTo(AbilitiesRandomizerTypeConstants.Default));
            }

            mockLogger.AssertLog("C# HTTP trigger function (GetCharacterViewModelFunction.Run) processed a request.");
        }
    }
}