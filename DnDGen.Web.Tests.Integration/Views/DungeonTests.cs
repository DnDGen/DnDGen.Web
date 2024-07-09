using NUnit.Framework;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Web.Tests.Integration.Views
{
    [TestFixture]
    internal class DungeonTests : EndToEndTests
    {
        [TestCase("/dungeon")]
        [TestCase("/Dungeon")]
        public async Task Dungeon_Index_ReturnsDungeonPage(string url)
        {
            var response = await httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("DungeonGen")
                .And.Not.Contains("DnDGen rolled a Nat 1"));
        }
    }
}
