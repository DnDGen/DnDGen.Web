using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.RollGen.Tests.Integration.Helpers;
using DnDGen.RollGen;
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
        [TestCase(1, 2)]
        [TestCase(1, 3)]
        [TestCase(1, 4)]
        [TestCase(1, 6)]
        [TestCase(1, 10)]
        [TestCase(1, 12)]
        [TestCase(1, 20)]
        [TestCase(1, 100)]
        [TestCase(1, 1_000)]
        [TestCase(1, Limits.Die)]
        [TestCase(2, 1)]
        [TestCase(2, 2)]
        [TestCase(2, 3)]
        [TestCase(2, 4)]
        [TestCase(2, 6)]
        [TestCase(2, 10)]
        [TestCase(2, 12)]
        [TestCase(2, 20)]
        [TestCase(2, 100)]
        [TestCase(2, 1_000)]
        [TestCase(2, Limits.Die)]
        [TestCase(10, 1)]
        [TestCase(10, 2)]
        [TestCase(10, 3)]
        [TestCase(10, 4)]
        [TestCase(10, 6)]
        [TestCase(10, 10)]
        [TestCase(10, 12)]
        [TestCase(10, 20)]
        [TestCase(10, 100)]
        [TestCase(10, 1_000)]
        [TestCase(10, Limits.Die)]
        [TestCase(100, 1)]
        [TestCase(100, 2)]
        [TestCase(100, 3)]
        [TestCase(100, 4)]
        [TestCase(100, 6)]
        [TestCase(100, 10)]
        [TestCase(100, 12)]
        [TestCase(100, 20)]
        [TestCase(100, 100)]
        [TestCase(100, 1_000)]
        [TestCase(100, Limits.Die)]
        [TestCase(1_000, 1)]
        [TestCase(1_000, 2)]
        [TestCase(1_000, 3)]
        [TestCase(1_000, 4)]
        [TestCase(1_000, 6)]
        [TestCase(1_000, 10)]
        [TestCase(1_000, 12)]
        [TestCase(1_000, 20)]
        [TestCase(1_000, 100)]
        [TestCase(1_000, 1_000)]
        [TestCase(1_000, Limits.Die)]
        [TestCase(Limits.Quantity, 1)]
        [TestCase(Limits.Quantity, 2)]
        [TestCase(Limits.Quantity, 3)]
        [TestCase(Limits.Quantity, 4)]
        [TestCase(Limits.Quantity, 6)]
        [TestCase(Limits.Quantity, 10)]
        [TestCase(Limits.Quantity, 12)]
        [TestCase(Limits.Quantity, 20)]
        [TestCase(Limits.Quantity, 100)]
        [TestCase(Limits.Quantity, 1_000)]
        [TestCase(Limits.Quantity, Limits.Die)]
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