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

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

            var item = JsonConvert.DeserializeObject<Item>(result);
            Assert.That(item, Is.Not.Null, uri.AbsoluteUri);
            Assert.That(item.Name, Is.Not.Empty, uri.AbsoluteUri);
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                yield return new TestCaseData("/API/V1/Item/Generate/Random", ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Armor, PowerConstants.Mundane);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Armor, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Armor, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Armor, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Potion, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Potion, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Potion, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Ring, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Ring, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Ring, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Rod, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Rod, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Scroll, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Scroll, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Scroll, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Staff, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Staff, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Tool, PowerConstants.Mundane);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Wand, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Wand, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Wand, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Weapon, PowerConstants.Mundane);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Weapon, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Weapon, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.Weapon, PowerConstants.Major);

                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.WondrousItem, PowerConstants.Minor);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.WondrousItem, PowerConstants.Medium);
                yield return new TestCaseData("/api/v1/item/generate/random", ItemTypeConstants.WondrousItem, PowerConstants.Major);
            }
        }
    }
}