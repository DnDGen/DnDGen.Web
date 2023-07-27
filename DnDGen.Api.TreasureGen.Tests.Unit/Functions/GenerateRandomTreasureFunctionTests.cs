using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using DnDGen.TreasureGen.Coins;
using DnDGen.TreasureGen.Generators;
using DnDGen.TreasureGen.Goods;
using DnDGen.TreasureGen.Items;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Functions
{
    public class GenerateRandomTreasureFunctionTests
    {
        private GenerateRandomTreasureFunction function;
        private Mock<ITreasureGenerator> mockTreasureGenerator;
        private Mock<ICoinGenerator> mockCoinGenerator;
        private Mock<IGoodsGenerator> mockGoodsGenerator;
        private Mock<IItemsGenerator> mockItemsGenerator;
        private Mock<ILogger> mockLogger;
        private Mock<HttpRequest> mockRequest;

        [SetUp]
        public void Setup()
        {
            mockTreasureGenerator = new Mock<ITreasureGenerator>();
            mockCoinGenerator = new Mock<ICoinGenerator>();
            mockGoodsGenerator = new Mock<IGoodsGenerator>();
            mockItemsGenerator = new Mock<IItemsGenerator>();
            mockLogger = new Mock<ILogger>();
            mockRequest = new Mock<HttpRequest>();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ITreasureGenerator>()).Returns(mockTreasureGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<ICoinGenerator>()).Returns(mockCoinGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<IGoodsGenerator>()).Returns(mockGoodsGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<IItemsGenerator>()).Returns(mockItemsGenerator.Object);

            function = new GenerateRandomTreasureFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedTreasure_Treasure()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues("Treasure") },
                { "level", new StringValues("42") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var treasure = new Treasure();
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(treasure);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(treasure));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated random Treasure (Treasure) at level 42");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedTreasure_Coin()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues("Coin") },
                { "level", new StringValues("42") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var coin = new Coin();
            mockCoinGenerator
                .Setup(g => g.GenerateAtLevel(42))
                .Returns(coin);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Treasure>());

            var treasure = okResult.Value as Treasure;
            Assert.That(treasure.Coin, Is.EqualTo(coin));
            Assert.That(treasure.Goods, Is.Empty);
            Assert.That(treasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated random Treasure (Coin) at level 42");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedTreasure_Goods()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues("Goods") },
                { "level", new StringValues("42") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var goods = new List<Good> { new Good(), new Good() };
            mockGoodsGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(goods);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Treasure>());

            var treasure = okResult.Value as Treasure;
            Assert.That(treasure.Coin.Quantity, Is.Zero);
            Assert.That(treasure.Goods, Is.EqualTo(goods));
            Assert.That(treasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated random Treasure (Goods) at level 42");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedTreasure_Items()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues("Items") },
                { "level", new StringValues("42") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var items = new List<Item> { new Item(), new Item() };
            mockItemsGenerator
                .Setup(g => g.GenerateRandomAtLevelAsync(42))
                .ReturnsAsync(items);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Treasure>());

            var treasure = okResult.Value as Treasure;
            Assert.That(treasure.Coin.Quantity, Is.Zero);
            Assert.That(treasure.Goods, Is.Empty);
            Assert.That(treasure.Items, Is.EqualTo(items));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated random Treasure (Items) at level 42");
        }

        [TestCase("treasureType")]
        [TestCase("level")]
        public async Task Run_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var values = new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(TreasureTypes.Treasure.ToString()) },
                { "level", new StringValues("42") },
            };
            values.Remove(missing);

            var query = new QueryCollection(values);
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }

        [TestCase("coolpoints")]
        [TestCase("coins")]
        [TestCase("Coins")]
        [TestCase("good")]
        [TestCase("Good")]
        [TestCase("item")]
        [TestCase("Item")]
        public async Task Run_ReturnsBadRequest_WhenTreasureTypeInvalid(string invalid)
        {
            var values = new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(invalid) },
                { "level", new StringValues("42") },
            };

            var query = new QueryCollection(values);
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter 'treasureType' of '{invalid}' is not a valid Treasure Type. Should be one of: Treasure, Coin, Goods, Items", LogLevel.Error);
        }

        [TestCase(LevelLimits.Minimum - 2)]
        [TestCase(LevelLimits.Minimum - 1)]
        [TestCase(LevelLimits.Maximum + 1)]
        [TestCase(LevelLimits.Maximum + 2)]
        public async Task Run_ReturnsBadRequest_WhenLevelNotValid_OutOfRange(int level)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(TreasureTypes.Treasure.ToString()) },
                { "level", new StringValues(level.ToString()) },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter 'level' of '{level}' is not a valid level. Should be 1 <= L <= 100", LogLevel.Error);
        }

        [TestCase("one")]
        [TestCase("2!")]
        [TestCase("invalid")]
        public async Task Run_ReturnsBadRequest_WhenLevelNotValid_NotNumber(string level)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(TreasureTypes.Treasure.ToString()) },
                { "level", new StringValues(level) },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter 'level' of '{level}' is not a valid level. Should be 1 <= L <= 100", LogLevel.Error);
        }
    }
}