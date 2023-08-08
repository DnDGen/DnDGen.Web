using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Tests.Integration.Helpers;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Web;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    //HACK: Since the E2E tests don't currently work in the build pipeline, this is a facsimile of those tests
    public class GenerateRandomItemFunctionTests : IntegrationTests
    {
        private GenerateRandomItemFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateRandomItemFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCaseSource(nameof(RandomItemGenerationData))]
        public async Task GenerateRandom_ReturnsTreasure(string itemTypeInput, string power, string itemTypeOutput)
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, itemTypeInput, power, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Item>());

            var item = okResult.Value as Item;
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty);
            Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), item.Name);
            Assert.That(item.Quantity, Is.Positive, item.Name);
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
            var request = RequestHelper.BuildRequest($"?name={HttpUtility.UrlEncode(name)}");
            var response = await function.Run(request, itemTypeInput, power, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Item>());

            var item = okResult.Value as Item;
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty);
            Assert.That(item.BaseNames.Union(new[] { item.Name }), Contains.Item(name));
            Assert.That(item.ItemType, Is.EqualTo(itemTypeOutput), item.Name);
            Assert.That(item.Quantity, Is.Positive, item.Name);
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

        [Test]
        public async Task BUG_GenerateItem_ReturnsSpecificItem_WithQuantity()
        {
            var request = RequestHelper.BuildRequest($"?name={HttpUtility.UrlEncode(WeaponConstants.AssassinsDagger)}");
            var response = await function.Run(request, ItemTypes.Weapon.ToString(), PowerConstants.Major, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Item>());

            var item = okResult.Value as Item;
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty.And.EqualTo(WeaponConstants.AssassinsDagger));
            Assert.That(item.ItemType, Is.EqualTo(ItemTypeConstants.Weapon));
            Assert.That(item.Quantity, Is.EqualTo(1));
        }
    }
}