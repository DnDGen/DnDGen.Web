using DnDGen.Api.DungeonGen.Dependencies;
using DnDGen.Api.DungeonGen.Functions;
using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.DungeonGen.Models;
using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.DungeonGen.Tests.Integration.Functions
{
    public class GenerateFromDoorFunctionTests : IntegrationTests
    {
        private GenerateFromDoorFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateFromDoorFunction(loggerFactory, dependencyFactory);
        }

        [Test]
        public async Task Run_ReturnsAreas_BaselineUsecase()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        private string GetUrl(
            int dungeonLevel = 1,
            string temperature = EnvironmentConstants.Temperatures.Temperate,
            string environment = EnvironmentConstants.Plains,
            string timeOfDay = EnvironmentConstants.TimesOfDay.Day,
            int partyLevel = 1,
            string query = "")
        {
            var url = $"https://dungeon.dndgen.com/api/v1/dungeon/level/{dungeonLevel}/door/{temperature}/{environment}/{timeOfDay}/level/{partyLevel}/generate";
            if (query.Any())
                url += "?" + query;

            return url;
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        [TestCase(10)]
        [TestCase(100)]
        public async Task Run_ReturnsAreas_DungeonLevel(int level)
        {
            var url = GetUrl(dungeonLevel: level, partyLevel: 5);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, level, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 5);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase(EnvironmentConstants.Temperatures.Cold)]
        [TestCase(EnvironmentConstants.Temperatures.Temperate)]
        [TestCase(EnvironmentConstants.Temperatures.Warm)]
        public async Task Run_ReturnsAreas_Temperature(string temperature)
        {
            var url = GetUrl(temperature: temperature);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, temperature, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsBadRequest_Temperature(string temperature)
        {
            var url = GetUrl(temperature: temperature);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, temperature, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(EnvironmentConstants.Aquatic)]
        [TestCase(EnvironmentConstants.Civilized)]
        [TestCase(EnvironmentConstants.Desert)]
        [TestCase(EnvironmentConstants.Hills)]
        [TestCase(EnvironmentConstants.Marsh)]
        [TestCase(EnvironmentConstants.Mountain)]
        [TestCase(EnvironmentConstants.Plains)]
        [TestCase(EnvironmentConstants.Underground)]
        public async Task Run_ReturnsAreas_Environment(string environment)
        {
            var url = GetUrl(environment: environment);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsBadRequest_Environment(string environment)
        {
            var url = GetUrl(environment: environment);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(EnvironmentConstants.TimesOfDay.Day)]
        [TestCase(EnvironmentConstants.TimesOfDay.Night)]
        public async Task Run_ReturnsAreas_TimeOfDay(string timeOfDay)
        {
            var url = GetUrl(timeOfDay: timeOfDay);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, timeOfDay, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsBadRequest_TimeOfDay(string timeOfDay)
        {
            var url = GetUrl(timeOfDay: timeOfDay);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, timeOfDay, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(EncounterSpecifications.MinimumLevel)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(6)]
        [TestCase(7)]
        [TestCase(8)]
        [TestCase(9)]
        [TestCase(10)]
        [TestCase(11)]
        [TestCase(12)]
        [TestCase(13)]
        [TestCase(14)]
        [TestCase(15)]
        [TestCase(16)]
        [TestCase(17)]
        [TestCase(18)]
        [TestCase(19)]
        [TestCase(20)]
        [TestCase(21)]
        [TestCase(22)]
        [TestCase(23)]
        [TestCase(24)]
        [TestCase(25)]
        [TestCase(26)]
        [TestCase(27)]
        [TestCase(28)]
        [TestCase(29)]
        [TestCase(EncounterSpecifications.MaximumLevel, Ignore = "There are no actual encounters with average level of 30")]
        public async Task Run_ReturnsAreas_PartyLevel(int level)
        {
            var url = GetUrl(partyLevel: level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase(0)]
        [TestCase(EncounterSpecifications.MaximumLevel)]
        [TestCase(EncounterSpecifications.MaximumLevel + 1)]
        public async Task Run_ReturnsBadRequest_PartyLevel(int level)
        {
            var url = GetUrl(partyLevel: level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsAreas_AllowAquatic_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsAreas_AllowAquatic(bool allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsAreas_AllowAquatic_InvalidValue(string allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [Test]
        public async Task Run_ReturnsAreas_AllowUnderground_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsAreas_AllowUnderground(bool allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsAreas_AllowUnderground_InvalidValue(string allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [Test]
        public async Task Run_ReturnsAreas_CreatureTypeFilters_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase(CreatureDataConstants.Types.Aberration, EnvironmentConstants.Plains, 10)]
        [TestCase(CreatureDataConstants.Types.Animal)]
        [TestCase(CreatureDataConstants.Types.Construct)]
        [TestCase(CreatureDataConstants.Types.Dragon, EnvironmentConstants.Mountain, 10)]
        [TestCase(CreatureDataConstants.Types.Elemental)]
        [TestCase(CreatureDataConstants.Types.Fey, EnvironmentConstants.Forest, 10)]
        [TestCase(CreatureDataConstants.Types.Giant, EnvironmentConstants.Hills, 10)]
        [TestCase(CreatureDataConstants.Types.Humanoid)]
        [TestCase(CreatureDataConstants.Types.MagicalBeast)]
        [TestCase(CreatureDataConstants.Types.MonstrousHumanoid, EnvironmentConstants.Plains, 11)]
        [TestCase(CreatureDataConstants.Types.Ooze, EnvironmentConstants.Underground, 7)]
        [TestCase(CreatureDataConstants.Types.Outsider)]
        [TestCase(CreatureDataConstants.Types.Plant, EnvironmentConstants.Marsh, 6)]
        [TestCase(CreatureDataConstants.Types.Undead)]
        [TestCase(CreatureDataConstants.Types.Vermin)]
        public async Task Run_ReturnsAreas_CreatureTypeFilters(string creatureType, string environment = EnvironmentConstants.Plains, int level = 1)
        {
            var url = GetUrl(query: $"creatureTypeFilters={creatureType}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase(CreatureDataConstants.Types.Aberration, EnvironmentConstants.Plains, 1)]
        [TestCase(CreatureDataConstants.Types.Dragon, EnvironmentConstants.Mountain, 1)]
        [TestCase(CreatureDataConstants.Types.Dragon, EnvironmentConstants.Plains, 1)]
        [TestCase(CreatureDataConstants.Types.Dragon, EnvironmentConstants.Plains, 10)]
        [TestCase(CreatureDataConstants.Types.Fey, EnvironmentConstants.Forest, 1)]
        [TestCase(CreatureDataConstants.Types.Fey, EnvironmentConstants.Plains, 1)]
        [TestCase(CreatureDataConstants.Types.Fey, EnvironmentConstants.Plains, 10)]
        [TestCase(CreatureDataConstants.Types.Giant, EnvironmentConstants.Hills, 1)]
        [TestCase(CreatureDataConstants.Types.Giant, EnvironmentConstants.Plains, 1)]
        [TestCase(CreatureDataConstants.Types.Giant, EnvironmentConstants.Plains, 10)]
        [TestCase(CreatureDataConstants.Types.MonstrousHumanoid, EnvironmentConstants.Plains, 1)]
        [TestCase(CreatureDataConstants.Types.Ooze, EnvironmentConstants.Underground, 1)]
        [TestCase(CreatureDataConstants.Types.Ooze, EnvironmentConstants.Plains, 1)]
        [TestCase(CreatureDataConstants.Types.Ooze, EnvironmentConstants.Plains, 7)]
        [TestCase(CreatureDataConstants.Types.Plant, EnvironmentConstants.Marsh, 1)]
        [TestCase(CreatureDataConstants.Types.Plant, EnvironmentConstants.Plains, 1)]
        [TestCase(CreatureDataConstants.Types.Plant, EnvironmentConstants.Plains, 6)]
        public async Task Run_ReturnsBadRequest_CreatureTypeFilters(string creatureType, string environment, int level)
        {
            var url = GetUrl(query: $"creatureTypeFilters={creatureType}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsAreas_CreatureTypeFilters_Multiple()
        {
            var url = GetUrl(query: $"creatureTypeFilters=humanoid&creatureTypeFilters=animal");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsAreas_CreatureTypeFilters_InvalidValue(string creatureType)
        {
            var url = GetUrl(query: $"creatureTypeFilters={creatureType}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }

        [Test]
        public async Task BUG_JsonIsSerializedCorrectly()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var json = StreamHelper.Read(response.Body);
            Assert.That(json, Contains.Substring("\"type\""));
        }

        //INFO: This failure happened in a post-deployment test. However, after repeating 1M times, I could not reproduce it
        [Test]
        //[Repeat(1_000_000)]
        public async Task BUG_Run_ReturnsAreas_Mountain_UnexpectedTokenT()
        {
            var url = GetUrl(environment: EnvironmentConstants.Mountain);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Mountain, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var areas = StreamHelper.Read<Area[]>(response.Body);
            Assert.That(areas, Is.Not.Null.And.Not.Empty);
            Assert.That(areas[0].Type, Is.Not.Empty);
        }
    }
}