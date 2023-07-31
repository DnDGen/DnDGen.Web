using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
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
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateRandomItemFunction(dependencyFactory);

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