using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Tests.Integration.Helpers;
using DnDGen.TreasureGen.Items;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections;

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

        [Repeat(100)]
        [TestCaseSource(nameof(ItemGenerationData))]
        public async Task GenerateRandom_ReturnsTreasure(string itemType, string power)
        {
            var request = RequestHelper.BuildRequest($"?itemType={itemType}&power={power}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Item>());

            var item = okResult.Value as Item;
            Assert.That(item, Is.Not.Null);
            Assert.That(item.Name, Is.Not.Empty);
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