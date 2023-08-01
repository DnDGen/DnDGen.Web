using DnDGen.Api.TreasureGen.Functions;
using DnDGen.TreasureGen;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Functions
{
    public class ValidateRandomTreasureFunctionTests
    {
        private ValidateRandomTreasureFunction function;
        private Mock<ILogger> mockLogger;
        private Mock<HttpRequest> mockRequest;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger>();
            mockRequest = new Mock<HttpRequest>();

            function = new ValidateRandomTreasureFunction();
        }

        [TestCase("Goodies", LevelLimits.Minimum - 1, false)]
        [TestCase("Goodies", LevelLimits.Minimum, false)]
        [TestCase("Goodies", LevelLimits.Minimum + 1, false)]
        [TestCase("Goodies", LevelLimits.Maximum / 2, false)]
        [TestCase("Goodies", LevelLimits.Maximum - 1, false)]
        [TestCase("Goodies", LevelLimits.Maximum, false)]
        [TestCase("Goodies", LevelLimits.Maximum + 1, false)]
        [TestCase("Treasure", LevelLimits.Minimum - 1, false)]
        [TestCase("Treasure", LevelLimits.Minimum, true)]
        [TestCase("Treasure", LevelLimits.Minimum + 1, true)]
        [TestCase("Treasure", LevelLimits.Maximum / 2, true)]
        [TestCase("Treasure", LevelLimits.Maximum - 1, true)]
        [TestCase("Treasure", LevelLimits.Maximum, true)]
        [TestCase("Treasure", LevelLimits.Maximum + 1, false)]
        [TestCase("Coin", LevelLimits.Minimum - 1, false)]
        [TestCase("Coin", LevelLimits.Minimum, true)]
        [TestCase("Coin", LevelLimits.Minimum + 1, true)]
        [TestCase("Coin", LevelLimits.Maximum / 2, true)]
        [TestCase("Coin", LevelLimits.Maximum - 1, true)]
        [TestCase("Coin", LevelLimits.Maximum, true)]
        [TestCase("Coin", LevelLimits.Maximum + 1, false)]
        [TestCase("Goods", LevelLimits.Minimum - 1, false)]
        [TestCase("Goods", LevelLimits.Minimum, true)]
        [TestCase("Goods", LevelLimits.Minimum + 1, true)]
        [TestCase("Goods", LevelLimits.Maximum / 2, true)]
        [TestCase("Goods", LevelLimits.Maximum - 1, true)]
        [TestCase("Goods", LevelLimits.Maximum, true)]
        [TestCase("Goods", LevelLimits.Maximum + 1, false)]
        [TestCase("Items", LevelLimits.Minimum - 1, false)]
        [TestCase("Items", LevelLimits.Minimum, true)]
        [TestCase("Items", LevelLimits.Minimum + 1, true)]
        [TestCase("Items", LevelLimits.Maximum / 2, true)]
        [TestCase("Items", LevelLimits.Maximum - 1, true)]
        [TestCase("Items", LevelLimits.Maximum, true)]
        [TestCase("Items", LevelLimits.Maximum + 1, false)]
        [TestCase("0", LevelLimits.Minimum - 1, false)]
        [TestCase("0", LevelLimits.Minimum, true)]
        [TestCase("0", LevelLimits.Minimum + 1, true)]
        [TestCase("0", LevelLimits.Maximum / 2, true)]
        [TestCase("0", LevelLimits.Maximum - 1, true)]
        [TestCase("0", LevelLimits.Maximum, true)]
        [TestCase("0", LevelLimits.Maximum + 1, false)]
        [TestCase("1", LevelLimits.Minimum - 1, false)]
        [TestCase("1", LevelLimits.Minimum, true)]
        [TestCase("1", LevelLimits.Minimum + 1, true)]
        [TestCase("1", LevelLimits.Maximum / 2, true)]
        [TestCase("1", LevelLimits.Maximum - 1, true)]
        [TestCase("1", LevelLimits.Maximum, true)]
        [TestCase("1", LevelLimits.Maximum + 1, false)]
        [TestCase("2", LevelLimits.Minimum - 1, false)]
        [TestCase("2", LevelLimits.Minimum, true)]
        [TestCase("2", LevelLimits.Minimum + 1, true)]
        [TestCase("2", LevelLimits.Maximum / 2, true)]
        [TestCase("2", LevelLimits.Maximum - 1, true)]
        [TestCase("2", LevelLimits.Maximum, true)]
        [TestCase("2", LevelLimits.Maximum + 1, false)]
        [TestCase("3", LevelLimits.Minimum - 1, false)]
        [TestCase("3", LevelLimits.Minimum, true)]
        [TestCase("3", LevelLimits.Minimum + 1, true)]
        [TestCase("3", LevelLimits.Maximum / 2, true)]
        [TestCase("3", LevelLimits.Maximum - 1, true)]
        [TestCase("3", LevelLimits.Maximum, true)]
        [TestCase("3", LevelLimits.Maximum + 1, false)]
        public async Task Run_ReturnsValidity(string treasureType, int level, bool valid)
        {
            var result = await function.Run(mockRequest.Object, treasureType, level, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Validated Treasure ({treasureType}) at level {level} = {valid}");
        }
    }
}