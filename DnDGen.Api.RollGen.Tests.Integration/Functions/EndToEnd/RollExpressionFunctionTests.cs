using System.Net;
using System.Web;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions.EndToEnd
{
    public class RollExpressionFunctionTests : EndToEndTests
    {
        [TestCase("/api/v1/expression/roll", "9266", 9266, 9266)]
        [TestCase("/api/v1/expression/roll", "3d6+2", 5, 20)]
        [TestCase("/api/v1/expression/roll", "3 d 6 + 2", 5, 20)]
        [TestCase("/api/v1/expression/roll", "3d6 + 2", 5, 20)]
        [TestCase("/api/v1/expression/roll", "42d600", 42, 42 * 600)]
        [TestCase("/api/v1/expression/roll", "42d600+92d66", 42 + 92, 42 * 600 + 92 * 66)]
        [TestCase("/api/v1/expression/roll", "1d3-4", -3, -1)]
        [TestCase("/api/v1/expression/roll", "1d2d3d4", 1, 24)]
        [TestCase("/api/v1/expression/roll", "d100", 1, 100)]
        [TestCase("/api/v1/expression/roll", "1d(2d3)+4d(5d6+7)-8", 1 + 4 - 8, 6 + 4 * 37 - 8)]
        [TestCase("/api/v1/expression/roll", "1d4*1000", 1000, 4000)]
        [TestCase("/api/v1/expression/roll", "(1d6-1)*6+1d6", 1, 36)]
        public async Task RollExpression_ReturnsRoll(string route, string expression, int min, int max)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"{route}?expression={HttpUtility.UrlEncode(expression)}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToInt32(result), Is.InRange(min, max), uri.AbsoluteUri);
        }

        [TestCase("1dd20")]
        [TestCase(" ")]
        [TestCase("invalid")]
        [TestCase("not a valid roll")]
        public async Task RollExpressionV1_ReturnsBadRequest(string expression)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/expression/roll?expression={HttpUtility.UrlEncode(expression)}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest), uri.AbsoluteUri);
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
        public async Task RollExpressionV2_ReturnsRoll(string expression, int min, int max)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v2/{HttpUtility.UrlEncode(expression)}/roll");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToInt32(result), Is.InRange(min, max), uri.AbsoluteUri);
        }

        [TestCase("1dd20")]
        [TestCase(" ")]
        [TestCase("invalid")]
        [TestCase("not a valid roll")]
        public async Task RollExpressionV2_ReturnsBadRequest(string expression)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v2/{HttpUtility.UrlEncode(expression)}/roll");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest), uri.AbsoluteUri);
        }
    }
}