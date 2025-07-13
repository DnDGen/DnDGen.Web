using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.TreasureGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Functions
{
    public class ValidateRandomTreasureFunctionTests
    {
        private ValidateRandomTreasureFunction function;
        private Mock<ILogger<ValidateRandomTreasureFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger<ValidateRandomTreasureFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.TreasureGen.Functions.ValidateRandomTreasureFunction")).Returns(mockLogger.Object);

            function = new ValidateRandomTreasureFunction(mockLoggerFactory.Object);
            requestHelper = new RequestHelper();
        }

        [TestCase("Goodies", LevelLimits.Minimum - 1, false)]
        [TestCase("Goodies", LevelLimits.Minimum, false)]
        [TestCase("Goodies", LevelLimits.Minimum + 1, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Standard / 2, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Standard - 1, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Standard, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Standard + 1, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Epic / 2, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Epic - 1, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Epic, false)]
        [TestCase("Goodies", LevelLimits.Maximum_Epic + 1, false)]
        [TestCase("Treasure", LevelLimits.Minimum - 1, false)]
        [TestCase("Treasure", LevelLimits.Minimum, true)]
        [TestCase("Treasure", LevelLimits.Minimum + 1, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Standard / 2, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Standard - 1, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Standard, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Standard + 1, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Epic / 2, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Epic - 1, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Epic, true)]
        [TestCase("Treasure", LevelLimits.Maximum_Epic + 1, true)]
        [TestCase("Treasures", LevelLimits.Minimum - 1, false)]
        [TestCase("Treasures", LevelLimits.Minimum, false)]
        [TestCase("Treasures", LevelLimits.Minimum + 1, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Standard / 2, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Standard - 1, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Standard, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Standard + 1, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Epic / 2, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Epic - 1, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Epic, false)]
        [TestCase("Treasures", LevelLimits.Maximum_Epic + 1, false)]
        [TestCase("TREASURE", LevelLimits.Minimum - 1, false)]
        [TestCase("TREASURE", LevelLimits.Minimum, true)]
        [TestCase("TREASURE", LevelLimits.Minimum + 1, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Standard / 2, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Standard - 1, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Standard, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Standard + 1, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Epic / 2, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Epic - 1, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Epic, true)]
        [TestCase("TREASURE", LevelLimits.Maximum_Epic + 1, true)]
        [TestCase("treasure", LevelLimits.Minimum - 1, false)]
        [TestCase("treasure", LevelLimits.Minimum, true)]
        [TestCase("treasure", LevelLimits.Minimum + 1, true)]
        [TestCase("treasure", LevelLimits.Maximum_Standard / 2, true)]
        [TestCase("treasure", LevelLimits.Maximum_Standard - 1, true)]
        [TestCase("treasure", LevelLimits.Maximum_Standard, true)]
        [TestCase("treasure", LevelLimits.Maximum_Standard + 1, true)]
        [TestCase("treasure", LevelLimits.Maximum_Epic / 2, true)]
        [TestCase("treasure", LevelLimits.Maximum_Epic - 1, true)]
        [TestCase("treasure", LevelLimits.Maximum_Epic, true)]
        [TestCase("treasure", LevelLimits.Maximum_Epic + 1, true)]
        [TestCase("Coin", LevelLimits.Minimum - 1, false)]
        [TestCase("Coin", LevelLimits.Minimum, true)]
        [TestCase("Coin", LevelLimits.Minimum + 1, true)]
        [TestCase("Coin", LevelLimits.Maximum_Standard / 2, true)]
        [TestCase("Coin", LevelLimits.Maximum_Standard - 1, true)]
        [TestCase("Coin", LevelLimits.Maximum_Standard, true)]
        [TestCase("Coin", LevelLimits.Maximum_Standard + 1, true)]
        [TestCase("Coin", LevelLimits.Maximum_Epic / 2, true)]
        [TestCase("Coin", LevelLimits.Maximum_Epic - 1, true)]
        [TestCase("Coin", LevelLimits.Maximum_Epic, true)]
        [TestCase("Coin", LevelLimits.Maximum_Epic + 1, true)]
        [TestCase("Coins", LevelLimits.Minimum - 1, false)]
        [TestCase("Coins", LevelLimits.Minimum, false)]
        [TestCase("Coins", LevelLimits.Minimum + 1, false)]
        [TestCase("Coins", LevelLimits.Maximum_Standard / 2, false)]
        [TestCase("Coins", LevelLimits.Maximum_Standard - 1, false)]
        [TestCase("Coins", LevelLimits.Maximum_Standard, false)]
        [TestCase("Coins", LevelLimits.Maximum_Standard + 1, false)]
        [TestCase("Coins", LevelLimits.Maximum_Epic / 2, false)]
        [TestCase("Coins", LevelLimits.Maximum_Epic - 1, false)]
        [TestCase("Coins", LevelLimits.Maximum_Epic, false)]
        [TestCase("Coins", LevelLimits.Maximum_Epic + 1, false)]
        [TestCase("COIN", LevelLimits.Minimum - 1, false)]
        [TestCase("COIN", LevelLimits.Minimum, true)]
        [TestCase("COIN", LevelLimits.Minimum + 1, true)]
        [TestCase("COIN", LevelLimits.Maximum_Standard / 2, true)]
        [TestCase("COIN", LevelLimits.Maximum_Standard - 1, true)]
        [TestCase("COIN", LevelLimits.Maximum_Standard, true)]
        [TestCase("COIN", LevelLimits.Maximum_Standard + 1, true)]
        [TestCase("COIN", LevelLimits.Maximum_Epic / 2, true)]
        [TestCase("COIN", LevelLimits.Maximum_Epic - 1, true)]
        [TestCase("COIN", LevelLimits.Maximum_Epic, true)]
        [TestCase("COIN", LevelLimits.Maximum_Epic + 1, true)]
        [TestCase("coin", LevelLimits.Minimum - 1, false)]
        [TestCase("coin", LevelLimits.Minimum, true)]
        [TestCase("coin", LevelLimits.Minimum + 1, true)]
        [TestCase("coin", LevelLimits.Maximum_Standard / 2, true)]
        [TestCase("coin", LevelLimits.Maximum_Standard - 1, true)]
        [TestCase("coin", LevelLimits.Maximum_Standard, true)]
        [TestCase("coin", LevelLimits.Maximum_Standard + 1, true)]
        [TestCase("coin", LevelLimits.Maximum_Epic / 2, true)]
        [TestCase("coin", LevelLimits.Maximum_Epic - 1, true)]
        [TestCase("coin", LevelLimits.Maximum_Epic, true)]
        [TestCase("coin", LevelLimits.Maximum_Epic + 1, true)]
        [TestCase("Goods", LevelLimits.Minimum - 1, false)]
        [TestCase("Goods", LevelLimits.Minimum, true)]
        [TestCase("Goods", LevelLimits.Minimum + 1, true)]
        [TestCase("Goods", LevelLimits.Maximum_Standard / 2, true)]
        [TestCase("Goods", LevelLimits.Maximum_Standard - 1, true)]
        [TestCase("Goods", LevelLimits.Maximum_Standard, true)]
        [TestCase("Goods", LevelLimits.Maximum_Standard + 1, true)]
        [TestCase("Goods", LevelLimits.Maximum_Epic / 2, true)]
        [TestCase("Goods", LevelLimits.Maximum_Epic - 1, true)]
        [TestCase("Goods", LevelLimits.Maximum_Epic, true)]
        [TestCase("Goods", LevelLimits.Maximum_Epic + 1, true)]
        [TestCase("Good", LevelLimits.Minimum - 1, false)]
        [TestCase("Good", LevelLimits.Minimum, false)]
        [TestCase("Good", LevelLimits.Minimum + 1, false)]
        [TestCase("Good", LevelLimits.Maximum / 2, false)]
        [TestCase("Good", LevelLimits.Maximum - 1, false)]
        [TestCase("Good", LevelLimits.Maximum, false)]
        [TestCase("Good", LevelLimits.Maximum + 1, false)]
        [TestCase("GOODS", LevelLimits.Minimum - 1, false)]
        [TestCase("GOODS", LevelLimits.Minimum, true)]
        [TestCase("GOODS", LevelLimits.Minimum + 1, true)]
        [TestCase("GOODS", LevelLimits.Maximum / 2, true)]
        [TestCase("GOODS", LevelLimits.Maximum - 1, true)]
        [TestCase("GOODS", LevelLimits.Maximum, true)]
        [TestCase("GOODS", LevelLimits.Maximum + 1, true)]
        [TestCase("goods", LevelLimits.Minimum - 1, false)]
        [TestCase("goods", LevelLimits.Minimum, true)]
        [TestCase("goods", LevelLimits.Minimum + 1, true)]
        [TestCase("goods", LevelLimits.Maximum / 2, true)]
        [TestCase("goods", LevelLimits.Maximum - 1, true)]
        [TestCase("goods", LevelLimits.Maximum, true)]
        [TestCase("goods", LevelLimits.Maximum + 1, true)]
        [TestCase("Items", LevelLimits.Minimum - 1, false)]
        [TestCase("Items", LevelLimits.Minimum, true)]
        [TestCase("Items", LevelLimits.Minimum + 1, true)]
        [TestCase("Items", LevelLimits.Maximum / 2, true)]
        [TestCase("Items", LevelLimits.Maximum - 1, true)]
        [TestCase("Items", LevelLimits.Maximum, true)]
        [TestCase("Items", LevelLimits.Maximum + 1, true)]
        [TestCase("Item", LevelLimits.Minimum - 1, false)]
        [TestCase("Item", LevelLimits.Minimum, false)]
        [TestCase("Item", LevelLimits.Minimum + 1, false)]
        [TestCase("Item", LevelLimits.Maximum / 2, false)]
        [TestCase("Item", LevelLimits.Maximum - 1, false)]
        [TestCase("Item", LevelLimits.Maximum, false)]
        [TestCase("Item", LevelLimits.Maximum + 1, false)]
        [TestCase("ITEMS", LevelLimits.Minimum - 1, false)]
        [TestCase("ITEMS", LevelLimits.Minimum, true)]
        [TestCase("ITEMS", LevelLimits.Minimum + 1, true)]
        [TestCase("ITEMS", LevelLimits.Maximum / 2, true)]
        [TestCase("ITEMS", LevelLimits.Maximum - 1, true)]
        [TestCase("ITEMS", LevelLimits.Maximum, true)]
        [TestCase("ITEMS", LevelLimits.Maximum + 1, true)]
        [TestCase("items", LevelLimits.Minimum - 1, false)]
        [TestCase("items", LevelLimits.Minimum, true)]
        [TestCase("items", LevelLimits.Minimum + 1, true)]
        [TestCase("items", LevelLimits.Maximum / 2, true)]
        [TestCase("items", LevelLimits.Maximum - 1, true)]
        [TestCase("items", LevelLimits.Maximum, true)]
        [TestCase("items", LevelLimits.Maximum + 1, true)]
        [TestCase("0", LevelLimits.Minimum - 1, false)]
        [TestCase("0", LevelLimits.Minimum, true)]
        [TestCase("0", LevelLimits.Minimum + 1, true)]
        [TestCase("0", LevelLimits.Maximum / 2, true)]
        [TestCase("0", LevelLimits.Maximum - 1, true)]
        [TestCase("0", LevelLimits.Maximum, true)]
        [TestCase("0", LevelLimits.Maximum + 1, true)]
        [TestCase("1", LevelLimits.Minimum - 1, false)]
        [TestCase("1", LevelLimits.Minimum, true)]
        [TestCase("1", LevelLimits.Minimum + 1, true)]
        [TestCase("1", LevelLimits.Maximum / 2, true)]
        [TestCase("1", LevelLimits.Maximum - 1, true)]
        [TestCase("1", LevelLimits.Maximum, true)]
        [TestCase("1", LevelLimits.Maximum + 1, true)]
        [TestCase("2", LevelLimits.Minimum - 1, false)]
        [TestCase("2", LevelLimits.Minimum, true)]
        [TestCase("2", LevelLimits.Minimum + 1, true)]
        [TestCase("2", LevelLimits.Maximum / 2, true)]
        [TestCase("2", LevelLimits.Maximum - 1, true)]
        [TestCase("2", LevelLimits.Maximum, true)]
        [TestCase("2", LevelLimits.Maximum + 1, true)]
        [TestCase("3", LevelLimits.Minimum - 1, false)]
        [TestCase("3", LevelLimits.Minimum, true)]
        [TestCase("3", LevelLimits.Minimum + 1, true)]
        [TestCase("3", LevelLimits.Maximum / 2, true)]
        [TestCase("3", LevelLimits.Maximum - 1, true)]
        [TestCase("3", LevelLimits.Maximum, true)]
        [TestCase("3", LevelLimits.Maximum + 1, true)]
        public async Task Run_ReturnsValidity(string treasureType, int level, bool valid)
        {
            var request = requestHelper.BuildRequest();

            var response = await function.Run(request, treasureType, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Validated Treasure ({treasureType}) at level {level} = {valid}");
        }
    }
}