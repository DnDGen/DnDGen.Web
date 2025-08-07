using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Models.Legacy;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class GenerateRandomItemFunctionTests : IntegrationTests
    {
        private GenerateRandomItemFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateRandomItemFunction(loggerFactory, dependencyFactory);
        }

        [TestCaseSource(nameof(RandomItemGenerationData))]
        public async Task GenerateRandomV1_ReturnsTreasure(string itemTypeInput, string power, string itemTypeOutput)
        {
            var url = GetUrl("v1", itemTypeInput, power);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, itemTypeInput, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var item = StreamHelper.Read<Item>(response.Body);
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty);
            Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), item.Name);
            Assert.That(item.Quantity, Is.Positive, item.Name);
        }

        private string GetUrl(string version, string itemType, string power, string query = "")
        {
            var url = $"https://treasure.dndgen.com/api/{version}/item/{itemType}/power/{power}/generate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        public static IEnumerable RandomItemGenerationData
        {
            get
            {
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(((int)ItemTypes.AlchemicalItem).ToString(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToUpper(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString().ToLower(), PowerConstants.Mundane, ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane.ToUpper(), ItemTypeConstants.AlchemicalItem);
                yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane.ToLower(), ItemTypeConstants.AlchemicalItem);

                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(((int)ItemTypes.Armor).ToString(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Armor);
                yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, ItemTypeConstants.Armor);

                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(((int)ItemTypes.Potion).ToString(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Potion);
                yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, ItemTypeConstants.Potion);

                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(((int)ItemTypes.Ring).ToString(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Ring);
                yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ItemTypeConstants.Ring);

                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(((int)ItemTypes.Rod).ToString(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Rod);
                yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, ItemTypeConstants.Rod);

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(((int)ItemTypes.Scroll).ToString(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Scroll);
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, ItemTypeConstants.Scroll);

                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(((int)ItemTypes.Staff).ToString(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Staff);
                yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, ItemTypeConstants.Staff);

                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, ItemTypeConstants.Tool);
                yield return new TestCaseData(((int)ItemTypes.Tool).ToString(), PowerConstants.Mundane, ItemTypeConstants.Tool);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToUpper(), PowerConstants.Mundane, ItemTypeConstants.Tool);
                yield return new TestCaseData(ItemTypes.Tool.ToString().ToLower(), PowerConstants.Mundane, ItemTypeConstants.Tool);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane.ToUpper(), ItemTypeConstants.Tool);
                yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane.ToLower(), ItemTypeConstants.Tool);

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(((int)ItemTypes.Wand).ToString(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Wand);
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, ItemTypeConstants.Wand);

                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(((int)ItemTypes.Weapon).ToString(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.Weapon);
                yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, ItemTypeConstants.Weapon);

                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(((int)ItemTypes.WondrousItem).ToString(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToUpper(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString().ToLower(), PowerConstants.Medium, ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium.ToUpper(), ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium.ToLower(), ItemTypeConstants.WondrousItem);
                yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, ItemTypeConstants.WondrousItem);
            }
        }

        [TestCase(PowerConstants.Mundane)]
        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateRandomArmorV1_ReturnsArmorWithArmorProperties(string power)
        {
            var url = GetUrl("v1", ItemTypes.Armor.ToString(), power);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, ItemTypes.Armor.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var armor = StreamHelper.Read<Armor>(response.Body);
            Assert.That(armor, Is.Not.Null);
            Assert.That(armor.Summary, Is.Not.Empty);
            Assert.That(armor.Name, Is.Not.Empty, armor.Summary);
            Assert.That(armor.ItemType, Is.EqualTo(ItemTypeConstants.Armor), armor.Summary);
            Assert.That(armor.Quantity, Is.Positive, armor.Summary);
            Assert.That(armor.CanBeUsedAsWeaponOrArmor, Is.True, armor.Summary);

            if (string.IsNullOrEmpty(armor.Magic.Curse))
            {
                Assert.That(armor.ArmorBonus, Is.Positive, armor.Summary);
                Assert.That(armor.TotalArmorBonus, Is.Positive, armor.Summary);
            }

            if (!armor.Attributes.Contains(AttributeConstants.Shield))
            {
                Assert.That(armor.MaxDexterityBonus, Is.Not.Negative, armor.Summary);
                Assert.That(armor.TotalMaxDexterityBonus, Is.Not.Negative, armor.Summary);
            }

            Assert.That(armor.ArmorCheckPenalty, Is.Not.Positive, armor.Summary);
            Assert.That(armor.Size, Is.Not.Empty, armor.Summary);
            Assert.That(armor.TotalArmorCheckPenalty, Is.Not.Positive, armor.Summary);
        }

        [TestCase(PowerConstants.Mundane)]
        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateRandomWeaponV1_ReturnsWeaponWithWeaponProperties(string power)
        {
            var url = GetUrl("v1", ItemTypes.Weapon.ToString(), power);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, ItemTypes.Weapon.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var weapon = StreamHelper.Read<WeaponV1>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            Assert.That(weapon.Name, Is.Not.Empty);
            Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Weapon), weapon.Name);
            Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
            Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
            Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
            Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamageDescription, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.DamageDescription, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.IsDoubleWeapon, Is.True.Or.False, weapon.Name);
            Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
            Assert.That(weapon.ThreatRangeDescription, Is.Not.Empty, weapon.Name);
        }

        [TestCase(PowerConstants.Mundane)]
        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateDoubleWeaponV1_ReturnsWeaponWithWeaponProperties(string power)
        {
            var url = GetUrl("v1", ItemTypes.Weapon.ToString(), power, $"?name={HttpUtility.UrlEncode(WeaponConstants.TwoBladedSword)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, ItemTypes.Weapon.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var weapon = StreamHelper.Read<WeaponV1>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(weapon.Name, Is.EqualTo(WeaponConstants.TwoBladedSword).Or.EqualTo(WeaponConstants.ShiftersSorrow));
                Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Weapon), weapon.Name);
                Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
                Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
                Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
                Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.IsDoubleWeapon, Is.True, weapon.Name);
                Assert.That(weapon.SecondaryCriticalDamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.SecondaryCriticalDamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.SecondaryCriticalDamages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.SecondaryCriticalMultiplier, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.SecondaryDamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.SecondaryDamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.SecondaryDamages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.SecondaryHasAbilities, Is.True.Or.False, weapon.Name);
                Assert.That(weapon.SecondaryMagicBonus, Is.Not.Negative, weapon.Name);
                Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
                Assert.That(weapon.ThreatRangeDescription, Is.Not.Empty, weapon.Name);
            }
        }

        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateItemV1_GeneratesRod_WithWeaponProperties(string power)
        {
            var url = GetUrl("v1", ItemTypes.Rod.ToString(), power, $"?name={HttpUtility.UrlEncode(RodConstants.Flailing)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, ItemTypes.Rod.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var weapon = StreamHelper.Read<WeaponV1>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(weapon.Name, Is.Not.Empty);
                Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Rod), weapon.Name);
                Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
                Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
                Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
                Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.IsDoubleWeapon, Is.True.Or.False, weapon.Name);
                Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
                Assert.That(weapon.ThreatRangeDescription, Is.Not.Empty, weapon.Name);
            }
        }

        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateItemV1_GeneratesStaff_WithWeaponProperties(string power)
        {
            var url = GetUrl("v1", ItemTypes.Staff.ToString(), power, $"?name={HttpUtility.UrlEncode(StaffConstants.Power)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, ItemTypes.Staff.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var weapon = StreamHelper.Read<WeaponV1>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(weapon.Name, Is.Not.Empty);
                Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Staff), weapon.Name);
                Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
                Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
                Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
                Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageDescription, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.IsDoubleWeapon, Is.True.Or.False, weapon.Name);
                Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
                Assert.That(weapon.ThreatRangeDescription, Is.Not.Empty, weapon.Name);
            }
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task GenerateItemV1_ReturnsItem(string itemTypeInput, string power, string name, string itemTypeOutput, string itemNameOutput)
        {
            var url = GetUrl("v1", itemTypeInput, power, $"?name={HttpUtility.UrlEncode(name)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, itemTypeInput, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var item = StreamHelper.Read<Item>(response.Body);
            Assert.That(item, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(item.Name, Is.Not.Empty);
                Assert.That(item.NameMatches(itemNameOutput), Is.True, item.Name);
                Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), item.Name);
                Assert.That(item.Quantity, Is.Positive, item.Name);
            }
        }

        public static IEnumerable ItemGenerationData
        {
            get
            {
                var alchemicalItems = AlchemicalItemConstants.GetAllAlchemicalItems();
                foreach (var alchemicalItem in alchemicalItems)
                {
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem,
                        ItemTypeConstants.AlchemicalItem, alchemicalItem);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem.ToUpper(),
                        ItemTypeConstants.AlchemicalItem, alchemicalItem);
                    yield return new TestCaseData(ItemTypes.AlchemicalItem.ToString(), PowerConstants.Mundane, alchemicalItem.ToLower(),
                        ItemTypeConstants.AlchemicalItem, alchemicalItem);
                }

                var armors = ArmorConstants.GetAllArmorsAndShields(false);
                foreach (var armor in armors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Mundane, armor, ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor.ToUpper(), ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor.ToLower(), ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, ItemTypeConstants.Armor, armor);
                }

                var specificArmors = ArmorConstants.GetAllSpecificArmorsAndShields();
                foreach (var armor in specificArmors)
                {
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Minor, armor, ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor, ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor.ToUpper(), ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Medium, armor.ToLower(), ItemTypeConstants.Armor, armor);
                    yield return new TestCaseData(ItemTypes.Armor.ToString(), PowerConstants.Major, armor, ItemTypeConstants.Armor, armor);
                }

                var potions = PotionConstants.GetAllPotions(false);
                foreach (var potion in potions)
                {
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Minor, potion, ItemTypeConstants.Potion, potion);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion, ItemTypeConstants.Potion, potion);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion.ToUpper(), ItemTypeConstants.Potion, potion);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Medium, potion.ToLower(), ItemTypeConstants.Potion, potion);
                    yield return new TestCaseData(ItemTypes.Potion.ToString(), PowerConstants.Major, potion, ItemTypeConstants.Potion, potion);
                }

                var rings = RingConstants.GetAllRings();
                foreach (var ring in rings)
                {
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Minor, ring, ItemTypeConstants.Ring, ring);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring, ItemTypeConstants.Ring, ring);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring.ToUpper(), ItemTypeConstants.Ring, ring);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Medium, ring.ToLower(), ItemTypeConstants.Ring, ring);
                    yield return new TestCaseData(ItemTypes.Ring.ToString(), PowerConstants.Major, ring, ItemTypeConstants.Ring, ring);
                }

                var rods = RodConstants.GetAllRods();
                foreach (var rod in rods)
                {
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod, ItemTypeConstants.Rod, rod);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod.ToUpper(), ItemTypeConstants.Rod, rod);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Medium, rod.ToLower(), ItemTypeConstants.Rod, rod);
                    yield return new TestCaseData(ItemTypes.Rod.ToString(), PowerConstants.Major, rod, ItemTypeConstants.Rod, rod);
                }

                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Minor, "My Scroll", ItemTypeConstants.Scroll, "My Scroll");
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "My Scroll", ItemTypeConstants.Scroll, "My Scroll");
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "MY SCROLL", ItemTypeConstants.Scroll, "MY SCROLL");
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Medium, "my scroll", ItemTypeConstants.Scroll, "my scroll");
                yield return new TestCaseData(ItemTypes.Scroll.ToString(), PowerConstants.Major, "My Scroll", ItemTypeConstants.Scroll, "My Scroll");

                var staffs = StaffConstants.GetAllStaffs();
                foreach (var staff in staffs)
                {
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff, ItemTypeConstants.Staff, staff);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff.ToUpper(), ItemTypeConstants.Staff, staff);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Medium, staff.ToLower(), ItemTypeConstants.Staff, staff);
                    yield return new TestCaseData(ItemTypes.Staff.ToString(), PowerConstants.Major, staff, ItemTypeConstants.Staff, staff);
                }

                var tools = ToolConstants.GetAllTools();
                foreach (var tool in tools)
                {
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool, ItemTypeConstants.Tool, tool);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool.ToUpper(), ItemTypeConstants.Tool, tool);
                    yield return new TestCaseData(ItemTypes.Tool.ToString(), PowerConstants.Mundane, tool.ToLower(), ItemTypeConstants.Tool, tool);
                }

                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Minor, "My Wand", ItemTypeConstants.Wand, "My Wand");
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "My Wand", ItemTypeConstants.Wand, "My Wand");
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "MY WAND", ItemTypeConstants.Wand, "MY WAND");
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Medium, "my wand", ItemTypeConstants.Wand, "my wand");
                yield return new TestCaseData(ItemTypes.Wand.ToString(), PowerConstants.Major, "My Wand", ItemTypeConstants.Wand, "My Wand");

                var weapons = WeaponConstants.GetAllWeapons(false, false);
                foreach (var weapon in weapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Mundane, weapon, ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon.ToUpper(), ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon.ToLower(), ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, ItemTypeConstants.Weapon, weapon);
                }

                var specificWeapons = WeaponConstants.GetAllSpecific().Except(WeaponConstants.GetAllTemplates());
                foreach (var weapon in specificWeapons)
                {
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Minor, weapon, ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon, ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon.ToUpper(), ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Medium, weapon.ToLower(), ItemTypeConstants.Weapon, weapon);
                    yield return new TestCaseData(ItemTypes.Weapon.ToString(), PowerConstants.Major, weapon, ItemTypeConstants.Weapon, weapon);
                }

                var wondrousItems = WondrousItemConstants.GetAllWondrousItems();
                foreach (var wondrousItem in wondrousItems)
                {
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Minor, wondrousItem,
                        ItemTypeConstants.WondrousItem, wondrousItem);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem,
                        ItemTypeConstants.WondrousItem, wondrousItem);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem.ToUpper(),
                        ItemTypeConstants.WondrousItem, wondrousItem);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Medium, wondrousItem.ToLower(),
                        ItemTypeConstants.WondrousItem, wondrousItem);
                    yield return new TestCaseData(ItemTypes.WondrousItem.ToString(), PowerConstants.Major, wondrousItem,
                        ItemTypeConstants.WondrousItem, wondrousItem);
                }
            }
        }

        [Test]
        public async Task BUG_GenerateItemV1_ReturnsSpecificWeapon_WithQuantity()
        {
            var url = GetUrl("v1", ItemTypes.Weapon.ToString(), PowerConstants.Major, $"?name={HttpUtility.UrlEncode(WeaponConstants.AssassinsDagger)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, ItemTypes.Weapon.ToString(), PowerConstants.Major);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var item = StreamHelper.Read<Item>(response.Body);
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty.And.EqualTo(WeaponConstants.AssassinsDagger));
            Assert.That(item.ItemType, Is.EqualTo(ItemTypeConstants.Weapon));
            Assert.That(item.Quantity, Is.EqualTo(1));
        }

        [TestCaseSource(nameof(RandomItemGenerationData))]
        public async Task GenerateRandomV2_ReturnsTreasure(string itemTypeInput, string power, string itemTypeOutput)
        {
            var url = GetUrl("v2", itemTypeInput, power);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, itemTypeInput, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var item = StreamHelper.Read<Item>(response.Body);
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty);
            Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), item.Name);
            Assert.That(item.Quantity, Is.Positive, item.Name);
        }

        [TestCase(PowerConstants.Mundane)]
        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateRandomArmorV2_ReturnsArmorWithArmorProperties(string power)
        {
            var url = GetUrl("v2", ItemTypes.Armor.ToString(), power);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, ItemTypes.Armor.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var armor = StreamHelper.Read<Armor>(response.Body);
            Assert.That(armor, Is.Not.Null);
            Assert.That(armor.Summary, Is.Not.Empty);
            Assert.That(armor.Name, Is.Not.Empty, armor.Summary);
            Assert.That(armor.ItemType, Is.EqualTo(ItemTypeConstants.Armor), armor.Summary);
            Assert.That(armor.Quantity, Is.Positive, armor.Summary);
            Assert.That(armor.CanBeUsedAsWeaponOrArmor, Is.True, armor.Summary);

            if (string.IsNullOrEmpty(armor.Magic.Curse))
            {
                Assert.That(armor.ArmorBonus, Is.Positive, armor.Summary);
                Assert.That(armor.TotalArmorBonus, Is.Positive, armor.Summary);
            }

            if (!armor.Attributes.Contains(AttributeConstants.Shield))
            {
                Assert.That(armor.MaxDexterityBonus, Is.Not.Negative, armor.Summary);
                Assert.That(armor.TotalMaxDexterityBonus, Is.Not.Negative, armor.Summary);
            }

            Assert.That(armor.ArmorCheckPenalty, Is.Not.Positive, armor.Summary);
            Assert.That(armor.Size, Is.Not.Empty, armor.Summary);
            Assert.That(armor.TotalArmorCheckPenalty, Is.Not.Positive, armor.Summary);
        }

        [TestCase(PowerConstants.Mundane)]
        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateRandomWeaponV2_ReturnsWeaponWithWeaponProperties(string power)
        {
            var url = GetUrl("v2", ItemTypes.Weapon.ToString(), power);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, ItemTypes.Weapon.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var weapon = StreamHelper.Read<Weapon>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            Assert.That(weapon.Name, Is.Not.Empty);
            Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Weapon), weapon.Name);
            Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
            Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
            Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
            Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamageSummary, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.DamageSummary, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.IsDoubleWeapon, Is.True.Or.False, weapon.Name);
            Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
            Assert.That(weapon.ThreatRangeSummary, Is.Not.Empty, weapon.Name);
        }

        [TestCase(PowerConstants.Mundane)]
        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateDoubleWeaponV2_ReturnsWeaponWithWeaponProperties(string power)
        {
            var url = GetUrl("v2", ItemTypes.Weapon.ToString(), power, $"?name={HttpUtility.UrlEncode(WeaponConstants.TwoBladedSword)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, ItemTypes.Weapon.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var weapon = StreamHelper.Read<Weapon>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            Assert.That(weapon.Name, Is.EqualTo(WeaponConstants.TwoBladedSword).Or.EqualTo(WeaponConstants.ShiftersSorrow));
            Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Weapon), weapon.Name);
            Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
            Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
            Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
            Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamageSummary, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.DamageSummary, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.IsDoubleWeapon, Is.True, weapon.Name);
            Assert.That(weapon.SecondaryCriticalDamageSummary, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.SecondaryCriticalDamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.SecondaryCriticalDamages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.SecondaryCriticalMultiplier, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.SecondaryDamageSummary, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.SecondaryDamageRoll, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.SecondaryDamages, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.SecondaryHasAbilities, Is.True.Or.False, weapon.Name);
            Assert.That(weapon.SecondaryMagicBonus, Is.Not.Negative, weapon.Name);
            Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
            Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
            Assert.That(weapon.ThreatRangeSummary, Is.Not.Empty, weapon.Name);
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task GenerateItemV2_ReturnsItem(string itemTypeInput, string power, string name, string itemTypeOutput, string itemNameOutput)
        {
            var url = GetUrl("v2", itemTypeInput, power, $"?name={HttpUtility.UrlEncode(name)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, itemTypeInput, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var item = StreamHelper.Read<Item>(response.Body);
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty);
            Assert.That(item.NameMatches(itemNameOutput), Is.True, item.Name);
            Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), item.Name);
            Assert.That(item.Quantity, Is.Positive, item.Name);
        }

        [Test]
        public async Task BUG_GenerateItemV2_ReturnsSpecificWeapon_WithQuantity()
        {
            var url = GetUrl("v2", ItemTypes.Weapon.ToString(), PowerConstants.Major, $"?name={HttpUtility.UrlEncode(WeaponConstants.AssassinsDagger)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, ItemTypes.Weapon.ToString(), PowerConstants.Major);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var item = StreamHelper.Read<Item>(response.Body);
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty.And.EqualTo(WeaponConstants.AssassinsDagger));
            Assert.That(item.ItemType, Is.EqualTo(ItemTypeConstants.Weapon));
            Assert.That(item.Quantity, Is.EqualTo(1));
        }

        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateItemV2_GeneratesRod_WithWeaponProperties(string power)
        {
            var url = GetUrl("v2", ItemTypes.Rod.ToString(), power, $"?name={HttpUtility.UrlEncode(RodConstants.Flailing)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, ItemTypes.Rod.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var weapon = StreamHelper.Read<Weapon>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(weapon.Name, Is.Not.Empty);
                Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Rod), weapon.Name);
                Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
                Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
                Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
                Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageSummary, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageSummary, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.IsDoubleWeapon, Is.True.Or.False, weapon.Name);
                Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
                Assert.That(weapon.ThreatRangeSummary, Is.Not.Empty, weapon.Name);
            }
        }

        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task BUG_GenerateItemV2_GeneratesStaff_WithWeaponProperties(string power)
        {
            var url = GetUrl("v2", ItemTypes.Staff.ToString(), power, $"?name={HttpUtility.UrlEncode(StaffConstants.Power)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, ItemTypes.Staff.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var weapon = StreamHelper.Read<Weapon>(response.Body);
            Assert.That(weapon, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(weapon.Name, Is.Not.Empty);
                Assert.That(weapon.ItemType, Is.EqualTo(ItemTypeConstants.Staff), weapon.Name);
                Assert.That(weapon.Quantity, Is.Positive, weapon.Name);
                Assert.That(weapon.CanBeUsedAsWeaponOrArmor, Is.True, weapon.Name);
                Assert.That(weapon.Ammunition, Is.Not.Null, weapon.Name);
                Assert.That(weapon.CombatTypes, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageSummary, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalDamages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.CriticalMultiplier, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageSummary, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.DamageRoll, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.Damages, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.IsDoubleWeapon, Is.True.Or.False, weapon.Name);
                Assert.That(weapon.Size, Is.Not.Empty, weapon.Name);
                Assert.That(weapon.ThreatRange, Is.Positive, weapon.Name);
                Assert.That(weapon.ThreatRangeSummary, Is.Not.Empty, weapon.Name);
            }
        }
    }
}