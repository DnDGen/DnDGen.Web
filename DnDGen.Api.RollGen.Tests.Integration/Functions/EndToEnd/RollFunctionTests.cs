using System.Net;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions.EndToEnd
{
    public class RollFunctionTests : EndToEndTests
    {
        [TestCase("/api/rollgen/v1/roll", 1, 1)]
        [TestCase("/api/rollgen/v1/roll", 1, 1)]
        [TestCase("/api/rollgen/v1/roll", 1, 20)]
        [TestCase("/api/RollGen/v1/Roll", 1, 20)]
        [TestCase("/api/rollgen/v1/roll", 3, 6)]
        [TestCase("/api/rollgen/v1/roll", 42, 600)]
        public async Task Roll_ReturnsRoll(string route, int quantity, int die)
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
    }
}