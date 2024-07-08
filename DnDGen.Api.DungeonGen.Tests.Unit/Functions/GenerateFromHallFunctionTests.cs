using DnDGen.Api.DungeonGen.Dependencies;
using DnDGen.Api.DungeonGen.Functions;
using DnDGen.Api.DungeonGen.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Abilities;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Skills;
using DnDGen.DungeonGen.Generators;
using DnDGen.DungeonGen.Models;
using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Specialized;
using System.Net;

namespace DnDGen.Api.DungeonGen.Tests.Unit.Functions
{
    internal class GenerateFromHallFunctionTests
    {
        private GenerateFromHallFunction _function;
        private Mock<IEncounterVerifier> mockEncounterVerifier;
        private Mock<IDungeonGenerator> mockDungeonGenerator;
        private Mock<ILogger<GenerateFromHallFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockEncounterVerifier = new Mock<IEncounterVerifier>();
            mockDungeonGenerator = new Mock<IDungeonGenerator>();
            mockLogger = new Mock<ILogger<GenerateFromHallFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.DungeonGen.Functions.GenerateFromHallFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IEncounterVerifier>()).Returns(mockEncounterVerifier.Object);
            mockDependencyFactory.Setup(f => f.Get<IDungeonGenerator>()).Returns(mockDungeonGenerator.Object);

            _function = new GenerateFromHallFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheDungeonAreas()
        {
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(true);

            var expectedAreas = new[] {
                new Area { Type = "my area" },
                new Area { Type = "my other area" },
            };
            mockDungeonGenerator
                .Setup(v => v.GenerateFromHall(9266, It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(expectedAreas);

            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas.Length, Is.EqualTo(2));
            Assert.That(areas[0].Type, Is.EqualTo(expectedAreas[0].Type));
            Assert.That(areas[1].Type, Is.EqualTo(expectedAreas[1].Type));
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersAreInvalid()
        {
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(false);

            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheDungeonAreas_AllowAquatic()
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic")))
                .Returns(true);

            var expectedAreas = new[] {
                new Area { Type = "my area" },
                new Area { Type = "my other area" },
            };
            mockDungeonGenerator
                .Setup(v => v.GenerateFromHall(9266, It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic")))
                .Returns(expectedAreas);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas.Length, Is.EqualTo(2));
            Assert.That(areas[0].Type, Is.EqualTo(expectedAreas[0].Type));
            Assert.That(areas[1].Type, Is.EqualTo(expectedAreas[1].Type));
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

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheDungeonAreas_AllowUnderground()
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing underground")))
                .Returns(true);

            var expectedAreas = new[] {
                new Area { Type = "my area" },
                new Area { Type = "my other area" },
            };
            mockDungeonGenerator
                .Setup(v => v.GenerateFromHall(9266, It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing underground")))
                .Returns(expectedAreas);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas.Length, Is.EqualTo(2));
            Assert.That(areas[0].Type, Is.EqualTo(expectedAreas[0].Type));
            Assert.That(areas[1].Type, Is.EqualTo(expectedAreas[1].Type));
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

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheDungeonAreas_CreatureTypeFilters()
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Humanoid]")))
                .Returns(true);

            var expectedAreas = new[] {
                new Area { Type = "my area" },
                new Area { Type = "my other area" },
            };
            mockDungeonGenerator
                .Setup(v => v.GenerateFromHall(9266, It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Humanoid]")))
                .Returns(expectedAreas);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas.Length, Is.EqualTo(2));
            Assert.That(areas[0].Type, Is.EqualTo(expectedAreas[0].Type));
            Assert.That(areas[1].Type, Is.EqualTo(expectedAreas[1].Type));
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

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheDungeonAreas_MultipleCreatureTypeFilters()
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

            var expectedAreas = new[] {
                new Area { Type = "my area" },
                new Area { Type = "my other area" },
            };
            mockDungeonGenerator
                .Setup(v => v.GenerateFromHall(9266, It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Animal, Humanoid]")))
                .Returns(expectedAreas);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas.Length, Is.EqualTo(2));
            Assert.That(areas[0].Type, Is.EqualTo(expectedAreas[0].Type));
            Assert.That(areas[1].Type, Is.EqualTo(expectedAreas[1].Type));
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

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsTheDungeonAreas_AllParameters()
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

            var expectedAreas = new[] {
                new Area { Type = "my area" },
                new Area { Type = "my other area" },
            };
            mockDungeonGenerator
                .Setup(v => v.GenerateFromHall(9266, It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic, allowing underground, allowing [Animal, Humanoid]")))
                .Returns(expectedAreas);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas.Length, Is.EqualTo(2));
            Assert.That(areas[0].Type, Is.EqualTo(expectedAreas[0].Type));
            Assert.That(areas[1].Type, Is.EqualTo(expectedAreas[1].Type));
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

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
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

            var response = await _function.Run(request, 9266, "invalid", EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
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

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, "invalid", EnvironmentConstants.TimesOfDay.Day, 1);
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

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, "invalid", 1);
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

            var response = await _function.Run(
                request,
                9266,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                badLevel);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsDungeonAreas_SortsCharacterSkills()
        {
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(true);

            var expectedCharacters = new List<Character>();
            while (expectedCharacters.Count < 8)
            {
                var character = new Character
                {
                    Skills =
                    [
                        new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                        new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                        new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                        new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
                    ]
                };
                expectedCharacters.Add(character);
            }

            var expectedAreas = new[] {
                new Area
                {
                    Type = "my area",
                    Contents = new Contents
                    {
                        Encounters = [
                            new Encounter
                            {
                                Description = "My encounter description",
                                Characters = [expectedCharacters[0], expectedCharacters[1]]
                            },
                            new Encounter
                            {
                                Description = "My other encounter description",
                                Characters = [expectedCharacters[2], expectedCharacters[3]]
                            }]
                    }
                },
                new Area
                {
                    Type = "my other area",
                    Contents = new Contents
                    {
                        Encounters = [
                            new Encounter
                            {
                                Description = "My OTHER encounter description",
                                Characters = [expectedCharacters[4], expectedCharacters[5]]
                            },
                            new Encounter
                            {
                                Description = "My OTHER other encounter description",
                                Characters = [expectedCharacters[6], expectedCharacters[7]]
                            }]
                    }
                },
            };
            mockDungeonGenerator
                .Setup(v => v.GenerateFromHall(9266, It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(expectedAreas);

            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, 9266, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas.Length, Is.EqualTo(2));
            Assert.That(areas[0].Type, Is.EqualTo(expectedAreas[0].Type));
            Assert.That(areas[1].Type, Is.EqualTo(expectedAreas[1].Type));

            var characters = areas.SelectMany(a => a.Contents.Encounters).SelectMany(e => e.Characters);
            foreach (var character in characters)
            {
                Assert.That(character.Skills, Is.Ordered.By("Name").Then.By("Focus"));
            }

            Assert.That(characters.Count(), Is.EqualTo(8));
        }
    }
}
