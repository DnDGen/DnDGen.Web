using DnDGen.Api.EncounterGen.Dependencies;
using DnDGen.Api.EncounterGen.Functions;
using DnDGen.Api.EncounterGen.Tests.Integration.Helpers;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.EncounterGen.Tests.Integration.Functions
{
    public class ValidateFunctionTests : IntegrationTests
    {
        private ValidateFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateFunction(loggerFactory, dependencyFactory);
        }

        [Test]
        public async Task Validate_ReturnsValid_BasicUseCase()
        {
            var request = RequestHelper.BuildRequest("https://encounter.dndgen.com/api/v1/encounter/Temperate/Plains/Day/level/1/validate");
            var response = await function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.True);
        }
    }
}