using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Models;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using DnDGen.CharacterGen.Verifiers;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Functions
{
    public class ValidateRandomizersFunctionTests
    {
        private ValidateRandomizersFunction function;
        private Mock<IRandomizerRepository> mockRandomizerRepository;
        private Mock<IRandomizerVerifier> mockRandomizerVerifier;
        private Mock<ILogger<ValidateRandomizersFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockRandomizerVerifier = new Mock<IRandomizerVerifier>();
            mockLogger = new Mock<ILogger<ValidateRandomizersFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CharacterGen.Functions.ValidateRandomizersFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IRandomizerRepository>()).Returns(mockRandomizerRepository.Object);
            mockDependencyFactory.Setup(f => f.Get<IRandomizerVerifier>()).Returns(mockRandomizerVerifier.Object);

            function = new ValidateRandomizersFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
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
                .Setup(r => r.GetAlignmentRandomizer(AlignmentRandomizerTypeConstants.Any, string.Empty))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.AnyPlayer, string.Empty))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Any, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.AnyBase, string.Empty))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.AnyMeta, false, string.Empty))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(validity);

            var request = requestHelper.BuildRequest();

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheRandomizerValidity(bool validity)
        {
            var query = $"?alignmentRandomizerType={AlignmentRandomizerTypeConstants.NonEvil}";
            query += $"&classNameRandomizerType={ClassNameRandomizerTypeConstants.PhysicalCombat}";
            query += $"&levelRandomizerType={LevelRandomizerTypeConstants.Medium}";
            query += $"&baseRaceRandomizerType={RaceRandomizerTypeConstants.BaseRace.NonMonsterBase}";
            query += $"&metaraceRandomizerType={RaceRandomizerTypeConstants.Metarace.GeneticMeta}";

            var request = requestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(AlignmentRandomizerTypeConstants.NonEvil, string.Empty))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.PhysicalCombat, string.Empty))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Medium, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase, string.Empty))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.GeneticMeta, false, string.Empty))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(validity);

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheRandomizerValidity_ForceMetarace(bool validity)
        {
            var query = $"?alignmentRandomizerType={AlignmentRandomizerTypeConstants.NonEvil}";
            query += $"&classNameRandomizerType={ClassNameRandomizerTypeConstants.PhysicalCombat}";
            query += $"&levelRandomizerType={LevelRandomizerTypeConstants.Medium}";
            query += $"&baseRaceRandomizerType={RaceRandomizerTypeConstants.BaseRace.NonMonsterBase}";
            query += $"&metaraceRandomizerType={RaceRandomizerTypeConstants.Metarace.GeneticMeta}";
            query += "&forceMetarace=true";

            var request = requestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();

            mockRandomizerRepository
                .Setup(r => r.GetAlignmentRandomizer(AlignmentRandomizerTypeConstants.NonEvil, string.Empty))
                .Returns(mockAlignmentRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetClassNameRandomizer(ClassNameRandomizerTypeConstants.PhysicalCombat, string.Empty))
                .Returns(mockClassNameRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetLevelRandomizer(LevelRandomizerTypeConstants.Medium, 0))
                .Returns(mockLevelRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase, string.Empty))
                .Returns(mockBaseRaceRandomizer.Object);

            mockRandomizerRepository
                .Setup(r => r.GetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.GeneticMeta, true, string.Empty))
                .Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(validity);

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheRandomizerValidity_WithSetValues(bool validity)
        {
            var query = "?alignmentRandomizerType=set";
            query += $"&setAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&classNameRandomizerType=set";
            query += $"&setClassName={CharacterClassConstants.Cleric}";
            query += "&levelRandomizerType=set";
            query += "&setLevel=2";
            query += "&baseRaceRandomizerType=set";
            query += $"&setBaseRace={RaceConstants.BaseRaces.MountainDwarf}";
            query += "&metaraceRandomizerType=set";
            query += $"&setMetarace={RaceConstants.Metaraces.Wereboar}";

            var request = requestHelper.BuildRequest(query);

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

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Randomizer Validity: {validity}");
        }

        [Test]
        public async Task Run_ReturnsTheRandomizerValidity_WhenParametersInvalid()
        {
            var request = requestHelper.BuildRequest("?alignmentRandomizerType=set");

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters are not a valid combination. Error: SetAlignment is not valid. Should be one of: [Lawful Good, Lawful Neutral, Lawful Evil, Chaotic Good, Chaotic Neutral, Chaotic Evil, Neutral Good, True Neutral, Neutral Evil]", LogLevel.Error);
        }
    }
}