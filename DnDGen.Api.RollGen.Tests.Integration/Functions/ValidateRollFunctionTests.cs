using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.RollGen.Tests.Integration.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    //HACK: Since the E2E tests don't currently work in the build pipeline, this is a facsimile of those tests
    public class ValidateRollFunctionTests : IntegrationTests
    {
        private ValidateRollFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateRollFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCase(1, 1, true)]
        [TestCase(1, 0, false)]
        [TestCase(0, 1, false)]
        [TestCase(1, -1, false)]
        [TestCase(-1, 1, false)]
        [TestCase(1, 20, true)]
        [TestCase(3, 6, true)]
        [TestCase(3, 6, true)]
        [TestCase(42, 600, true)]
        [TestCase(10_000, 1, true)]
        [TestCase(10_001, 1, false)]
        [TestCase(16_500_000, 1, false)]
        [TestCase(16_500_001, 1, false)]
        [TestCase(1, 10_000, true)]
        [TestCase(1, 10_001, false)]
        [TestCase(1, 16_500_000, false)]
        [TestCase(1, 16_500_001, false)]
        [TestCase(1, int.MaxValue, false)]
        [TestCase(2, int.MaxValue, false)]
        [TestCase(10_000, 10_000, true)]
        [TestCase(10_001, 10_000, false)]
        [TestCase(10_000, 10_001, false)]
        [TestCase(10_001, 10_001, false)]
        public async Task ValidateRoll_ReturnsValidity(int quantity, int die, bool valid)
        {
            var request = RequestHelper.BuildRequest($"?quantity={quantity}&die={die}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));
        }
    }
}