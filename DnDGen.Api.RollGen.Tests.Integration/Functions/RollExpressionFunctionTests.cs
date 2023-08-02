using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.RollGen.Tests.Integration.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Web;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    //HACK: Since the E2E tests don't currently work in the build pipeline, this is a facsimile of those tests
    public class RollExpressionFunctionTests : IntegrationTests
    {
        private RollExpressionFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new RollExpressionFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCase("3d6+2", 5, 20)]
        [TestCase("3 d 6 + 2", 5, 20)]
        [TestCase("3d6 + 2", 5, 20)]
        [TestCase("42d600", 42, 42 * 600)]
        [TestCase("42d600+92d66", 42 + 92, 42 * 600 + 92 * 66)]
        [TestCase("1d3-4", -3, -1)]
        [TestCase("1d2d3d4", 1, 24)]
        [TestCase("d100", 1, 100)]
        [TestCase("1d(2d3)+4d(5d6+7)-8", 1 + 4 - 8, 6 + 4 * 37 - 8)]
        [TestCase("1d4*1000", 1000, 4000)]
        [TestCase("(1d6-1)*6+1d6", 1, 36)]
        [TestCase("1d2+3d4-5d6*7d8/9d10", 1 + 3 - 30 * 56 / 9, 2 + 12 - 5 * 7 / 90)]
        [TestCase("100d20/12d10/8d6/4d3", 100 / 120 / 48 / 12, 2000 / 12 / 8 / 4)]
        public async Task RollExpression_ReturnsRoll(string expression, int min, int max)
        {
            var request = RequestHelper.BuildRequest($"?expression={HttpUtility.UrlEncode(expression)}");
            var response = await function.RunV1(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InRange(min, max));
        }

        [TestCase("1dd20")]
        [TestCase(" ")]
        [TestCase("invalid")]
        [TestCase("not a valid roll")]
        public async Task RollExpressionV1_ReturnsBadRequest(string expression)
        {
            var request = RequestHelper.BuildRequest($"?expression={HttpUtility.UrlEncode(expression)}");
            var response = await function.RunV1(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase("9266", 9266, 9266)]
        [TestCase("3d6+2", 5, 20)]
        [TestCase("3 d 6 + 2", 5, 20)]
        [TestCase("3d6 + 2", 5, 20)]
        [TestCase("42d600", 42, 42 * 600)]
        [TestCase("42d600+92d66", 42 + 92, 42 * 600 + 92 * 66)]
        [TestCase("1d3-4", -3, -1)]
        [TestCase("1d2d3d4", 1, 24)]
        [TestCase("d100", 1, 100)]
        [TestCase("1d(2d3)+4d(5d6+7)-8", 1 + 4 - 8, 6 + 4 * 37 - 8)]
        [TestCase("1d4*1000", 1000, 4000)]
        [TestCase("(1d6-1)*6+1d6", 1, 36)]
        [TestCase("1d2+3d4-5d6*7d8/9d10", 1 + 3 - 30 * 56 / 9, 2 + 12 - 5 * 7 / 90)]
        [TestCase("100d20/12d10/8d6/4d3", 100 / 120 / 48 / 12, 2000 / 12 / 8 / 4)]
        public async Task RollExpressionV2_ReturnsRoll(string expression, int min, int max)
        {
            var request = RequestHelper.BuildRequest($"?expression={HttpUtility.UrlEncode(expression)}");
            var response = await function.RunV2(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InRange(min, max));
        }

        [TestCase("1dd20")]
        [TestCase(" ")]
        [TestCase("invalid")]
        [TestCase("not a valid roll")]
        public async Task RollExpressionV2_ReturnsBadRequest(string expression)
        {
            var request = RequestHelper.BuildRequest($"?expression={HttpUtility.UrlEncode(expression)}");
            var response = await function.RunV2(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task RollExpressionV2_ReturnsBadRequest_WhenExpressionMissing()
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.RunV2(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }
    }
}