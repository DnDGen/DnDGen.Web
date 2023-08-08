using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Newtonsoft.Json;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions.EndToEnd
{
    [Ignore("These tests are failing locally. Will eventually replace them with Postman/nightly E2E tests")]
    public class GenerateRandomItemFunctionTests : EndToEndTests
    {
        [TestCaseSource(nameof(RandomItemGenerationData))]
        public async Task GenerateItem_ReturnsRandomItem(string itemTypeInput, string power, string itemTypeOutput)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/item/{itemTypeInput}/power/{power}/generate");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

            var item = JsonConvert.DeserializeObject<Item>(result);
            Assert.That(item, Is.Not.Null, uri.AbsoluteUri);
            Assert.That(item.Name, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), uri.AbsoluteUri);
        }

        public static IEnumerable RandomItemGenerationData
        {
            get
            {
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);

                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, ItemTypeConstants.Armor);

                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, ItemTypeConstants.Potion);

                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ItemTypeConstants.Ring);

                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, ItemTypeConstants.Rod);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, ItemTypeConstants.Scroll);

                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, ItemTypeConstants.Staff);

                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ItemTypeConstants.Tool);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, ItemTypeConstants.Wand);

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, ItemTypeConstants.Weapon);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, ItemTypeConstants.WondrousItem);
            }
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task GenerateItem_ReturnsItem(string itemTypeInput, string power, string name, string itemTypeOutput)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/item/{itemTypeInput}/power/{power}/generate?name={HttpUtility.UrlEncode(name)}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

            var item = JsonConvert.DeserializeObject<Item>(result);
            Assert.That(item, Is.Not.Null, uri.AbsoluteUri);
            Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), uri.AbsoluteUri);
            Assert.That(item.BaseNames.Union(new[] { item.Name }), Contains.Item(name), uri.AbsoluteUri);
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                var alchemicalItems = AlchemicalItemConstants.GetAllAlchemicalItems();
                foreach (var alchemicalItem in alchemicalItems)
                {
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem, ItemTypeConstants.AlchemicalItem);
                }

                var armors = ArmorConstants.GetAllArmorsAndShields(false);
                foreach (var armor in armors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, ItemTypeConstants.Armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, ItemTypeConstants.Armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, ItemTypeConstants.Armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, ItemTypeConstants.Armor);
                }

                var specificArmors = ArmorConstants.GetAllSpecificArmorsAndShields();
                foreach (var armor in specificArmors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, ItemTypeConstants.Armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, ItemTypeConstants.Armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, ItemTypeConstants.Armor);
                }

                var potions = PotionConstants.GetAllPotions(false);
                foreach (var potion in potions)
                {
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, potion, ItemTypeConstants.Potion);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, ItemTypeConstants.Potion);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, potion, ItemTypeConstants.Potion);
                }

                var rings = RingConstants.GetAllRings();
                foreach (var ring in rings)
                {
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ring, ItemTypeConstants.Ring);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, ItemTypeConstants.Ring);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ring, ItemTypeConstants.Ring);
                }

                var rods = RodConstants.GetAllRods();
                foreach (var rod in rods)
                {
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, ItemTypeConstants.Rod);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, rod, ItemTypeConstants.Rod);
                }

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, "My Scroll", ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, "My Scroll", ItemTypeConstants.Scroll);

                var staffs = StaffConstants.GetAllStaffs();
                foreach (var staff in staffs)
                {
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, ItemTypeConstants.Staff);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, staff, ItemTypeConstants.Staff);
                }

                var tools = ToolConstants.GetAllTools();
                foreach (var tool in tools)
                {
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, ItemTypeConstants.Tool);
                }

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, "My Wand", ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, "My Wand", ItemTypeConstants.Wand);

                var weapons = WeaponConstants.GetAllWeapons(false, false);
                foreach (var weapon in weapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon, ItemTypeConstants.Weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, ItemTypeConstants.Weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, ItemTypeConstants.Weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, ItemTypeConstants.Weapon);
                }

                var specificWeapons = WeaponConstants.GetAllSpecific().Except(WeaponConstants.GetAllTemplates());
                foreach (var weapon in specificWeapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, ItemTypeConstants.Weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, ItemTypeConstants.Weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, ItemTypeConstants.Weapon);
                }

                var wondrousItems = WondrousItemConstants.GetAllWondrousItems();
                foreach (var wondrousItem in wondrousItems)
                {
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, wondrousItem, ItemTypeConstants.WondrousItem);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem, ItemTypeConstants.WondrousItem);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, wondrousItem, ItemTypeConstants.WondrousItem);
                }
            }
        }
    }
}