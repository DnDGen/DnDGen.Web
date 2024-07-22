using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.Web.Tests.Integration.Functions
{
    public class GetDungeonViewModelFunctionTests : IntegrationTests
    {
        private GetDungeonViewModelFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            function = new GetDungeonViewModelFunction(loggerFactory);
        }

        [Test]
        public async Task Run_ReturnsDungeonViewModel()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var model = StreamHelper.Read<DungeonViewModel>(response.Body);
            Assert.That(model, Is.Not.Null);
            Assert.That(model.Environments, Is.EquivalentTo(new[]
            {
                EnvironmentConstants.Aquatic,
                EnvironmentConstants.Civilized,
                EnvironmentConstants.Desert,
                EnvironmentConstants.Forest,
                EnvironmentConstants.Hills,
                EnvironmentConstants.Marsh,
                EnvironmentConstants.Mountain,
                EnvironmentConstants.Plains,
                EnvironmentConstants.Underground,
            }));
            Assert.That(model.Temperatures, Is.EquivalentTo(new[]
            {
                EnvironmentConstants.Temperatures.Cold,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm,
            }));
            Assert.That(model.TimesOfDay, Is.EquivalentTo(new[]
            {
                EnvironmentConstants.TimesOfDay.Day,
                EnvironmentConstants.TimesOfDay.Night,
            }));
            Assert.That(model.CreatureTypes, Is.EquivalentTo(new[]
            {
                CreatureDataConstants.Types.Aberration,
                CreatureDataConstants.Types.Animal,
                CreatureDataConstants.Types.Construct,
                CreatureDataConstants.Types.Dragon,
                CreatureDataConstants.Types.Elemental,
                CreatureDataConstants.Types.Fey,
                CreatureDataConstants.Types.Giant,
                CreatureDataConstants.Types.Humanoid,
                CreatureDataConstants.Types.MagicalBeast,
                CreatureDataConstants.Types.MonstrousHumanoid,
                CreatureDataConstants.Types.Ooze,
                CreatureDataConstants.Types.Outsider,
                CreatureDataConstants.Types.Plant,
                CreatureDataConstants.Types.Undead,
                CreatureDataConstants.Types.Vermin,
            }));

            Assert.That(model.Defaults, Is.Not.Null);
            Assert.That(model.Defaults.Temperature, Is.EqualTo(EnvironmentConstants.Temperatures.Temperate));
            Assert.That(model.Defaults.Environment, Is.EqualTo(EnvironmentConstants.Underground));
            Assert.That(model.Defaults.TimeOfDay, Is.EqualTo(EnvironmentConstants.TimesOfDay.Day));
            Assert.That(model.Defaults.Level, Is.EqualTo(1));
            Assert.That(model.Defaults.AllowAquatic, Is.False);
            Assert.That(model.Defaults.AllowUnderground, Is.True);
            Assert.That(model.Defaults.CreatureTypeFilters, Is.Empty);
        }

        private string GetUrl(string query = "")
        {
            var url = "https://web.dndgen.com/api/v1/dungeon/viewmodel";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }
    }
}