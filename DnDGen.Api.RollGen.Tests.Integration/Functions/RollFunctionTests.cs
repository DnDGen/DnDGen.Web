using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.RollGen.Tests.Integration.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    //HACK: Since the E2E tests don't currently work in the build pipeline, this is a facsimile of those tests
    public class RollFunctionTests : IntegrationTests
    {
        private RollFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new RollFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCase(1, 1)]
        [TestCase(1, 1)]
        [TestCase(1, 20)]
        [TestCase(1, 20)]
        [TestCase(3, 6)]
        [TestCase(42, 600)]
        public async Task Roll_ReturnsRoll(int quantity, int die)
        {
            var request = RequestHelper.BuildRequest($"?quantity={quantity}&die={die}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InRange(quantity, quantity * die));
        }
    }
}