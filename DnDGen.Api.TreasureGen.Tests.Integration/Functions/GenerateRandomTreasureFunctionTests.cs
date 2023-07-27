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
    //HACK: Since the E2E tests don't currently work in the build pipeline, this is a facsimile of those tests
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

        [Repeat(100)]
        [TestCaseSource(nameof(TreasureGenerationData))]
        public async Task GenerateRandom_ReturnsTreasure(string treasureType, int level)
        {
            var request = RequestHelper.BuildRequest($"?treasureType={treasureType}&level={level}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Treasure>());

            var treasure = okResult.Value as Treasure;
            Assert.That(treasure, Is.Not.Null);
            Assert.That(treasure.IsAny, Is.True);
        }

        public static IEnumerable TreasureGenerationData
        {
            get
            {
                yield return new TestCaseData(TreasureTypes.Treasure.ToString(), 20);

                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData(treasureType.ToString().ToLower(), 20);
                    yield return new TestCaseData(treasureType.ToString().ToUpper(), 20);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum);
                    yield return new TestCaseData(treasureType.ToString(), 2);
                    yield return new TestCaseData(treasureType.ToString(), 10);
                    yield return new TestCaseData(treasureType.ToString(), 20);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum);
                }
            }
        }
    }
}