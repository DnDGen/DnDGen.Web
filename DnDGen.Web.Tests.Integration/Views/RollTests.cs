using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace DnDGen.Web.Tests.Integration.Views
{
    [TestFixture]
    internal class RollTests : EndToEndTests
    {
        [TestCase("/roll")]
        [TestCase("/Roll")]
        public async Task Roll_Index_ReturnsRollPage(string url)
        {
            var response = await httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("RollGen")
                .And.Not.Contains("DnDGen rolled a Nat 1"));
        }

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
            Assert.That(result, Is.Not.Empty
                .And.Contains("roll")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("roll"));
            Assert.That(Convert.ToInt32(body["roll"]), Is.InRange(quantity, quantity * die));
        }

        [TestCase("/roll/validate", 1, 1, true)]
        [TestCase("/roll/validate", 1, 0, false)]
        [TestCase("/roll/validate", 0, 1, false)]
        [TestCase("/roll/validate", 1, -1, false)]
        [TestCase("/roll/validate", -1, 1, false)]
        [TestCase("/roll/validate", 1, 20, true)]
        [TestCase("/roll/validate", 3, 6, true)]
        [TestCase("/Roll/Validate", 3, 6, true)]
        [TestCase("/roll/validate", 42, 600, true)]
        [TestCase("/roll/validate", 10_000, 1, true)]
        [TestCase("/roll/validate", 10_001, 1, true)]
        [TestCase("/roll/validate", 16_500_000, 1, true)]
        [TestCase("/roll/validate", 16_500_001, 1, false)]
        [TestCase("/roll/validate", 1, 10_000, true)]
        [TestCase("/roll/validate", 1, 10_001, true)]
        [TestCase("/roll/validate", 1, 16_500_000, true)]
        [TestCase("/roll/validate", 1, 16_500_001, true)]
        [TestCase("/roll/validate", 1, int.MaxValue, true)]
        [TestCase("/roll/validate", 2, int.MaxValue, false)]
        public async Task Validate_ReturnsValidity(string url, int quantity, int die, bool valid)
        {
            var response = await httpClient.GetAsync($"{url}?quantity={quantity}&die={die}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("isValid")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("isValid"));
            Assert.That(Convert.ToBoolean(body["isValid"]), Is.EqualTo(valid));
        }

        [TestCase("/roll/rollexpression", "3d6+2", 5, 20)]
        [TestCase("/roll/rollExpression", "3d6+2", 5, 20)]
        [TestCase("/Roll/RollExpression", "3d6+2", 5, 20)]
        [TestCase("/roll/rollexpression", "42d600", 42, 42 * 600)]
        [TestCase("/roll/rollexpression", "42d600+92d66", 42 + 92, 42 * 600 + 92 * 66)]
        [TestCase("/roll/rollexpression", "1d3-4", -3, -1)]
        public async Task RollExpression_ReturnsRoll(string url, string expression, int min, int max)
        {
            var response = await httpClient.GetAsync($"{url}?expression={HttpUtility.UrlEncode(expression)}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("roll")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("roll"));
            Assert.That(Convert.ToInt32(body["roll"]), Is.InRange(min, max));
        }

        [TestCase("/roll/validateexpression", "3d6+2", true)]
        [TestCase("/roll/validateExpression", "3d6+2", true)]
        [TestCase("/Roll/ValidateExpression", "3d6+2", true)]
        [TestCase("/roll/validateexpression", "invalid", false)]
        [TestCase("/roll/validateexpression", "42d600", true)]
        [TestCase("/roll/validateexpression", "42d600+92d66", true)]
        [TestCase("/roll/validateexpression", "1d3-4", true)]
        [TestCase("/roll/validateexpression", "10000d1", true)]
        [TestCase("/roll/validateexpression", "10001d1", true)]
        [TestCase("/roll/validateexpression", "16500000d1", true)]
        [TestCase("/roll/validateexpression", "16500001d1", false)]
        [TestCase("/roll/validateexpression", "1d10000", true)]
        [TestCase("/roll/validateexpression", "1d10001", true)]
        [TestCase("/roll/validateexpression", "1d16500000", true)]
        [TestCase("/roll/validateexpression", "1d16500001", true)]
        [TestCase("/roll/validateexpression", "1d2100000000", true)]
        [TestCase("/roll/validateexpression", "2d2100000000", false)]
        [TestCase("/roll/validateexpression", "1d2200000000", false)]
        [TestCase("/roll/validateexpression", "1d", false)]
        [TestCase("/roll/validateexpression", "d20", true)]
        [TestCase("/roll/validateexpression", "1d20", true)]
        [TestCase("/roll/validateexpression", "1 d 20", true)]
        [TestCase("/roll/validateexpression", "xdy", false)]
        [TestCase("/roll/validateexpression", "1d4*1000", true)]
        [TestCase("/roll/validateexpression", "avg(3d6)", false)]
        public async Task ValidateExpression_ReturnsValidity(string url, string expression, bool valid)
        {
            var response = await httpClient.GetAsync($"{url}?expression={HttpUtility.UrlEncode(expression)}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("isValid")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("isValid"));
            Assert.That(Convert.ToBoolean(body["isValid"]), Is.EqualTo(valid));
        }
    }
}
