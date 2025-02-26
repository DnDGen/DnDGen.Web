using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Infrastructure.Generators;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Specialized;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Functions
{
    public class GenerateRandomItemFunctionTests
    {
        private GenerateRandomItemFunction function;
        private Mock<JustInTimeFactory> mockJustInTimeFactory;
        private Mock<ILogger<GenerateRandomItemFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockJustInTimeFactory = new Mock<JustInTimeFactory>();
            mockLogger = new Mock<ILogger<GenerateRandomItemFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.TreasureGen.Functions.GenerateRandomItemFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<JustInTimeFactory>()).Returns(mockJustInTimeFactory.Object);

            function = new GenerateRandomItemFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedItem_Mundane()
        {
            var mockItemGenerator = new Mock<MundaneItemGenerator>();
            var item = new Item { Name = "my item" };
            mockItemGenerator.Setup(g => g.GenerateRandom()).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MundaneItemGenerator>(ItemTypeConstants.Tool))
                .Returns(mockItemGenerator.Object);

            var request = requestHelper.BuildRequest();

            var response = await function.Run(request, ItemTypes.Tool.ToString(), PowerConstants.Mundane);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseItem = StreamHelper.Read<Item>(response.Body);
            Assert.That(responseItem.Summary, Is.EqualTo(item.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated Item (Tool) at power Mundane");
        }

        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task Run_ReturnsTheGeneratedItem_Magical(string power)
        {
            var query = new NameValueCollection();

            var mockItemGenerator = new Mock<MagicalItemGenerator>();
            var item = new Item { Name = "my item" };
            mockItemGenerator.Setup(g => g.GenerateRandom(power)).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MagicalItemGenerator>(ItemTypeConstants.Wand))
                .Returns(mockItemGenerator.Object);

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, ItemTypes.Wand.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseItem = StreamHelper.Read<Item>(response.Body);
            Assert.That(responseItem.Summary, Is.EqualTo(item.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Item (Wand) at power {power}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenItemTypeInvalid()
        {
            var query = new NameValueCollection();

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, "wrong item type", PowerConstants.Medium);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: wrong item type; Power: Medium; Name: (None)", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenPowerInvalid()
        {
            var query = new NameValueCollection();

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, ItemTypes.Weapon.ToString(), "wrong power");
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: Weapon; Power: wrong power; Name: (None)", LogLevel.Error);
        }

        [TestCase(ItemTypes.AlchemicalItem, PowerConstants.Medium)]
        [TestCase(ItemTypes.Ring, PowerConstants.Mundane)]
        [TestCase(ItemTypes.Rod, PowerConstants.Minor)]
        public async Task Run_ReturnsBadRequest_WhenParameterCombinationInvalid(ItemTypes itemType, string power)
        {
            var query = new NameValueCollection();

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, itemType.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters are not a valid combination. Item Type: {itemType}; Power: {power}; Name: (None)", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedItem_WithName_Mundane()
        {
            var query = new NameValueCollection
            {
                { "name", ToolConstants.Spyglass },
            };

            var mockItemGenerator = new Mock<MundaneItemGenerator>();
            var item = new Item { Name = ToolConstants.Spyglass };
            mockItemGenerator.Setup(g => g.Generate(ToolConstants.Spyglass)).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MundaneItemGenerator>(ItemTypeConstants.Tool))
                .Returns(mockItemGenerator.Object);

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, ItemTypes.Tool.ToString(), PowerConstants.Mundane);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseItem = StreamHelper.Read<Item>(response.Body);
            Assert.That(responseItem.Summary, Is.EqualTo(item.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated Item Spyglass (Tool) at power Mundane");
        }

        [TestCase(PowerConstants.Minor)]
        [TestCase(PowerConstants.Medium)]
        [TestCase(PowerConstants.Major)]
        public async Task Run_ReturnsTheGeneratedItem_WithName_Magical(string power)
        {
            var query = new NameValueCollection
            {
                { "name", "My Item" },
            };

            var mockItemGenerator = new Mock<MagicalItemGenerator>();
            var item = new Item { Name = "My Item" };
            mockItemGenerator.Setup(g => g.Generate(power, "My Item")).Returns(item);

            mockJustInTimeFactory
                .Setup(f => f.Build<MagicalItemGenerator>(ItemTypeConstants.Wand))
                .Returns(mockItemGenerator.Object);

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, ItemTypes.Wand.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseItem = StreamHelper.Read<Item>(response.Body);
            Assert.That(responseItem.Summary, Is.EqualTo(item.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Item My Item (Wand) at power {power}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WithName_WhenItemTypeInvalid()
        {
            var query = new NameValueCollection
            {
                { "name", WeaponConstants.Longsword },
            };

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, "wrong item type", PowerConstants.Medium);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: wrong item type; Power: Medium; Name: Longsword", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WithName_WhenPowerInvalid()
        {
            var query = new NameValueCollection
            {
                { "name", WeaponConstants.Longsword },
            };

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, ItemTypes.Weapon.ToString(), "wrong power");
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Item Type: Weapon; Power: wrong power; Name: Longsword", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WithName_WhenNameInvalid()
        {
            var query = new NameValueCollection
            {
                { "name", "Wrong Item" },
            };

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, ItemTypes.Weapon.ToString(), PowerConstants.Medium);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

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
            var query = new NameValueCollection
            {
                { "name", name },
            };

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, itemType.ToString(), power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Parameters are not a valid combination. Item Type: {itemType}; Power: {power}; Name: {name}", LogLevel.Error);
        }
    }
}