using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
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
    public class GenerateTreasureFunctionTests
    {
        private GenerateTreasureFunction function;
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

            function = new GenerateTreasureFunction(mockDependencyFactory.Object);
        }

        [TestCase("Treasure")]
        [TestCase("treasure")]
        public async Task Run_ReturnsTheGeneratedTreasure_Treasure(string treasureType)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(treasureType) },
                { "level", new StringValues("9266") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var treasure = new Treasure();
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(9266))
                .ReturnsAsync(treasure);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(treasure));

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
            mockLogger.AssertLog("Rolled 9266d90210 = 42");
        }

        [TestCase("Coin")]
        [TestCase("coin")]
        public async Task Run_ReturnsTheGeneratedTreasure_Coin(string treasureType)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(treasureType) },
                { "level", new StringValues("9266") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var treasure = new Treasure();
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(9266))
                .ReturnsAsync(treasure);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(treasure));

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
            mockLogger.AssertLog("Rolled 9266d90210 = 42");
        }

        [TestCase("Goods")]
        [TestCase("goods")]
        public async Task Run_ReturnsTheGeneratedTreasure_Goods(string treasureType)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(treasureType) },
                { "level", new StringValues("9266") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var treasure = new Treasure();
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(9266))
                .ReturnsAsync(treasure);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(treasure));

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
            mockLogger.AssertLog("Rolled 9266d90210 = 42");
        }

        [TestCase("Items")]
        [TestCase("items")]
        public async Task Run_ReturnsTheGeneratedTreasure_Items(string treasureType)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(treasureType) },
                { "level", new StringValues("9266") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var treasure = new Treasure();
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(9266))
                .ReturnsAsync(treasure);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(treasure));

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
            mockLogger.AssertLog("Rolled 9266d90210 = 42");
        }

        [TestCase("treasureType")]
        [TestCase("level")]
        public async Task Run_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var values = new Dictionary<string, StringValues>
            {
                { "treasureType", new StringValues(TreasureTypes.Treasure.ToString()) },
                { "level", new StringValues("9266") },
            };
            values.Remove(missing);

            var query = new QueryCollection(values);
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
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
                { "level", new StringValues("9266") },
            };

            var query = new QueryCollection(values);
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter 'coolpoints' is missing", LogLevel.Error);
        }
    }
}