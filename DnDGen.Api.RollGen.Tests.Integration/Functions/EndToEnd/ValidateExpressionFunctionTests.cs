using System.Net;
using System.Web;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions.EndToEnd
{
    public class ValidateExpressionFunctionTests : EndToEndTests
    {
        [TestCase("/api/v1/expression/validate", "3d6+2", true)]
        [TestCase("/api/v1/Expression/Validate", "3 d 6 + 2", true)]
        [TestCase("/api/v1/Expression/Validate", "3d6 + 2", true)]
        [TestCase("/api/v1/expression/validate", "invalid", false)]
        [TestCase("/api/v1/expression/validate", "42d600", true)]
        [TestCase("/api/v1/expression/validate", "42d600+92d66", true)]
        [TestCase("/api/v1/expression/validate", "1d3-4", true)]
        [TestCase("/api/v1/expression/validate", "1d2d3d4", true)]
        [TestCase("/api/v1/expression/validate", "d100", true)]
        [TestCase("/api/v1/expression/validate", "1d(2d3)+4d(5d6+7)-8", true)]
        [TestCase("/api/v1/expression/validate", "10000d1", true)]
        [TestCase("/api/v1/expression/validate", "10001d1", false)]
        [TestCase("/api/v1/expression/validate", "16500000d1", false)]
        [TestCase("/api/v1/expression/validate", "16500001d1", false)]
        [TestCase("/api/v1/expression/validate", "1d10000", true)]
        [TestCase("/api/v1/expression/validate", "1d10001", false)]
        [TestCase("/api/v1/expression/validate", "10000d10000", true)]
        [TestCase("/api/v1/expression/validate", "10001d10000", false)]
        [TestCase("/api/v1/expression/validate", "10000d10001", false)]
        [TestCase("/api/v1/expression/validate", "10001d10001", false)]
        [TestCase("/api/v1/expression/validate", "1d", false)]
        [TestCase("/api/v1/expression/validate", "d20", true)]
        [TestCase("/api/v1/expression/validate", "1d20", true)]
        [TestCase("/api/v1/expression/validate", "1dd20", false)]
        [TestCase("/api/v1/expression/validate", "1 d 20", true)]
        [TestCase("/api/v1/expression/validate", "xdy", false)]
        [TestCase("/api/v1/expression/validate", "1d4*1000", true)]
        [TestCase("/api/v1/expression/validate", "Roll 1d4*1000", false)]
        [TestCase("/api/v1/expression/validate", "-1d2", false)]
        [TestCase("/api/v1/expression/validate", "3-1", true)]
        [TestCase("/api/v1/expression/validate", "3-1d2", true)]
        [TestCase("/api/v1/expression/validate", "3d4-1d2", true)]
        [TestCase("/api/v1/expression/validate", "3d4+-1d2", false)]
        [TestCase("/api/v1/expression/validate", "3d4+-(1d2)", true)]
        [TestCase("/api/v1/expression/validate", "3d4+-1", true)]
        [TestCase("/api/v1/expression/validate", "-3d4+1d2", false)]
        public async Task ValidateExpression_ReturnsValidity(string route, string expression, bool valid)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"{route}?expression={HttpUtility.UrlEncode(expression)}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToBoolean(result), Is.EqualTo(valid), uri.AbsoluteUri);
        }

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
        public async Task ValidateExpressionV2_ReturnsValidity(string expression, bool valid)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v2/{HttpUtility.UrlEncode(expression)}/validate");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToBoolean(result), Is.EqualTo(valid), uri.AbsoluteUri);
        }
    }
}