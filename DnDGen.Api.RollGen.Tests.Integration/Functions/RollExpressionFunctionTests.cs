using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.Tests.Integration.Helpers;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Web;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    public class RollExpressionFunctionTests : IntegrationTests
    {
        private RollExpressionFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new RollExpressionFunction(loggerFactory, dependencyFactory);
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
            var url = GetUrlV1($"?expression={HttpUtility.UrlEncode(expression)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.InRange(min, max));
        }

        private string GetUrlV1(string query = "")
        {
            var url = "https://roll.dndgen.com/api/v1/expression/roll";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        private string GetUrlV2(string query = "")
        {
            var url = "https://roll.dndgen.com/api/v2/expression/roll";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        [TestCase("1dd20")]
        [TestCase(" ")]
        [TestCase("invalid")]
        [TestCase("not a valid roll")]
        public async Task RollExpressionV1_ReturnsBadRequest(string expression)
        {
            var url = GetUrlV1($"?expression={HttpUtility.UrlEncode(expression)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
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
            var url = GetUrlV2($"?expression={HttpUtility.UrlEncode(expression)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.InRange(min, max));
        }

        [TestCase("1dd20")]
        [TestCase(" ")]
        [TestCase("invalid")]
        [TestCase("not a valid roll")]
        public async Task RollExpressionV2_ReturnsBadRequest(string expression)
        {
            var url = GetUrlV2($"?expression={HttpUtility.UrlEncode(expression)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task RollExpressionV2_ReturnsBadRequest_WhenExpressionMissing()
        {
            var url = GetUrlV2();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }
    }
}