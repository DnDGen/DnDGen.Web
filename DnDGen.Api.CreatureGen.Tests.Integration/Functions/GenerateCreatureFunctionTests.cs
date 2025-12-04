using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Functions;
using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.CreatureGen.Creatures;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.CreatureGen.Tests.Integration.Functions
{
    [TestFixture]
    public class GenerateCreatureFunctionTests : IntegrationTests
    {
        private GenerateCreatureFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateCreatureFunction(loggerFactory, dependencyFactory);
        }

        [Test]
        public async Task GenerateCreature_ReturnsCreature_WithValidCreatureName()
        {
            var url = GetUrl(CreatureConstants.Goblin);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Goblin);
            
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);
            Assert.That(response.Body.Length, Is.GreaterThan(0));
        }

        [Test]
        public async Task GenerateCreature_ReturnsCreature_WithTemplate()
        {
            var url = GetUrl(CreatureConstants.Goblin, $"templates={CreatureConstants.Templates.Skeleton}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Goblin);
            
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);
            Assert.That(response.Body.Length, Is.GreaterThan(0));
        }

        [Test]
        public async Task GenerateCreature_ReturnsBadRequest_WithInvalidCreatureName()
        {
            var url = GetUrl("InvalidCreature");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, "InvalidCreature");
            
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
        }

        private static string GetUrl(string creatureName, string query = "")
        {
            var url = $"https://creature.dndgen.com/api/v1/creature/{creatureName}/generate";
            if (query.Length != 0)
                url += "?" + query;

            return url;
        }
    }
}
