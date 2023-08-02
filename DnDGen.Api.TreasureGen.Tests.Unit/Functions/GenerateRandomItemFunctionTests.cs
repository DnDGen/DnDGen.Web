using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Infrastructure.Generators;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
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
            var query = new QueryCollection();
            mockRequest.Setup(x => x.Query).Returns(query);

            var mockItemGenerator = new Mock<MundaneItemGenerator>();
            var item = new Item { Name = "my item" };
            mockItemGenerator.Setup(g => g.GenerateRandom()).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MundaneItemGenerator>(ItemTypeConstants.Tool))
                .Returns(mockItemGenerator.Object);

            var result = await function.Run(mockRequest.Object, ItemTypeConstants.Tool, PowerConstants.Mundane, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(item));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated Item (Tool) at power Mundane");
        }

        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task Run_ReturnsTheGeneratedItem_Magical(string power)
        {
            var query = new QueryCollection();
            mockRequest.Setup(x => x.Query).Returns(query);

            var mockItemGenerator = new Mock<MagicalItemGenerator>();
            var item = new Item { Name = "my item" };
            mockItemGenerator.Setup(g => g.GenerateRandom(power)).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MagicalItemGenerator>(ItemTypeConstants.Wand))
                .Returns(mockItemGenerator.Object);

            var result = await function.Run(mockRequest.Object, ItemTypeConstants.Wand, power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(item));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Item (Wand) at power {power}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenItemTypeInvalid()
        {
            var result = await function.Run(mockRequest.Object, "wrong item type", PowerConstants.Medium, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameter 'itemType' of 'wrong item type' is not a valid Item Type. Should be one of: AlchemicalItem, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, WondrousItem", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenPowerInvalid()
        {
            var result = await function.Run(mockRequest.Object, ItemTypeConstants.Weapon, "wrong power", mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters 'itemType' of 'Weapon' and power 'wrong power' is not a valid combination", LogLevel.Error);
        }

        [TestCase(ItemTypes.AlchemicalItem, PowerConstants.Medium)]
        [TestCase(ItemTypes.Ring, PowerConstants.Mundane)]
        [TestCase(ItemTypes.Rod, PowerConstants.Minor)]
        public async Task Run_ReturnsBadRequest_WhenParameterCombinationInvalid(ItemTypes itemType, string power)
        {
            var result = await function.Run(mockRequest.Object, itemType.ToString(), power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters 'itemType' of '{itemType}' and power '{power}' is not a valid combination", LogLevel.Error);
        }
    }
}