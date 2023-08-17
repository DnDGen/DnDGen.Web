using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Tests.Integration.Helpers;
using DnDGen.TreasureGen;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class GenerateRandomTreasureFunctionTests : IntegrationTests
    {
        private GenerateRandomTreasureFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateRandomTreasureFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCaseSource(nameof(TreasureGenerationData))]
        public async Task GenerateRandom_ReturnsTreasure(string treasureType, int level)
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, treasureType, level, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Treasure>());

            var treasure = okResult.Value as Treasure;
            Assert.That(treasure, Is.Not.Null);
            //HACK: Generating treasure does not guarantee you would get treasure, so IsAny can be True or False
            Assert.That(treasure.IsAny, Is.True.Or.False);

            foreach (var item in treasure.Items)
            {
                Assert.That(item, Is.Not.Null);
                Assert.That(item.Name, Is.Not.Empty);
                Assert.That(item.ItemType, Is.Not.Empty, item.Name);
                Assert.That(item.Quantity, Is.Positive, item.Name);
            }
        }

        public static IEnumerable TreasureGenerationData
        {
            get
            {
                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum);
                    yield return new TestCaseData(treasureType.ToString(), 2);
                    yield return new TestCaseData(treasureType.ToString(), 10);
                    yield return new TestCaseData(treasureType.ToString(), 20);
                    yield return new TestCaseData(treasureType.ToString().ToUpper(), 20);
                    yield return new TestCaseData(treasureType.ToString().ToLower(), 20);
                    yield return new TestCaseData(((int)treasureType).ToString(), 20);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum);
                }
            }
        }
    }
}