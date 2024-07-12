using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.Tests.Integration.Helpers;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Web;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    public class ValidateExpressionFunctionTests : IntegrationTests
    {
        private ValidateExpressionFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateExpressionFunction(loggerFactory, dependencyFactory);
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
        [TestCase("1 d 2 + 3 d 4", true)]
        [TestCase("9266+90210-42*600/1337", true)]
        [TestCase("1d2+3d4-5d6*7d8/9d10", true)]
        [TestCase("1d2+*3d4", false)]
        public async Task ValidateExpression_ReturnsValidity(string expression, bool valid)
        {
            var url = GetUrlV1($"?expression={HttpUtility.UrlEncode(expression)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));
        }

        private string GetUrlV1(string query = "")
        {
            var url = "https://roll.dndgen.com/api/v1/expression/validate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        private string GetUrlV2(string query = "")
        {
            var url = "https://roll.dndgen.com/api/v2/expression/validate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
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
        [TestCase("1 d 2 + 3 d 4", true)]
        [TestCase("9266+90210-42*600/1337", true)]
        [TestCase("1d2+3d4-5d6*7d8/9d10", true)]
        [TestCase("1d2+*3d4", false)]
        public async Task ValidateExpressionV2_ReturnsValidity(string expression, bool valid)
        {
            var url = GetUrlV2($"?expression={HttpUtility.UrlEncode(expression)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));
        }
    }
}