using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Models;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Races;
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
    public class ValidateRandomizersFunctionTests
    {
        private ValidateRandomizersFunction function;
        private Mock<IRandomizerRepository> mockRandomizerRepository;
        private Mock<IRandomizerVerifier> mockRandomizerVerifier;
        private Mock<ILogger> mockLogger;
        private HttpRequest request;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockRandomizerVerifier = new Mock<IRandomizerVerifier>();
            mockLogger = new Mock<ILogger>();
            request = RequestHelper.BuildRequest();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IRandomizerRepository>()).Returns(mockRandomizerRepository.Object);
            mockDependencyFactory.Setup(f => f.Get<IRandomizerVerifier>()).Returns(mockRandomizerVerifier.Object);

            function = new ValidateRandomizersFunction(mockDependencyFactory.Object);
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheRandomizerValidity_WithDefaults(bool validity)
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();

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

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(validity);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheRandomizerValidity(bool validity)
        {
            var query = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";
            query += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.PhysicalCombat)}";
            query += $"&levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Medium)}";
            query += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)}";
            query += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}";

            request = RequestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();

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

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(validity);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheRandomizerValidity_ForceMetarace(bool validity)
        {
            var query = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";
            query += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.PhysicalCombat)}";
            query += $"&levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Medium)}";
            query += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)}";
            query += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}";
            query += "&forceMetarace=true";

            request = RequestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();

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

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(validity);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheRandomizerValidity_WithSetValues(bool validity)
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

            request = RequestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(RandomizerTypeConstants.Set, AlignmentConstants.ChaoticNeutral))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(RandomizerTypeConstants.Set, CharacterClassConstants.Cleric))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(RandomizerTypeConstants.Set, 2))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RandomizerTypeConstants.Set, RaceConstants.BaseRaces.MountainDwarf))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RandomizerTypeConstants.Set, false, RaceConstants.Metaraces.Wereboar))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(validity);

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [Test]
        public async Task Run_ReturnsTheRandomizerValidity_WhenParametersInvalid()
        {
            request = RequestHelper.BuildRequest("?alignmentRandomizerType=set");

            var result = await function.Run(request, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters are not a valid combination. Error: SetAlignment is not valid. Should be one of: [Lawful Good, Lawful Neutral, Lawful Evil, Chaotic Good, Chaotic Neutral, Chaotic Evil, Neutral Good, True Neutral, Neutral Evil]", LogLevel.Error);
        }
    }
}