using DnDGen.Api.EncounterGen.Dependencies;
using DnDGen.Api.EncounterGen.Functions;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Abilities;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Skills;
using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Specialized;
using System.Net;

namespace DnDGen.Api.EncounterGen.Tests.Unit.Functions
{
    internal class GenerateFunctionTests
    {
        private GenerateFunction _function;
        private Mock<IEncounterVerifier> mockEncounterVerifier;
        private Mock<IEncounterGenerator> mockEncounterGenerator;
        private Mock<ILogger<GenerateFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockEncounterVerifier = new Mock<IEncounterVerifier>();
            mockEncounterGenerator = new Mock<IEncounterGenerator>();
            mockLogger = new Mock<ILogger<GenerateFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.EncounterGen.Functions.GenerateFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IEncounterVerifier>()).Returns(mockEncounterVerifier.Object);
            mockDependencyFactory.Setup(f => f.Get<IEncounterGenerator>()).Returns(mockEncounterGenerator.Object);

            _function = new GenerateFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheEncounter()
        {
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(true);

            var expectedEncounter = new Encounter { Description = "My encounter description" };
            mockEncounterGenerator
                .Setup(v => v.Generate(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(expectedEncounter);

            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter.Description, Is.EqualTo(expectedEncounter.Description));
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersAreInvalid()
        {
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(false);

            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheEncounter_AllowAquatic()
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic")))
                .Returns(true);

            var expectedEncounter = new Encounter { Description = "My encounter description" };
            mockEncounterGenerator
                .Setup(v => v.Generate(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic")))
                .Returns(expectedEncounter);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter.Description, Is.EqualTo(expectedEncounter.Description));
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersAreInvalid_AllowAquatic()
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic")))
                .Returns(false);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheEncounter_AllowUnderground()
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing underground")))
                .Returns(true);

            var expectedEncounter = new Encounter { Description = "My encounter description" };
            mockEncounterGenerator
                .Setup(v => v.Generate(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing underground")))
                .Returns(expectedEncounter);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter.Description, Is.EqualTo(expectedEncounter.Description));
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersAreInvalid_AllowUnderground()
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing underground")))
                .Returns(false);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheEncounter_CreatureTypeFilters()
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Humanoid]")))
                .Returns(true);

            var expectedEncounter = new Encounter { Description = "My encounter description" };
            mockEncounterGenerator
                .Setup(v => v.Generate(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Humanoid]")))
                .Returns(expectedEncounter);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter.Description, Is.EqualTo(expectedEncounter.Description));
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersAreInvalid_CreatureTypeFilters()
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Humanoid]")))
                .Returns(false);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheEncounter_MultipleCreatureTypeFilters()
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid },
                { "creatureTypeFilters", CreatureDataConstants.Types.Animal },
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Animal, Humanoid]")))
                .Returns(true);

            var expectedEncounter = new Encounter { Description = "My encounter description" };
            mockEncounterGenerator
                .Setup(v => v.Generate(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Animal, Humanoid]")))
                .Returns(expectedEncounter);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter.Description, Is.EqualTo(expectedEncounter.Description));
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersAreInvalid_MultipleCreatureTypeFilters()
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid },
                { "creatureTypeFilters", CreatureDataConstants.Types.Animal },
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Animal, Humanoid]")))
                .Returns(false);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheEncounter_AllParameters()
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString },
                { "allowUnderground", bool.TrueString },
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid },
                { "creatureTypeFilters", CreatureDataConstants.Types.Animal },
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic, allowing underground, allowing [Animal, Humanoid]")))
                .Returns(true);

            var expectedEncounter = new Encounter { Description = "My encounter description" };
            mockEncounterGenerator
                .Setup(v => v.Generate(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic, allowing underground, allowing [Animal, Humanoid]")))
                .Returns(expectedEncounter);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter.Description, Is.EqualTo(expectedEncounter.Description));
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersAreInvalid_AllParameters()
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString },
                { "allowUnderground", bool.TrueString },
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid },
                { "creatureTypeFilters", CreatureDataConstants.Types.Animal },
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic, allowing underground, allowing [Animal, Humanoid]")))
                .Returns(false);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenTemperatureInvalid()
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, "invalid", EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenEnvironmentInvalid()
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, "invalid", EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenTimeOfDayInvalid()
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, "invalid", 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(EncounterSpecifications.MinimumLevel - 1)]
        [TestCase(EncounterSpecifications.MaximumLevel + 1)]
        public async Task Run_ReturnsBadRequest_WhenLevelInvalid(int badLevel)
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, badLevel);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsEncounter_SortsCharacterSkills()
        {
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(true);

            var character = new Character();
            var otherCharacter = new Character();

            character.Skills =
            [
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            ];

            otherCharacter.Skills =
            [
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 2345 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 3456 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 4567 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 5678 },
            ];

            var expectedEncounter = new Encounter
            {
                Description = "My encounter description",
                Characters = [character, otherCharacter]
            };
            mockEncounterGenerator
                .Setup(v => v.Generate(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(expectedEncounter);

            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter.Description, Is.EqualTo(expectedEncounter.Description));

            foreach (var encounterCharacter in encounter.Characters)
            {
                Assert.That(encounterCharacter.Skills, Is.Ordered.By("Name").Then.By("Focus"));
            }

            Assert.That(encounter.Characters.Count(), Is.EqualTo(2));
        }
    }
}
