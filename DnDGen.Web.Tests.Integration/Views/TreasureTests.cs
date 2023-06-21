using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Web;

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

        [TestCase("/treasure/generate", "Treasure", 1)]
        [TestCase("/Treasure/Generate", "Treasure", 1)]
        [TestCase("/treasure/generate", "Treasure", 10)]
        [TestCase("/treasure/generate", "Treasure", 20)]
        [TestCase("/treasure/generate", "Coin", 10)]
        [TestCase("/treasure/generate", "Goods", 10)]
        [TestCase("/treasure/generate", "Items", 10)]
        public async Task Generate_ReturnsTreasure(string url, string treasureType, int level)
        {
            var response = await httpClient.GetAsync($"{url}?treasureType={treasureType}&level={level}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("treasure")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("treasure"));
            Assert.That(body["treasure"], Is.Not.Null.And.Not.Empty);
        }

        [TestCase("/treasure/generateitem", "Alchemical Item", "Mundane")]
        [TestCase("/treasure/generateItem", "Alchemical Item", "Mundane")]
        [TestCase("/Treasure/GenerateItem", "Alchemical Item", "Mundane")]
        [TestCase("/treasure/generateitem", "Armor", "Mundane")]
        [TestCase("/treasure/generateitem", "Armor", "Minor")]
        [TestCase("/treasure/generateitem", "Armor", "Medium")]
        [TestCase("/treasure/generateitem", "Armor", "Major")]
        [TestCase("/treasure/generateitem", "Weapon", "Mundane")]
        [TestCase("/treasure/generateitem", "Weapon", "Minor")]
        [TestCase("/treasure/generateitem", "Weapon", "Medium")]
        [TestCase("/treasure/generateitem", "Weapon", "Major")]
        [TestCase("/treasure/generateitem", "Potion", "Minor")]
        [TestCase("/treasure/generateitem", "Potion", "Medium")]
        [TestCase("/treasure/generateitem", "Potion", "Major")]
        [TestCase("/treasure/generateitem", "Ring", "Minor")]
        [TestCase("/treasure/generateitem", "Ring", "Medium")]
        [TestCase("/treasure/generateitem", "Ring", "Major")]
        [TestCase("/treasure/generateitem", "Scroll", "Minor")]
        [TestCase("/treasure/generateitem", "Scroll", "Medium")]
        [TestCase("/treasure/generateitem", "Scroll", "Major")]
        [TestCase("/treasure/generateitem", "Rod", "Medium")]
        [TestCase("/treasure/generateitem", "Rod", "Major")]
        [TestCase("/treasure/generateitem", "Staff", "Medium")]
        [TestCase("/treasure/generateitem", "Staff", "Major")]
        [TestCase("/treasure/generateitem", "Tool", "Mundane")]
        [TestCase("/treasure/generateitem", "Wand", "Minor")]
        [TestCase("/treasure/generateitem", "Wand", "Medium")]
        [TestCase("/treasure/generateitem", "Wand", "Major")]
        [TestCase("/treasure/generateitem", "Wondrous Item", "Minor")]
        [TestCase("/treasure/generateitem", "Wondrous Item", "Medium")]
        [TestCase("/treasure/generateitem", "Wondrous Item", "Major")]
        public async Task GenerateItem_ReturnsItem(string url, string itemType, string power)
        {
            var clientId = Guid.NewGuid();
            var response = await httpClient.GetAsync($"{url}?clientId={clientId}&itemType={HttpUtility.UrlEncode(itemType)}&power={power}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("treasure")
                .And.Contains("items")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("treasure"));
            Assert.That(body["treasure"], Is.Not.Null.And.Not.Empty.And.ContainKey("items"));
            Assert.That(body["treasure"]["items"], Is.Not.Null.And.Not.Empty.And.Count.EqualTo(1));
        }
    }
}
