using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Tests.Integration.Helpers;
using DnDGen.TreasureGen.Items;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class ValidateRandomItemFunctionTests : IntegrationTests
    {
        private ValidateRandomItemFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            function = new ValidateRandomItemFunction();

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task ValidateRandomItem_ReturnsValidity(string itemType, string power, bool valid)
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, itemType, power, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));
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
    }
}