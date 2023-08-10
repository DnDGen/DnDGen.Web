using NUnit.Framework;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Web.Tests.Integration.Views
{
    [TestFixture]
    internal class TreasureTests : EndToEndTests
    {
        [TestCase("/treasure")]
        [TestCase("/Treasure")]
        public async Task Treasure_Index_ReturnsTreasurePage(string url)
        {
            var response = await httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("TreasureGen")
                .And.Not.Contains("DnDGen rolled a Nat 1"));
        }
    }
}
