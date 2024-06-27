using DnDGen.Api.EncounterGen.Dependencies;
using DnDGen.Api.EncounterGen.Functions;
using DnDGen.Api.EncounterGen.Tests.Integration.Helpers;
using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.EncounterGen.Tests.Integration.Functions
{
    public class GenerateFunctionTests : IntegrationTests
    {
        private GenerateFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateFunction(loggerFactory, dependencyFactory);
        }

        [Test]
        public async Task Run_ReturnsEncounter_BaselineUsecase()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        private string GetUrl(
            string temperature = EnvironmentConstants.Temperatures.Temperate,
            string environment = EnvironmentConstants.Plains,
            string timeOfDay = EnvironmentConstants.TimesOfDay.Day,
            int level = 1,
            string query = "")
        {
            var url = $"https://encounter.dndgen.com/api/v1/encounter/{temperature}/{environment}/{timeOfDay}/level/{level}/generate";
            if (query.Any())
                url += "?" + query;

            return url;
        }

        [TestCase(EnvironmentConstants.Temperatures.Cold)]
        [TestCase(EnvironmentConstants.Temperatures.Temperate)]
        [TestCase(EnvironmentConstants.Temperatures.Warm)]
        public async Task Run_ReturnsEncounter_Temperature(string temperature)
        {
            var url = GetUrl(temperature: temperature);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, temperature, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsBadRequest_Temperature(string temperature)
        {
            var url = GetUrl(temperature: temperature);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, temperature, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
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
        public async Task Run_ReturnsEncounter_Environment(string environment)
        {
            var url = GetUrl(environment: environment);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsBadRequest_Environment(string environment)
        {
            var url = GetUrl(environment: environment);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(EnvironmentConstants.TimesOfDay.Day)]
        [TestCase(EnvironmentConstants.TimesOfDay.Night)]
        public async Task Run_ReturnsEncounter_TimeOfDay(string timeOfDay)
        {
            var url = GetUrl(timeOfDay: timeOfDay);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, timeOfDay, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsBadRequest_TimeOfDay(string timeOfDay)
        {
            var url = GetUrl(timeOfDay: timeOfDay);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, timeOfDay, 1);
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
        public async Task Run_ReturnsEncounter_Level(int level)
        {
            var url = GetUrl(level: level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(level));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase(0)]
        [TestCase(EncounterSpecifications.MaximumLevel)]
        [TestCase(EncounterSpecifications.MaximumLevel + 1)]
        public async Task Run_ReturnsBadRequest_Level(int level)
        {
            var url = GetUrl(level: level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsEncounter_AllowAquatic_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsEncounter_AllowAquatic(bool allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsEncounter_AllowAquatic_InvalidValue(string allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [Test]
        public async Task Run_ReturnsEncounter_AllowUnderground_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsEncounter_AllowUnderground(bool allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsEncounter_AllowUnderground_InvalidValue(string allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [Test]
        public async Task Run_ReturnsEncounter_CreatureTypeFilters_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
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
        public async Task Run_ReturnsEncounter_CreatureTypeFilters(string creatureType, string environment = EnvironmentConstants.Plains, int level = 1)
        {
            var url = GetUrl(query: $"creatureTypeFilters={creatureType}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(level));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
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
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, environment, EnvironmentConstants.TimesOfDay.Day, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task Run_ReturnsEncounter_CreatureTypeFilters_Multiple()
        {
            var url = GetUrl(query: $"creatureTypeFilters=humanoid&creatureTypeFilters=animal");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public async Task Run_ReturnsEncounter_CreatureTypeFilters_InvalidValue(string creatureType)
        {
            var url = GetUrl(query: $"creatureTypeFilters={creatureType}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(1));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }

        [TestCase(EnvironmentConstants.Forest, 1, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.TimesOfDay.Day, true, true)]
        [TestCase(EnvironmentConstants.Forest, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, true, true)]
        [TestCase(EnvironmentConstants.Aquatic, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Aquatic, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false,
            CreatureDataConstants.Types.Animal)]
        [TestCase(EnvironmentConstants.Aquatic, 2, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Aquatic, 10, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Aquatic, 20, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Underground, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Plains, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Mountain, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Hills, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Desert, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        [TestCase(EnvironmentConstants.Civilized, 1, EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.TimesOfDay.Day, false, false)]
        public async Task BUG_EncounterGeneratesWithoutError(string environment,
            int level,
            string temperature,
            string timeOfDay,
            bool allowAquatic,
            bool allowUnderground,
            params string[] creatureTypes)
        {
            var query = $"allowAquatic={allowAquatic}";
            query += $"&allowUnderground={allowUnderground}";

            foreach (var creatureType in creatureTypes)
            {
                query += $"&creatureTypeFilters={creatureType}";
            }

            var url = GetUrl(temperature, environment, timeOfDay, level, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, temperature, environment, timeOfDay, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var encounter = StreamHelper.Read<Encounter>(response.Body);
            Assert.That(encounter, Is.Not.Null);
            Assert.That(encounter.Description, Is.Not.Empty);
            Assert.That(encounter.TargetEncounterLevel, Is.EqualTo(level));
            Assert.That(encounter.AverageEncounterLevel, Is.Positive);
            Assert.That(encounter.ActualEncounterLevel, Is.Positive);
            Assert.That(encounter.AverageDifficulty, Is.Not.Empty);
            Assert.That(encounter.ActualDifficulty, Is.Not.Empty);
            Assert.That(encounter.Creatures, Is.Not.Empty);
        }
    }
}