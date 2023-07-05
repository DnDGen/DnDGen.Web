using System.Net;

namespace DnDGen.Api.RollGen.Tests.Integration
{
    public class RollFunctionTests : EndToEndTests
    {
        [TestCase("/api/rollgen/v1/roll", 1, 1)]
        [TestCase("/roll/roll", 1, 1)]
        [TestCase("/roll/roll", 1, 20)]
        [TestCase("/roll/roll", 3, 6)]
        [TestCase("/Roll/Roll", 3, 6)]
        [TestCase("/roll/roll", 42, 600)]
        public async Task Roll_ReturnsRoll(string url, int quantity, int die)
        {
            var response = await httpClient.GetAsync($"{url}?quantity={quantity}&die={die}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty);
            Assert.That(Convert.ToInt32(result), Is.InRange(quantity, quantity * die));
        }
    }
}