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
        public async Task GenerateItem_ReturnsItem(string itemType, string power)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/item/{HttpUtility.UrlEncode(itemType)}/power/{power}/generate");
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
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane);

                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Mundane);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane);

                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Mundane);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Major);

                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Minor);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Major);
            }
        }
    }
}