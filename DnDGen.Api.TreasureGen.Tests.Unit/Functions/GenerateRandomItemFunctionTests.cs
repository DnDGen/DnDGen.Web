using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Infrastructure.Generators;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Functions
{
    public class GenerateRandomItemFunctionTests
    {
        private GenerateRandomItemFunction function;
        private Mock<JustInTimeFactory> mockJustInTimeFactory;
        private Mock<ILogger> mockLogger;
        private Mock<HttpRequest> mockRequest;

        [SetUp]
        public void Setup()
        {
            mockJustInTimeFactory = new Mock<JustInTimeFactory>();
            mockLogger = new Mock<ILogger>();
            mockRequest = new Mock<HttpRequest>();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<JustInTimeFactory>()).Returns(mockJustInTimeFactory.Object);

            function = new GenerateRandomItemFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedItem_Mundane()
        {
            var mockItemGenerator = new Mock<MundaneItemGenerator>();
            var item = new Item { Name = "my item" };
            mockItemGenerator.Setup(g => g.GenerateRandom()).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MundaneItemGenerator>("my item type"))
                .Returns(mockItemGenerator.Object);

            var result = await function.Run(mockRequest.Object, "my item type", PowerConstants.Mundane, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(item));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated random Item (my item type) at power Mundane");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedItem_Magical()
        {
            var mockItemGenerator = new Mock<MagicalItemGenerator>();
            var item = new Item { Name = "my item" };
            mockItemGenerator.Setup(g => g.GenerateRandom("my power")).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MagicalItemGenerator>("my item type"))
                .Returns(mockItemGenerator.Object);

            var result = await function.Run(mockRequest.Object, "my item type", "my power", mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(item));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated random Item (my item type) at power Mundane");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenItemTypeInvalid()
        {
            var result = await function.Run(mockRequest.Object, "wrong item type", "my power", mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter 'treasureType' of 'wrong item type' is not a valid Treasure Type. Should be one of: Treasure, Coin, Goods, Items", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenPowerInvalid()
        {
            var result = await function.Run(mockRequest.Object, ItemTypeConstants.Weapon, "wrong power", mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter 'power' of 'wrong power' is not a valid level. Should be 1 <= L <= 100", LogLevel.Error);
        }
    }
}