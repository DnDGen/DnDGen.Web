using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.Web.Tests.Unit.Functions
{
    public class GetDungeonViewModelFunctionTests
    {
        private GetDungeonViewModelFunction function;
        private Mock<ILogger<GetDungeonViewModelFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger<GetDungeonViewModelFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.Web.Functions.GetDungeonViewModelFunction")).Returns(mockLogger.Object);

            function = new GetDungeonViewModelFunction(mockLoggerFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheDungeonViewModel()
        {
            var request = requestHelper.BuildRequest();

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

            mockLogger.AssertLog("C# HTTP trigger function (GetDungeonViewModelFunction.Run) processed a request.");
        }
    }
}