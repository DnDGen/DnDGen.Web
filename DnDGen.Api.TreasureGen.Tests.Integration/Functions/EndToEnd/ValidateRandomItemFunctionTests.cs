using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions.EndToEnd
{
    public class ValidateRandomItemFunctionTests : EndToEndTests
    {
        [TestCaseSource(nameof(RandomItemGenerationData))]
        public async Task ValidateRandomItem_ReturnsValidity(string itemType, string power, bool valid)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/item/{itemType}/power/{power}/validate");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToBoolean(result), Is.EqualTo(valid), uri.AbsoluteUri);
        }

        public static IEnumerable RandomItemGenerationData
        {
            get
            {
                yield return new TestCaseData("Building", PowerConstants.Mundane, false);
                yield return new TestCaseData("Building", PowerConstants.Minor, false);
                yield return new TestCaseData("Building", PowerConstants.Medium, false);
                yield return new TestCaseData("Building", PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.AlchemicalItem, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Armor.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Potion.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Ring.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Rod.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Staff.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Tool.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Minor, false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Medium, false);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Mundane, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(ItemTypeConstants.WondrousItem, "Omnipotent", false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Minor, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Medium, false);
                yield return new TestCaseData(ItemTypeConstants.WondrousItem, PowerConstants.Major, false);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), "Omnipotent", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, true);

                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), "Omnipotent", false);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Mundane, false);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Minor, true);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Medium, true);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Major, true);
            }
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task ValidateItem_ReturnsValidity(string itemTypeInput, string power, string name, bool valid)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/item/{itemTypeInput}/power/{power}/validate?name={HttpUtility.UrlEncode(name)}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(Convert.ToBoolean(result), Is.EqualTo(valid), uri.AbsoluteUri);
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                var alchemicalItems = AlchemicalItemConstants.GetAllAlchemicalItems();
                foreach (var alchemicalItem in alchemicalItems)
                {
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem, true);

                    //yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, alchemicalItem, false);

                    //yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Minor, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, alchemicalItem, false);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Major, alchemicalItem, false);
                }

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);

                var armors = ArmorConstants.GetAllArmorsAndShields(false);
                foreach (var armor in armors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, armor, false);

                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, false);
                }

                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var specificArmors = ArmorConstants.GetAllSpecificArmorsAndShields();
                foreach (var armor in specificArmors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, true);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, armor, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, armor, false);

                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, false);
                }

                var potions = PotionConstants.GetAllPotions(false);
                foreach (var potion in potions)
                {
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, potion, true);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, true);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, potion, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, potion, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, potion, false);

                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, potion, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, potion, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, potion, false);
                }

                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var rings = RingConstants.GetAllRings();
                foreach (var ring in rings)
                {
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ring, true);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, true);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ring, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ring, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ring, false);

                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, false);
                    //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ring, false);
                }

                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var rods = RodConstants.GetAllRods();
                foreach (var rod in rods)
                {
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, true);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, rod, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, rod, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, rod, false);

                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, rod, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Minor, rod, false);
                    //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, false);
                    //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, rod, false);
                }

                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", true);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, "My Scroll", true);

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "My Scroll", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "My Scroll", false);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, "My Scroll", false);

                //INFO: Because any name can be used for a scroll, other item names will always be valid
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var staffs = StaffConstants.GetAllStaffs();
                foreach (var staff in staffs)
                {
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, true);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, staff, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, staff, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, staff, false);

                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, staff, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Minor, staff, false);
                    //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, false);
                    //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, staff, false);
                }

                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var tools = ToolConstants.GetAllTools();
                foreach (var tool in tools)
                {
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Mundane, tool, false);
                    //yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, tool, false);

                    //yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Minor, tool, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, tool, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Major, tool, false);
                }

                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", true);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, "My Wand", true);

                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "My Wand", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "My Wand", false);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Mundane, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, "My Wand", false);

                //INFO: Because any name can be used for a wand, other item names will always be valid
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "Wrong Item", false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                //yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var weapons = WeaponConstants.GetAllWeapons(false, false);
                foreach (var weapon in weapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, weapon, false);

                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, false);
                }

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                //yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);

                var specificWeapons = WeaponConstants.GetAllSpecific().Except(WeaponConstants.GetAllTemplates());
                foreach (var weapon in specificWeapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, true);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, weapon, false);

                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Mundane, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, weapon, false);
                    //yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, weapon, false);
                }

                var wondrousItems = WondrousItemConstants.GetAllWondrousItems();
                foreach (var wondrousItem in wondrousItems)
                {
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, wondrousItem, true);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem, true);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, wondrousItem, true);

                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, wondrousItem, false);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem, false);

                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Mundane, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem, false);
                    //yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, wondrousItem, false);
                }

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, "Wrong Item", false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, AlchemicalItemConstants.Acid, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ArmorConstants.AbsorbingShield, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ArmorConstants.BandedMail, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, PotionConstants.Aid, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, RingConstants.AcidResistance_Greater, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, RodConstants.Absorption, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, StaffConstants.Abjuration, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ToolConstants.ArtisansTools_Masterwork, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WeaponConstants.Arrow, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WeaponConstants.AssassinsDagger, false);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false);
            }
        }
    }
}