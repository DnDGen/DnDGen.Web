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
using Microsoft.Extensions.Primitives;
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

            var result = await function.Run(mockRequest.Object, ItemTypes.Tool.ToString(), PowerConstants.Mundane, mockLogger.Object);
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

            var result = await function.Run(mockRequest.Object, ItemTypes.Wand.ToString(), power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(item));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Item (Wand) at power {power}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenItemTypeInvalid()
        {
            var query = new QueryCollection();
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, "wrong item type", PowerConstants.Medium, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: wrong item type; Power: Medium; Name: (None)", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenPowerInvalid()
        {
            var query = new QueryCollection();
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, ItemTypes.Weapon.ToString(), "wrong power", mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: Weapon; Power: wrong power; Name: (None)", LogLevel.Error);
        }

        [TestCase(ItemTypes.AlchemicalItem, PowerConstants.Medium)]
        [TestCase(ItemTypes.Ring, PowerConstants.Mundane)]
        [TestCase(ItemTypes.Rod, PowerConstants.Minor)]
        public async Task Run_ReturnsBadRequest_WhenParameterCombinationInvalid(ItemTypes itemType, string power)
        {
            var query = new QueryCollection();
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, itemType.ToString(), power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters are not a valid combination. Item Type: {itemType}; Power: {power}; Name: (None)", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedItem_WithName_Mundane()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "name", ToolConstants.Spyglass },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var mockItemGenerator = new Mock<MundaneItemGenerator>();
            var item = new Item { Name = ToolConstants.Spyglass };
            mockItemGenerator.Setup(g => g.Generate(ToolConstants.Spyglass)).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MundaneItemGenerator>(ItemTypeConstants.Tool))
                .Returns(mockItemGenerator.Object);

            var result = await function.Run(mockRequest.Object, ItemTypes.Tool.ToString(), PowerConstants.Mundane, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(item));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated Item Spyglass (Tool) at power Mundane");
        }

        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task Run_ReturnsTheGeneratedItem_WithName_Magical(string power)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "name", "My Item" },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var mockItemGenerator = new Mock<MagicalItemGenerator>();
            var item = new Item { Name = "My Item" };
            mockItemGenerator.Setup(g => g.Generate(power, "My Item")).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MagicalItemGenerator>(ItemTypeConstants.Wand))
                .Returns(mockItemGenerator.Object);

            var result = await function.Run(mockRequest.Object, ItemTypes.Wand.ToString(), power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(item));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Item My Item (Wand) at power {power}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WithName_WhenItemTypeInvalid()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "name", WeaponConstants.Longsword },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, "wrong item type", PowerConstants.Medium, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: wrong item type; Power: Medium; Name: Longsword", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WithName_WhenPowerInvalid()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "name", WeaponConstants.Longsword },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, ItemTypes.Weapon.ToString(), "wrong power", mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: Weapon; Power: wrong power; Name: Longsword", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WithName_WhenNameInvalid()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "name", "Wrong Item" },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, ItemTypes.Weapon.ToString(), PowerConstants.Medium, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: Weapon; Power: Medium; Name: Wrong Item", LogLevel.Error);
        }

        [TestCase(ItemTypes.AlchemicalItem, PowerConstants.Mundane, ToolConstants.MagnifyingGlass)]
        [TestCase(ItemTypes.AlchemicalItem, PowerConstants.Medium, AlchemicalItemConstants.Thunderstone)]
        [TestCase(ItemTypes.Ring, PowerConstants.Mundane, RingConstants.Blinking)]
        [TestCase(ItemTypes.Ring, PowerConstants.Medium, PotionConstants.Jump)]
        [TestCase(ItemTypes.Rod, PowerConstants.Minor, RodConstants.Cancellation)]
        [TestCase(ItemTypes.Rod, PowerConstants.Medium, StaffConstants.Divination)]
        public async Task Run_ReturnsBadRequest_WithName_WhenParameterCombinationInvalid(ItemTypes itemType, string power, string name)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "name", name },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, itemType.ToString(), power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters are not a valid combination. Item Type: {itemType}; Power: {power}; Name: {name}", LogLevel.Error);
        }
    }
}