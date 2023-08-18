using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Tests.Integration.Helpers;
using DnDGen.TreasureGen;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class ValidateRandomTreasureFunctionTests : IntegrationTests
    {
        private ValidateRandomTreasureFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            function = new ValidateRandomTreasureFunction();

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCaseSource(nameof(TreasureValidationData))]
        public async Task ValidateRandom_ReturnsValidity(string treasureType, int level, bool valid)
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, treasureType, level, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));
        }

        public static IEnumerable TreasureValidationData
        {
            get
            {
                yield return new TestCaseData("Coolpoints", 20, false);

                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum - 1, false);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum, true);
                    yield return new TestCaseData(treasureType.ToString(), 2, true);
                    yield return new TestCaseData(treasureType.ToString(), 10, true);
                    yield return new TestCaseData(treasureType.ToString(), 20, true);
                    yield return new TestCaseData(treasureType.ToString().ToUpper(), 20, true);
                    yield return new TestCaseData(treasureType.ToString().ToLower(), 20, true);
                    yield return new TestCaseData(((int)treasureType).ToString(), 20, true);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum, true);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum + 1, false);
                }
            }
        }
    }
}