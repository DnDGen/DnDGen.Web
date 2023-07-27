using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using Newtonsoft.Json;
using System.Collections;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions.EndToEnd
{
    public class GenerateRandomTreasureFunctionTests : EndToEndTests
    {
        [Repeat(100)]
        [TestCaseSource(nameof(TreasureGenerationData))]
        public async Task GenerateRandom_ReturnsTreasure(string route, string treasureType, int level)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"{route}?treasureType={treasureType}&level={level}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

            var treasure = JsonConvert.DeserializeObject<Treasure>(result);
            Assert.That(treasure, Is.Not.Null, uri.AbsoluteUri);
            Assert.That(treasure.IsAny, Is.True, uri.AbsoluteUri);
        }

        public static IEnumerable TreasureGenerationData
        {
            get
            {
                yield return new TestCaseData("/API/V1/Generate/Random", TreasureTypes.Treasure.ToString(), 20);

                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData("/api/v1/generate/random", treasureType.ToString().ToLower(), 20);
                    yield return new TestCaseData("/api/v1/generate/random", treasureType.ToString().ToUpper(), 20);
                    yield return new TestCaseData("/api/v1/generate/random", treasureType.ToString(), LevelLimits.Minimum);
                    yield return new TestCaseData("/api/v1/generate/random", treasureType.ToString(), 2);
                    yield return new TestCaseData("/api/v1/generate/random", treasureType.ToString(), 10);
                    yield return new TestCaseData("/api/v1/generate/random", treasureType.ToString(), 20);
                    yield return new TestCaseData("/api/v1/generate/random", treasureType.ToString(), LevelLimits.Maximum);
                }
            }
        }

        //[Repeat(100)]
        //[TestCaseSource(nameof(ItemGenerationData))]
        //public async Task GenerateItem_ReturnsItem(string route, string itemType, string power)
        //{
        //    var baseUri = new Uri(localFunctions.BaseUrl);
        //    var uri = new Uri(baseUri, $"{route}?itemType={HttpUtility.UrlEncode(itemType)}&power={power}");
        //    var response = await httpClient.GetAsync(uri);

        //    response.EnsureSuccessStatusCode();
        //    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        //    Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

        //    var result = await response.Content.ReadAsStringAsync();
        //    Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

        //    var treasure = JsonConvert.DeserializeObject<Treasure>(result);
        //    Assert.That(treasure, Is.Not.Null, uri.AbsoluteUri);
        //    Assert.That(treasure.IsAny, Is.True, uri.AbsoluteUri);
        //    Assert.That(treasure.Coin.Quantity, Is.Zero);
        //    Assert.That(treasure.Goods, Is.Empty);
        //    Assert.That(treasure.Items, Is.Not.Empty);
        //    Assert.That(treasure.Items.Count(), Is.EqualTo(1));
        //}

        //public static IEnumerable ItemGenerationData
        //{
        //    get
        //    {
        //        yield return new TestCaseData("/API/V1/GenerateItem", "Alchemical Item", "Mundane");
        //        yield return new TestCaseData("/api/v1/generateItem", "Alchemical Item", "Mundane");

        //        var viewModel = new TreasureViewModel();

        //        foreach (var kvp in viewModel.ItemPowers)
        //        {
        //            foreach (var power in kvp.Value)
        //            {
        //                yield return new TestCaseData("/api/v1/generateitem", kvp.Key, power);
        //            }
        //        }
        //    }
        //}
    }
}