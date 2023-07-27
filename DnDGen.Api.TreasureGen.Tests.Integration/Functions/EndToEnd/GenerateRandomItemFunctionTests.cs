using DnDGen.TreasureGen;
using DnDGen.TreasureGen.Items;
using Newtonsoft.Json;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions.EndToEnd
{
    public class GenerateRandomItemFunctionTests : EndToEndTests
    {
        [Repeat(100)]
        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task GenerateItem_ReturnsItem(string route, string itemType, string power)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"{route}?itemType={HttpUtility.UrlEncode(itemType)}&power={power}");
            var response = await httpClient.GetAsync(uri);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

            var treasure = JsonConvert.DeserializeObject<Treasure>(result);
            Assert.That(treasure, Is.Not.Null, uri.AbsoluteUri);
            Assert.That(treasure.IsAny, Is.True, uri.AbsoluteUri);
            Assert.That(treasure.Coin.Quantity, Is.Zero);
            Assert.That(treasure.Goods, Is.Empty);
            Assert.That(treasure.Items, Is.Not.Empty);
            Assert.That(treasure.Items.Count(), Is.EqualTo(1));
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                yield return new TestCaseData("/API/V1/GenerateItem", "Alchemical Item", "Mundane");
                yield return new TestCaseData("/api/v1/generateItem", "Alchemical Item", "Mundane");

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Armor, PowerConstants.Mundane);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Armor, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Armor, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Armor, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Potion, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Potion, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Potion, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Ring, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Ring, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Ring, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Rod, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Rod, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Scroll, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Scroll, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Scroll, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Staff, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Staff, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Tool, PowerConstants.Mundane);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Wand, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Wand, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Wand, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Weapon, PowerConstants.Mundane);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Weapon, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Weapon, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.Weapon, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.WondrousItem, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.WondrousItem, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/generateitem", ItemTypeConstants.WondrousItem, PowerConstants.Major);
            }
        }
    }
}