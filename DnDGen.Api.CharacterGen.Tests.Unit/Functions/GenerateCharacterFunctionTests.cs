using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Models;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Abilities;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Generators.Characters;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using DnDGen.CharacterGen.Skills;
using DnDGen.CharacterGen.Verifiers;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Functions
{
    public class GenerateCharacterFunctionTests
    {
        private GenerateCharacterFunction function;
        private Mock<IRandomizerRepository> mockRandomizerRepository;
        private Mock<ICharacterGenerator> mockCharacterGenerator;
        private Mock<IRandomizerVerifier> mockRandomizerVerifier;
        private Mock<ILogger<GenerateCharacterFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockCharacterGenerator = new Mock<ICharacterGenerator>();
            mockRandomizerVerifier = new Mock<IRandomizerVerifier>();
            mockLogger = new Mock<ILogger<GenerateCharacterFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CharacterGen.Functions.GenerateCharacterFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IRandomizerRepository>()).Returns(mockRandomizerRepository.Object);
            mockDependencyFactory.Setup(f => f.Get<ICharacterGenerator>()).Returns(mockCharacterGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<IRandomizerVerifier>()).Returns(mockRandomizerVerifier.Object);

            function = new GenerateCharacterFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
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

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.Raw, 0, 0, 0, 0, 0, 0, true))
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
            character.Alignment = new Alignment("my alignment");
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

            var request = requestHelper.BuildRequest();

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCharacter = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCharacter, Is.Not.Null);
            Assert.That(responseCharacter.Summary, Is.EqualTo(character.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter()
        {
            var query = $"?alignmentRandomizerType={AlignmentRandomizerTypeConstants.NonEvil}";
            query += $"&classNameRandomizerType={ClassNameRandomizerTypeConstants.PhysicalCombat}";
            query += $"&levelRandomizerType={LevelRandomizerTypeConstants.Medium}";
            query += $"&baseRaceRandomizerType={RaceRandomizerTypeConstants.BaseRace.NonMonsterBase}";
            query += $"&metaraceRandomizerType={RaceRandomizerTypeConstants.Metarace.GeneticMeta}";
            query += $"&abilitiesRandomizerType={AbilitiesRandomizerTypeConstants.OnesAsSixes}";

            var request = requestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

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

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.OnesAsSixes, 0, 0, 0, 0, 0, 0, true))
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
            character.Alignment = new Alignment("my alignment");
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

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCharacter = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCharacter, Is.Not.Null);
            Assert.That(responseCharacter.Summary, Is.EqualTo(character.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter_ForceMetarace()
        {
            var query = $"?alignmentRandomizerType={AlignmentRandomizerTypeConstants.NonEvil}";
            query += $"&classNameRandomizerType={ClassNameRandomizerTypeConstants.PhysicalCombat}";
            query += $"&levelRandomizerType={LevelRandomizerTypeConstants.Medium}";
            query += $"&baseRaceRandomizerType={RaceRandomizerTypeConstants.BaseRace.NonMonsterBase}";
            query += $"&metaraceRandomizerType={RaceRandomizerTypeConstants.Metarace.GeneticMeta}";
            query += "&forceMetarace=true";
            query += $"&abilitiesRandomizerType={AbilitiesRandomizerTypeConstants.OnesAsSixes}";

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

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

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.OnesAsSixes, 0, 0, 0, 0, 0, 0, true))
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
            character.Alignment = new Alignment("my alignment");
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

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCharacter = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCharacter, Is.Not.Null);
            Assert.That(responseCharacter.Summary, Is.EqualTo(character.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter_WithSetValues()
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
            query += "&abilitiesRandomizerType=set";
            query += "&setStrength=9266";
            query += "&setConstitution=90210";
            query += "&setDexterity=42";
            query += "&setIntelligence=600";
            query += "&setWisdom=1337";
            query += "&setCharisma=1336";

            var request = requestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

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

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(RandomizerTypeConstants.Set, 9266, 90210, 42, 600, 1337, 1336, true))
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
            character.Alignment = new Alignment("my alignment");
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

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCharacter = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCharacter, Is.Not.Null);
            Assert.That(responseCharacter.Summary, Is.EqualTo(character.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCharacter_WithSetValues_DoNotAllowAbilityAdjustments()
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
            query += "&abilitiesRandomizerType=set";
            query += "&setStrength=9266";
            query += "&setConstitution=90210";
            query += "&setDexterity=42";
            query += "&setIntelligence=600";
            query += "&setWisdom=1337";
            query += "&setCharisma=1336";
            query += "&allowAbilityAdjustments=false";

            var request = requestHelper.BuildRequest(query);

            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

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

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(RandomizerTypeConstants.Set, 9266, 90210, 42, 600, 1337, 1336, false))
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
            character.Alignment = new Alignment("my alignment");
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

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCharacter = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCharacter, Is.Not.Null);
            Assert.That(responseCharacter.Summary, Is.EqualTo(character.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersInvalid()
        {
            var request = requestHelper.BuildRequest("?alignmentRandomizerType=set");

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog(
                "Parameters are not a valid combination. Error: SetAlignment is not valid. Should be one of: [Lawful Good, Lawful Neutral, Lawful Evil, Chaotic Good, Chaotic Neutral, Chaotic Evil, Neutral Good, True Neutral, Neutral Evil]",
                LogLevel.Error);
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

            var request = requestHelper.BuildRequest();

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog("Randomizers are not a valid combination.", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsCharacter_SortsCharacterSkills()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<RaceRandomizer>();
            var mockAbilitiesRandomizer = new Mock<IAbilitiesRandomizer>();

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

            mockRandomizerRepository
                .Setup(r => r.GetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.Raw, 0, 0, 0, 0, 0, 0, true))
                .Returns(mockAbilitiesRandomizer.Object);

            mockRandomizerVerifier
                .Setup(v => v.VerifyCompatibility(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object))
                .Returns(true);

            var character = new Character
            {
                Alignment = new Alignment("my alignment")
            };
            character.Class.Level = 42;
            character.Class.Name = "my class";
            character.Race.BaseRace = "my base race";
            character.Skills =
            [
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            ];

            mockCharacterGenerator
                .Setup(g => g.GenerateWith(
                    mockAlignmentRandomizer.Object,
                    mockClassNameRandomizer.Object,
                    mockLevelRandomizer.Object,
                    mockBaseRaceRandomizer.Object,
                    mockMetaraceRandomizer.Object,
                    mockAbilitiesRandomizer.Object))
                .Returns(character);

            var request = requestHelper.BuildRequest();

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCharacter = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCharacter, Is.Not.Null);
            Assert.That(responseCharacter.Summary, Is.EqualTo(character.Summary));
            Assert.That(responseCharacter.Skills, Is.Ordered.By("Name").Then.By("Focus"));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Character: {character.Summary}");
        }
    }
}