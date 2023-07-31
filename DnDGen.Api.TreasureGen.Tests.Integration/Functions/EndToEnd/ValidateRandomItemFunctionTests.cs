using DnDGen.TreasureGen.Items;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions.EndToEnd
{
    public class ValidateRandomItemFunctionTests : EndToEndTests
    {
        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task ValidateRandomItem_ReturnsValidity(string itemType, string power, bool valid)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/item/{HttpUtility.UrlEncode(itemType)}/power/{power}/validate");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty.And.EqualTo(valid.ToString()), uri.AbsoluteUri);
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                yield return new TestCaseData("Building", PowerConstants.Mundane, false);
                yield return new TestCaseData("Building", PowerConstants.Minor, false);
                yield return new TestCaseData("Building", PowerConstants.Medium, false);
                yield return new TestCaseData("Building", PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypeConstants.Armor, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Armor, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.Potion, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Potion, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.Ring, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Ring, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.Rod, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Rod, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.Scroll, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Scroll, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.Staff, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Staff, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.Tool, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.Tool, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypeConstants.Wand, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Wand, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.Weapon, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.Weapon, PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.WondrousItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Major, true);
            }
        }
    }
}