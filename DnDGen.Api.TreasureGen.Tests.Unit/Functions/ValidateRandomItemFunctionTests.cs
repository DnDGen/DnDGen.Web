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
    public class ValidateRandomItemFunctionTests
    {
        private ValidateRandomItemFunction function;
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

            function = new ValidateRandomItemFunction(mockDependencyFactory.Object);
        }

        [TestCase("bad item type", PowerConstants.Mundane, false)]
        [TestCase("bad item type", PowerConstants.Medium, false)]
        [TestCase(ItemTypeConstants.AlchemicalItem, PowerConstants.Mundane, true)]
        [TestCase(ItemTypeConstants.AlchemicalItem, PowerConstants.Medium, false)]
        [TestCase(ItemTypeConstants.AlchemicalItem, "bad power", false)]
        [TestCase(ItemTypeConstants.Weapon, PowerConstants.Mundane, true)]
        [TestCase(ItemTypeConstants.Weapon, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.Weapon, "bad power", false)]
        [TestCase(ItemTypeConstants.WondrousItem, PowerConstants.Mundane, false)]
        [TestCase(ItemTypeConstants.WondrousItem, PowerConstants.Medium, true)]
        [TestCase(ItemTypeConstants.WondrousItem, "bad power", false)]
        public async Task Run_ReturnsTheParameterValidity(string itemType, string power, bool valid)
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

            var result = await function.Run(mockRequest.Object, itemType, power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated random Treasure (Treasure) at level 42");
        }
    }
}