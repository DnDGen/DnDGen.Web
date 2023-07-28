using DnDGen.RollGen;
using System.Net;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions.EndToEnd
{
    public class RollFunctionTests : EndToEndTests
    {
        [TestCase("/api/v1/roll", 1, 1)]
        [TestCase("/api/v1/roll", 1, 2)]
        [TestCase("/api/v1/roll", 1, 3)]
        [TestCase("/api/v1/roll", 1, 4)]
        [TestCase("/api/v1/roll", 1, 6)]
        [TestCase("/api/v1/roll", 1, 10)]
        [TestCase("/api/v1/roll", 1, 12)]
        [TestCase("/api/v1/roll", 1, 20)]
        [TestCase("/api/v1/roll", 1, 100)]
        [TestCase("/api/v1/roll", 1, 1_000)]
        [TestCase("/api/v1/roll", 1, Limits.Die)]
        [TestCase("/api/v1/roll", 2, 1)]
        [TestCase("/api/v1/roll", 2, 2)]
        [TestCase("/api/v1/roll", 2, 3)]
        [TestCase("/api/v1/roll", 2, 4)]
        [TestCase("/api/v1/roll", 2, 6)]
        [TestCase("/api/v1/roll", 2, 10)]
        [TestCase("/api/v1/roll", 2, 12)]
        [TestCase("/api/v1/roll", 2, 20)]
        [TestCase("/api/v1/roll", 2, 100)]
        [TestCase("/api/v1/roll", 2, 1_000)]
        [TestCase("/api/v1/roll", 2, Limits.Die)]
        [TestCase("/api/v1/roll", 10, 1)]
        [TestCase("/api/v1/roll", 10, 2)]
        [TestCase("/api/v1/roll", 10, 3)]
        [TestCase("/api/v1/roll", 10, 4)]
        [TestCase("/api/v1/roll", 10, 6)]
        [TestCase("/api/v1/roll", 10, 10)]
        [TestCase("/api/v1/roll", 10, 12)]
        [TestCase("/api/v1/roll", 10, 20)]
        [TestCase("/api/v1/roll", 10, 100)]
        [TestCase("/api/v1/roll", 10, 1_000)]
        [TestCase("/api/v1/roll", 10, Limits.Die)]
        [TestCase("/api/v1/roll", 100, 1)]
        [TestCase("/api/v1/roll", 100, 2)]
        [TestCase("/api/v1/roll", 100, 3)]
        [TestCase("/api/v1/roll", 100, 4)]
        [TestCase("/api/v1/roll", 100, 6)]
        [TestCase("/api/v1/roll", 100, 10)]
        [TestCase("/api/v1/roll", 100, 12)]
        [TestCase("/api/v1/roll", 100, 20)]
        [TestCase("/api/v1/roll", 100, 100)]
        [TestCase("/api/v1/roll", 100, 1_000)]
        [TestCase("/api/v1/roll", 100, Limits.Die)]
        [TestCase("/api/v1/roll", 1_000, 1)]
        [TestCase("/api/v1/roll", 1_000, 2)]
        [TestCase("/api/v1/roll", 1_000, 3)]
        [TestCase("/api/v1/roll", 1_000, 4)]
        [TestCase("/api/v1/roll", 1_000, 6)]
        [TestCase("/api/v1/roll", 1_000, 10)]
        [TestCase("/api/v1/roll", 1_000, 12)]
        [TestCase("/api/v1/roll", 1_000, 20)]
        [TestCase("/api/v1/roll", 1_000, 100)]
        [TestCase("/api/v1/roll", 1_000, 1_000)]
        [TestCase("/api/v1/roll", 1_000, Limits.Die)]
        [TestCase("/api/v1/roll", Limits.Quantity, 1)]
        [TestCase("/api/v1/roll", Limits.Quantity, 2)]
        [TestCase("/api/v1/roll", Limits.Quantity, 3)]
        [TestCase("/api/v1/roll", Limits.Quantity, 4)]
        [TestCase("/api/v1/roll", Limits.Quantity, 6)]
        [TestCase("/api/v1/roll", Limits.Quantity, 10)]
        [TestCase("/api/v1/roll", Limits.Quantity, 12)]
        [TestCase("/api/v1/roll", Limits.Quantity, 20)]
        [TestCase("/api/v1/roll", Limits.Quantity, 100)]
        [TestCase("/api/v1/roll", Limits.Quantity, 1_000)]
        [TestCase("/api/v1/roll", Limits.Quantity, Limits.Die)]
        public async Task RollV1_ReturnsRoll(string route, int quantity, int die)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"{route}?quantity={quantity}&die={die}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToInt32(result), Is.InRange(quantity, quantity * die), uri.AbsoluteUri);
        }

        [TestCase(0, 0)]
        [TestCase(0, 1)]
        [TestCase(1, 0)]
        [TestCase(Limits.Quantity, Limits.Die + 1)]
        [TestCase(Limits.Quantity + 1, Limits.Die)]
        [TestCase(Limits.Quantity + 1, Limits.Die + 1)]
        public async Task RollV1_ReturnsBadRequest(int quantity, int die)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/roll?quantity={quantity}&die={die}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest), uri.AbsoluteUri);
        }

        [TestCase(1, 1)]
        [TestCase(1, 2)]
        [TestCase(1, 3)]
        [TestCase(1, 4)]
        [TestCase(1, 6)]
        [TestCase(1, 10)]
        [TestCase(1, 12)]
        [TestCase(1, 20)]
        [TestCase(1, 100)]
        [TestCase(1, 1_000)]
        [TestCase(1, Limits.Die)]
        [TestCase(2, 1)]
        [TestCase(2, 2)]
        [TestCase(2, 3)]
        [TestCase(2, 4)]
        [TestCase(2, 6)]
        [TestCase(2, 10)]
        [TestCase(2, 12)]
        [TestCase(2, 20)]
        [TestCase(2, 100)]
        [TestCase(2, 1_000)]
        [TestCase(2, Limits.Die)]
        [TestCase(10, 1)]
        [TestCase(10, 2)]
        [TestCase(10, 3)]
        [TestCase(10, 4)]
        [TestCase(10, 6)]
        [TestCase(10, 10)]
        [TestCase(10, 12)]
        [TestCase(10, 20)]
        [TestCase(10, 100)]
        [TestCase(10, 1_000)]
        [TestCase(10, Limits.Die)]
        [TestCase(100, 1)]
        [TestCase(100, 2)]
        [TestCase(100, 3)]
        [TestCase(100, 4)]
        [TestCase(100, 6)]
        [TestCase(100, 10)]
        [TestCase(100, 12)]
        [TestCase(100, 20)]
        [TestCase(100, 100)]
        [TestCase(100, 1_000)]
        [TestCase(100, Limits.Die)]
        [TestCase(1_000, 1)]
        [TestCase(1_000, 2)]
        [TestCase(1_000, 3)]
        [TestCase(1_000, 4)]
        [TestCase(1_000, 6)]
        [TestCase(1_000, 10)]
        [TestCase(1_000, 12)]
        [TestCase(1_000, 20)]
        [TestCase(1_000, 100)]
        [TestCase(1_000, 1_000)]
        [TestCase(1_000, Limits.Die)]
        [TestCase(Limits.Quantity, 1)]
        [TestCase(Limits.Quantity, 2)]
        [TestCase(Limits.Quantity, 3)]
        [TestCase(Limits.Quantity, 4)]
        [TestCase(Limits.Quantity, 6)]
        [TestCase(Limits.Quantity, 10)]
        [TestCase(Limits.Quantity, 12)]
        [TestCase(Limits.Quantity, 20)]
        [TestCase(Limits.Quantity, 100)]
        [TestCase(Limits.Quantity, 1_000)]
        [TestCase(Limits.Quantity, Limits.Die)]
        public async Task RollV2_ReturnsRoll(int quantity, int die)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v2/{quantity}/d/{die}/roll");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToInt32(result), Is.InRange(quantity, quantity * die), uri.AbsoluteUri);
        }

        [TestCase(0, 0)]
        [TestCase(0, 1)]
        [TestCase(1, 0)]
        [TestCase(Limits.Quantity, Limits.Die + 1)]
        [TestCase(Limits.Quantity + 1, Limits.Die)]
        [TestCase(Limits.Quantity + 1, Limits.Die + 1)]
        public async Task RollV2_ReturnsBadRequest(int quantity, int die)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v2/{quantity}/d/{die}/roll");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest), uri.AbsoluteUri);
        }
    }
}