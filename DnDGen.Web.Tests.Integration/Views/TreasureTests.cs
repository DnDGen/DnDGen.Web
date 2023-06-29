using DnDGen.Web.Models;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Collections;
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

        [TestCaseSource(nameof(TreasureGenerationData))]
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

        public static IEnumerable TreasureGenerationData
        {
            get
            {
                yield return new TestCaseData("/Treasure/Generate", "Treasure", 1);

                var viewModel = new TreasureViewModel();

                foreach (var treasureType in viewModel.TreasureTypes)
                {
                    yield return new TestCaseData("/treasure/generate", treasureType, 1);
                    yield return new TestCaseData("/treasure/generate", treasureType, 2);
                    yield return new TestCaseData("/treasure/generate", treasureType, 10);
                    yield return new TestCaseData("/treasure/generate", treasureType, 20);
                    yield return new TestCaseData("/treasure/generate", treasureType, viewModel.MaxTreasureLevel);
                }
            }
        }

        [TestCaseSource(nameof(ItemGenerationData))]
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

        public static IEnumerable ItemGenerationData
        {
            get
            {
                yield return new TestCaseData("/Treasure/GenerateItem", "Alchemical Item", "Mundane");
                yield return new TestCaseData("/treasure/generateItem", "Alchemical Item", "Mundane");

                var viewModel = new TreasureViewModel();

                foreach (var kvp in viewModel.ItemPowers)
                {
                    foreach (var power in kvp.Value)
                    {
                        yield return new TestCaseData("/treasure/generateitem", kvp.Key, power);
                    }
                }
            }
        }
    }
}
