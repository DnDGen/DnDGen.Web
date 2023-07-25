using DnDGen.RollGen;
using System.Net;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions.EndToEnd
{
    public class ValidateRollFunctionTests : EndToEndTests
    {
        [TestCase("/api/v1/roll/validate", -1, -1, false)]
        [TestCase("/api/v1/roll/validate", -1, 0, false)]
        [TestCase("/api/v1/roll/validate", -1, 1, false)]
        [TestCase("/api/v1/roll/validate", -1, 2, false)]
        [TestCase("/api/v1/roll/validate", -1, 3, false)]
        [TestCase("/api/v1/roll/validate", -1, 4, false)]
        [TestCase("/api/v1/roll/validate", -1, 6, false)]
        [TestCase("/api/v1/roll/validate", -1, 10, false)]
        [TestCase("/api/v1/roll/validate", -1, 12, false)]
        [TestCase("/api/v1/roll/validate", -1, 20, false)]
        [TestCase("/api/v1/roll/validate", -1, 100, false)]
        [TestCase("/api/v1/roll/validate", -1, 1_000, false)]
        [TestCase("/api/v1/roll/validate", -1, Limits.Die, false)]
        [TestCase("/api/v1/roll/validate", -1, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", 0, -1, false)]
        [TestCase("/api/v1/roll/validate", 0, 0, false)]
        [TestCase("/api/v1/roll/validate", 0, 1, false)]
        [TestCase("/api/v1/roll/validate", 0, 2, false)]
        [TestCase("/api/v1/roll/validate", 0, 3, false)]
        [TestCase("/api/v1/roll/validate", 0, 4, false)]
        [TestCase("/api/v1/roll/validate", 0, 6, false)]
        [TestCase("/api/v1/roll/validate", 0, 10, false)]
        [TestCase("/api/v1/roll/validate", 0, 12, false)]
        [TestCase("/api/v1/roll/validate", 0, 20, false)]
        [TestCase("/api/v1/roll/validate", 0, 100, false)]
        [TestCase("/api/v1/roll/validate", 0, 1_000, false)]
        [TestCase("/api/v1/roll/validate", 0, Limits.Die, false)]
        [TestCase("/api/v1/roll/validate", 0, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", 1, -1, false)]
        [TestCase("/api/v1/roll/validate", 1, 0, false)]
        [TestCase("/api/v1/roll/validate", 1, 1, true)]
        [TestCase("/api/v1/roll/validate", 1, 2, true)]
        [TestCase("/api/v1/roll/validate", 1, 3, true)]
        [TestCase("/api/v1/roll/validate", 1, 4, true)]
        [TestCase("/api/v1/roll/validate", 1, 6, true)]
        [TestCase("/api/v1/roll/validate", 1, 10, true)]
        [TestCase("/api/v1/roll/validate", 1, 12, true)]
        [TestCase("/api/v1/roll/validate", 1, 20, true)]
        [TestCase("/api/v1/roll/validate", 1, 100, true)]
        [TestCase("/api/v1/roll/validate", 1, 1_000, true)]
        [TestCase("/api/v1/roll/validate", 1, Limits.Die, true)]
        [TestCase("/api/v1/roll/validate", 1, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", 2, -1, false)]
        [TestCase("/api/v1/roll/validate", 2, 0, false)]
        [TestCase("/api/v1/roll/validate", 2, 1, true)]
        [TestCase("/api/v1/roll/validate", 2, 2, true)]
        [TestCase("/api/v1/roll/validate", 2, 3, true)]
        [TestCase("/api/v1/roll/validate", 2, 4, true)]
        [TestCase("/api/v1/roll/validate", 2, 6, true)]
        [TestCase("/api/v1/roll/validate", 2, 10, true)]
        [TestCase("/api/v1/roll/validate", 2, 12, true)]
        [TestCase("/api/v1/roll/validate", 2, 20, true)]
        [TestCase("/api/v1/roll/validate", 2, 100, true)]
        [TestCase("/api/v1/roll/validate", 2, 1_000, true)]
        [TestCase("/api/v1/roll/validate", 2, Limits.Die, true)]
        [TestCase("/api/v1/roll/validate", 2, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", 10, -1, false)]
        [TestCase("/api/v1/roll/validate", 10, 0, false)]
        [TestCase("/api/v1/roll/validate", 10, 1, true)]
        [TestCase("/api/v1/roll/validate", 10, 2, true)]
        [TestCase("/api/v1/roll/validate", 10, 3, true)]
        [TestCase("/api/v1/roll/validate", 10, 4, true)]
        [TestCase("/api/v1/roll/validate", 10, 6, true)]
        [TestCase("/api/v1/roll/validate", 10, 10, true)]
        [TestCase("/api/v1/roll/validate", 10, 12, true)]
        [TestCase("/api/v1/roll/validate", 10, 20, true)]
        [TestCase("/api/v1/roll/validate", 10, 100, true)]
        [TestCase("/api/v1/roll/validate", 10, 1_000, true)]
        [TestCase("/api/v1/roll/validate", 10, Limits.Die, true)]
        [TestCase("/api/v1/roll/validate", 10, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", 100, -1, false)]
        [TestCase("/api/v1/roll/validate", 100, 0, false)]
        [TestCase("/api/v1/roll/validate", 100, 1, true)]
        [TestCase("/api/v1/roll/validate", 100, 2, true)]
        [TestCase("/api/v1/roll/validate", 100, 3, true)]
        [TestCase("/api/v1/roll/validate", 100, 4, true)]
        [TestCase("/api/v1/roll/validate", 100, 6, true)]
        [TestCase("/api/v1/roll/validate", 100, 10, true)]
        [TestCase("/api/v1/roll/validate", 100, 12, true)]
        [TestCase("/api/v1/roll/validate", 100, 20, true)]
        [TestCase("/api/v1/roll/validate", 100, 100, true)]
        [TestCase("/api/v1/roll/validate", 100, 1_000, true)]
        [TestCase("/api/v1/roll/validate", 100, Limits.Die, true)]
        [TestCase("/api/v1/roll/validate", 100, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", 1_000, -1, false)]
        [TestCase("/api/v1/roll/validate", 1_000, 0, false)]
        [TestCase("/api/v1/roll/validate", 1_000, 1, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 2, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 3, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 4, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 6, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 10, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 12, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 20, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 100, true)]
        [TestCase("/api/v1/roll/validate", 1_000, 1_000, true)]
        [TestCase("/api/v1/roll/validate", 1_000, Limits.Die, true)]
        [TestCase("/api/v1/roll/validate", 1_000, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, -1, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 0, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 1, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 2, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 3, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 4, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 6, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 10, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 12, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 20, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 100, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, 1_000, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, Limits.Die, true)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity, Limits.Die + 1, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, -1, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 0, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 1, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 2, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 3, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 4, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 6, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 10, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 12, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 20, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 100, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, 1_000, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, Limits.Die, false)]
        [TestCase("/api/v1/roll/validate", Limits.Quantity + 1, Limits.Die + 1, false)]
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