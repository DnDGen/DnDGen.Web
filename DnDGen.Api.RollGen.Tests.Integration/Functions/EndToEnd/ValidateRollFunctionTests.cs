using System.Net;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions.EndToEnd
{
    public class ValidateRollFunctionTests : EndToEndTests
    {
        [TestCase("/api/rollgen/v1/roll/validate", 1, 1, true)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, 0, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 0, 1, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, -1, false)]
        [TestCase("/api/rollgen/v1/roll/validate", -1, 1, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, 20, true)]
        [TestCase("/api/rollgen/v1/roll/validate", 3, 6, true)]
        [TestCase("/api/RollGen/v1/Roll/Validate", 3, 6, true)]
        [TestCase("/api/rollgen/v1/roll/validate", 42, 600, true)]
        [TestCase("/api/rollgen/v1/roll/validate", 10_000, 1, true)]
        [TestCase("/api/rollgen/v1/roll/validate", 10_001, 1, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 16_500_000, 1, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 16_500_001, 1, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, 10_000, true)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, 10_001, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, 16_500_000, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, 16_500_001, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 1, int.MaxValue, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 2, int.MaxValue, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 10_000, 10_000, true)]
        [TestCase("/api/rollgen/v1/roll/validate", 10_001, 10_000, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 10_000, 10_001, false)]
        [TestCase("/api/rollgen/v1/roll/validate", 10_001, 10_001, false)]
        public async Task ValidateRoll_ReturnsValidity(string route, int quantity, int die, bool valid)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"{route}?quantity={quantity}&die={die}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToBoolean(result), Is.EqualTo(valid), uri.AbsoluteUri);
        }
    }
}