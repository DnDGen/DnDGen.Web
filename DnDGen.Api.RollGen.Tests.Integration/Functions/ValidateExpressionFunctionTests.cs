using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.RollGen.Tests.Integration.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Web;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    //HACK: Since the E2E tests don't currently work in the build pipeline, this is a facsimile of those tests
    public class ValidateExpressionFunctionTests : IntegrationTests
    {
        private ValidateExpressionFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateExpressionFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCase("3d6+2", true)]
        [TestCase("3d6+2", true)]
        [TestCase("3 d 6 + 2", true)]
        [TestCase("3d6 + 2", true)]
        [TestCase("invalid", false)]
        [TestCase("42d600", true)]
        [TestCase("42d600+92d66", true)]
        [TestCase("1d3-4", true)]
        [TestCase("1d2d3d4", true)]
        [TestCase("d100", true)]
        [TestCase("1d(2d3)+4d(5d6+7)-8", true)]
        [TestCase("10000d1", true)]
        [TestCase("10001d1", false)]
        [TestCase("16500000d1", false)]
        [TestCase("16500001d1", false)]
        [TestCase("1d10000", true)]
        [TestCase("1d10001", false)]
        [TestCase("10000d10000", true)]
        [TestCase("10001d10000", false)]
        [TestCase("10000d10001", false)]
        [TestCase("10001d10001", false)]
        [TestCase("1d", false)]
        [TestCase("d20", true)]
        [TestCase("1d20", true)]
        [TestCase("1dd20", false)]
        [TestCase("1 d 20", true)]
        [TestCase("xdy", false)]
        [TestCase("1d4*1000", true)]
        [TestCase("Roll 1d4*1000", false)]
        [TestCase("-1d2", false)]
        [TestCase("3-1", true)]
        [TestCase("3-1d2", true)]
        [TestCase("3d4-1d2", true)]
        [TestCase("3d4+-1d2", false)]
        [TestCase("3d4+-(1d2)", true)]
        [TestCase("3d4+-1", true)]
        [TestCase("-3d4+1d2", false)]
        [TestCase("1d2+3d4-5d6*7d8/9d10", true)]
        [TestCase("100d20/12d10/8d6/4d3", true)]
        public async Task ValidateExpression_ReturnsValidity(string expression, bool valid)
        {
            var request = RequestHelper.BuildRequest($"?expression={HttpUtility.UrlEncode(expression)}");
            var response = await function.RunV1(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));
        }

        [TestCase("3d6+2", true)]
        [TestCase("3d6+2", true)]
        [TestCase("3 d 6 + 2", true)]
        [TestCase("3d6 + 2", true)]
        [TestCase("invalid", false)]
        [TestCase("42d600", true)]
        [TestCase("42d600+92d66", true)]
        [TestCase("1d3-4", true)]
        [TestCase("1d2d3d4", true)]
        [TestCase("d100", true)]
        [TestCase("1d(2d3)+4d(5d6+7)-8", true)]
        [TestCase("10000d1", true)]
        [TestCase("10001d1", false)]
        [TestCase("16500000d1", false)]
        [TestCase("16500001d1", false)]
        [TestCase("1d10000", true)]
        [TestCase("1d10001", false)]
        [TestCase("10000d10000", true)]
        [TestCase("10001d10000", false)]
        [TestCase("10000d10001", false)]
        [TestCase("10001d10001", false)]
        [TestCase("1d", false)]
        [TestCase("d20", true)]
        [TestCase("1d20", true)]
        [TestCase("1dd20", false)]
        [TestCase("1 d 20", true)]
        [TestCase("xdy", false)]
        [TestCase("1d4*1000", true)]
        [TestCase("Roll 1d4*1000", false)]
        [TestCase("-1d2", false)]
        [TestCase("3-1", true)]
        [TestCase("3-1d2", true)]
        [TestCase("3d4-1d2", true)]
        [TestCase("3d4+-1d2", false)]
        [TestCase("3d4+-(1d2)", true)]
        [TestCase("3d4+-1", true)]
        [TestCase("-3d4+1d2", false)]
        [TestCase("1d2+3d4-5d6*7d8/9d10", true)]
        [TestCase("100d20/12d10/8d6/4d3", true)]
        public async Task ValidateExpressionV2_ReturnsValidity(string expression, bool valid)
        {
            var request = RequestHelper.BuildRequest($"?expression={HttpUtility.UrlEncode(expression)}");
            var response = await function.RunV2(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));
        }
    }
}