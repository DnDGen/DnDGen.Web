using System.Net;
using System.Web;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions.EndToEnd
{
    public class RollExpressionFunctionTests : EndToEndTests
    {
        [TestCase("/api/rollgen/v1/expression/roll", "3d6+2", 5, 20)]
        [TestCase("/api/RollGen/v1/Expression/Roll", "3d6+2", 5, 20)]
        [TestCase("/api/rollgen/v1/expression/roll", "3 d 6 + 2", 5, 20)]
        [TestCase("/api/rollgen/v1/expression/roll", "3d6 + 2", 5, 20)]
        [TestCase("/api/rollgen/v1/expression/roll", "42d600", 42, 42 * 600)]
        [TestCase("/api/rollgen/v1/expression/roll", "42d600+92d66", 42 + 92, 42 * 600 + 92 * 66)]
        [TestCase("/api/rollgen/v1/expression/roll", "1d3-4", -3, -1)]
        [TestCase("/api/rollgen/v1/expression/roll", "1d2d3d4", 1, 24)]
        [TestCase("/api/rollgen/v1/expression/roll", "d100", 1, 100)]
        [TestCase("/api/rollgen/v1/expression/roll", "1d(2d3)+4d(5d6+7)-8", 1 + 4 - 8, 6 + 4 * 37 - 8)]
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
    }
}