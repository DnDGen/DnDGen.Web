using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Generators.Characters;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using DnDGen.CharacterGen.Verifiers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Functions
{
    public class GenerateCharacterFunctionTests
    {
        private GenerateCharacterFunction function;
        private Mock<IRandomizerRepository> mockRandomizerRepository;
        private Mock<ICharacterGenerator> mockCharacterGenerator;
        private Mock<IRandomizerVerifier> mockRandomizerVerifier;
        private Mock<ILogger> mockLogger;
        private HttpRequest request;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockCharacterGenerator = new Mock<ICharacterGenerator>();
            mockRandomizerVerifier = new Mock<IRandomizerVerifier>();
            mockLogger = new Mock<ILogger>();
            request = RequestHelper.BuildRequest();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IRandomizerRepository>()).Returns(mockRandomizerRepository.Object);
            mockDependencyFactory.Setup(f => f.Get<ICharacterGenerator>()).Returns(mockCharacterGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<IRandomizerVerifier>()).Returns(mockRandomizerVerifier.Object);

            function = new GenerateCharacterFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter_WithDefaults()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(AlignmentRandomizerTypeConstants.Any, null))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.AnyPlayer, null))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Any, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.AnyBase, null))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.AnyMeta, false, null))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.Raw, 0, 0, 0, 0, 0, 0, false))
                .Returns(mockAbilitiesRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(true);

            var character = new Character();
            character.Alignment = new DnDGen.CharacterGen.Alignments.Alignment("my alignment");
            character.Class.Level = 42;
            character.Class.Name = "my class";
            character.Race.BaseRace = "my base race";

            mockCharacterGenerator
                .Setup(g => g.GenerateWith(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object,
                    mockAbilitiesRandomizer.Object))
                .Returns(character);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(character));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter()
        {
            var query = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";
            query += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.PhysicalCombat)}";
            query += $"&levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Medium)}";
            query += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)}";
            query += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}";
            query += $"&abilitiesRandomizerType={HttpUtility.UrlEncode(AbilitiesRandomizerTypeConstants.OnesAsSixes)}";

            request = RequestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(AlignmentRandomizerTypeConstants.NonEvil, null))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.PhysicalCombat, null))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Medium, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase, null))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.GeneticMeta, false, null))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.OnesAsSixes, 0, 0, 0, 0, 0, 0, false))
                .Returns(mockAbilitiesRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(true);

            var character = new Character();
            character.Alignment = new DnDGen.CharacterGen.Alignments.Alignment("my alignment");
            character.Class.Level = 42;
            character.Class.Name = "my class";
            character.Race.BaseRace = "my base race";

            mockCharacterGenerator
                .Setup(g => g.GenerateWith(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object,
                    mockAbilitiesRandomizer.Object))
                .Returns(character);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(character));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter_ForceMetarace()
        {
            var query = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";
            query += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.PhysicalCombat)}";
            query += $"&levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Medium)}";
            query += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)}";
            query += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}";
            query += "&forceMetarace=true";
            query += $"&abilitiesRandomizerType={HttpUtility.UrlEncode(AbilitiesRandomizerTypeConstants.OnesAsSixes)}";

            request = RequestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(AlignmentRandomizerTypeConstants.NonEvil, null))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.PhysicalCombat, null))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Medium, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase, null))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.GeneticMeta, true, null))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.OnesAsSixes, 0, 0, 0, 0, 0, 0, false))
                .Returns(mockAbilitiesRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(true);

            var character = new Character();
            character.Alignment = new DnDGen.CharacterGen.Alignments.Alignment("my alignment");
            character.Class.Level = 42;
            character.Class.Name = "my class";
            character.Race.BaseRace = "my base race";

            mockCharacterGenerator
                .Setup(g => g.GenerateWith(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object,
                    mockAbilitiesRandomizer.Object))
                .Returns(character);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(character));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter_WithSetValues()
        {
            var query = "?alignmentRandomizerType=set";
            query += $"&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticNeutral)}";
            query += "&classNameRandomizerType=set";
            query += $"&setClassName={HttpUtility.UrlEncode(CharacterClassConstants.Cleric)}";
            query += "&levelRandomizerType=set";
            query += "&setLevel=2";
            query += "&baseRaceRandomizerType=set";
            query += $"&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.MountainDwarf)}";
            query += "&metaraceRandomizerType=set";
            query += $"&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.Wereboar)}";
            query += "&abilitiesRandomizerType=set";
            query += "&setStrength=9266";
            query += "&setConstitution=90210";
            query += "&setDexterity=42";
            query += "&setIntelligence=600";
            query += "&setWisdom=1337";
            query += "&setCharisma=1336";
            query += "&allowAbilityAdjustments=true";

            request = RequestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(RandomizerTypeConstants.NonEvil, null))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.PhysicalCombat, null))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Medium, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase, null))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.GeneticMeta, false, null))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.OnesAsSixes, 0, 0, 0, 0, 0, 0, false))
                .Returns(mockAbilitiesRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(true);

            var character = new Character();
            character.Alignment = new DnDGen.CharacterGen.Alignments.Alignment("my alignment");
            character.Class.Level = 42;
            character.Class.Name = "my class";
            character.Race.BaseRace = "my base race";

            mockCharacterGenerator
                .Setup(g => g.GenerateWith(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object,
                    mockAbilitiesRandomizer.Object))
                .Returns(character);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(character));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersInvalid()
        {
            request = RequestHelper.BuildRequest("?alignmentRandomizerType=set");

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters are not a valid combination. Error: xxx", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenRandomizersIncompatible()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(AlignmentRandomizerTypeConstants.Any, null))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.AnyPlayer, null))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Any, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.AnyBase, null))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.AnyMeta, false, null))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.Raw, 0, 0, 0, 0, 0, 0, false))
                .Returns(mockAbilitiesRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(false);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog("Randomizers are not a valid combination.", LogLevel.Error);
        }

        [Test]
        public void NeedMoreTests()
        {
            Assert.Fail("Validate Randomizers functions tests");
            Assert.Fail("Leadership functions tests");
            Assert.Fail("Cohort functions tests");
            Assert.Fail("Follower functions tests");
        }
    }
}