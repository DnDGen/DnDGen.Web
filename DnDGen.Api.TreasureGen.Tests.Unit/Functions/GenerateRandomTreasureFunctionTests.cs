using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using DnDGen.TreasureGen.Coins;
using DnDGen.TreasureGen.Generators;
using DnDGen.TreasureGen.Goods;
using DnDGen.TreasureGen.Items;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Functions
{
    public class GenerateRandomTreasureFunctionTests
    {
        private GenerateRandomTreasureFunction function;
        private Mock<ITreasureGenerator> mockTreasureGenerator;
        private Mock<ICoinGenerator> mockCoinGenerator;
        private Mock<IGoodsGenerator> mockGoodsGenerator;
        private Mock<IItemsGenerator> mockItemsGenerator;
        private Mock<ILogger<GenerateRandomTreasureFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockTreasureGenerator = new Mock<ITreasureGenerator>();
            mockCoinGenerator = new Mock<ICoinGenerator>();
            mockGoodsGenerator = new Mock<IGoodsGenerator>();
            mockItemsGenerator = new Mock<IItemsGenerator>();
            mockLogger = new Mock<ILogger<GenerateRandomTreasureFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.TreasureGen.Functions.GenerateRandomTreasureFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ITreasureGenerator>()).Returns(mockTreasureGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<ICoinGenerator>()).Returns(mockCoinGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<IGoodsGenerator>()).Returns(mockGoodsGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<IItemsGenerator>()).Returns(mockItemsGenerator.Object);

            function = new GenerateRandomTreasureFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Treasure()
        {
            var treasure = new Treasure
            {
                Coin = new Coin { Currency = "munny", Quantity = 9266 },
                Goods = [new() { Description = "my good" }, new() { Description = "my other good" }],
                Items = [new() { Name = "my item" }, new() { Name = "my other item" }],
            };
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(treasure);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, TreasureTypes.Treasure.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(treasure.Coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(treasure.Coin.Currency));
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(treasure.Goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(treasure.Goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(treasure.Goods.Last().Description));
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(treasure.Items.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(treasure.Items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(treasure.Items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Treasure) at level 42");
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Treasure_Numeric()
        {
            var treasure = new Treasure
            {
                Coin = new Coin { Currency = "munny", Quantity = 9266 },
                Goods = [new() { Description = "my good" }, new() { Description = "my other good" }],
                Items = [new() { Name = "my item" }, new() { Name = "my other item" }],
            };
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(treasure);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, ((int)TreasureTypes.Treasure).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(treasure.Coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(treasure.Coin.Currency));
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(treasure.Goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(treasure.Goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(treasure.Goods.Last().Description));
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(treasure.Items.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(treasure.Items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(treasure.Items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Treasure) at level 42");
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Coin()
        {
            var coin = new Coin { Currency = "munny", Quantity = 9266 };
            mockCoinGenerator
                .Setup(g => g.GenerateAtLevel(42))
                .Returns(coin);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, TreasureTypes.Coin.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(coin.Currency));
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Coin) at level 42");
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Coin_Numeric()
        {
            var coin = new Coin { Currency = "munny", Quantity = 9266 };
            mockCoinGenerator
                .Setup(g => g.GenerateAtLevel(42))
                .Returns(coin);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, ((int)TreasureTypes.Coin).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(coin.Currency));
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Coin) at level 42");
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Goods()
        {
            var goods = new List<Good> { new() { Description = "my good" }, new() { Description = "my other good" } };
            mockGoodsGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(goods);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, TreasureTypes.Goods.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(goods.Last().Description));
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Goods) at level 42");
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Goods_Numeric()
        {
            var goods = new List<Good> { new() { Description = "my good" }, new() { Description = "my other good" } };
            mockGoodsGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(goods);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, ((int)TreasureTypes.Goods).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(goods.Last().Description));
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Goods) at level 42");
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Items()
        {
            var items = new List<Item> { new() { Name = "my item" }, new() { Name = "my other item" } };
            mockItemsGenerator
                .Setup(g => g.GenerateRandomAtLevelAsync(42))
                .ReturnsAsync(items);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, TreasureTypes.Items.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(items.Count).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Items) at level 42");
        }

        [Test]
        public async Task RunV1_ReturnsTheGeneratedTreasure_Items_Numeric()
        {
            var items = new List<Item> { new() { Name = "my item" }, new() { Name = "my other item" } };
            mockItemsGenerator
                .Setup(g => g.GenerateRandomAtLevelAsync(42))
                .ReturnsAsync(items);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, ((int)TreasureTypes.Items).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(items.Count).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Items) at level 42");
        }

        [TestCase("coolpoints")]
        [TestCase("coins")]
        [TestCase("Coins")]
        [TestCase("good")]
        [TestCase("Good")]
        [TestCase("item")]
        [TestCase("Item")]
        public async Task RunV1_ReturnsBadRequest_WhenTreasureTypeInvalid(string invalid)
        {
            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, invalid, 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Parameter 'treasureType' of '{invalid}' is not a valid Treasure Type. Should be one of: Treasure, Coin, Goods, Items", LogLevel.Error);
        }

        [TestCase(LevelLimits.Minimum - 2)]
        [TestCase(LevelLimits.Minimum - 1)]
        public async Task RunV1_ReturnsBadRequest_WhenLevelNotValid_OutOfRange(int level)
        {
            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, TreasureTypes.Treasure.ToString(), level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Parameter 'level' of '{level}' is not a valid level. Should be 1 <= level", LogLevel.Error);
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Treasure()
        {
            var treasure = new Treasure
            {
                Coin = new Coin { Currency = "munny", Quantity = 9266 },
                Goods = [new() { Description = "my good" }, new() { Description = "my other good" }],
                Items = [new() { Name = "my item" }, new() { Name = "my other item" }],
            };
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(treasure);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, TreasureTypes.Treasure.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(treasure.Coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(treasure.Coin.Currency));
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(treasure.Goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(treasure.Goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(treasure.Goods.Last().Description));
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(treasure.Items.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(treasure.Items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(treasure.Items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Treasure) at level 42");
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Treasure_Numeric()
        {
            var treasure = new Treasure
            {
                Coin = new Coin { Currency = "munny", Quantity = 9266 },
                Goods = [new() { Description = "my good" }, new() { Description = "my other good" }],
                Items = [new() { Name = "my item" }, new() { Name = "my other item" }],
            };
            mockTreasureGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(treasure);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, ((int)TreasureTypes.Treasure).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(treasure.Coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(treasure.Coin.Currency));
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(treasure.Goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(treasure.Goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(treasure.Goods.Last().Description));
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(treasure.Items.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(treasure.Items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(treasure.Items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Treasure) at level 42");
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Coin()
        {
            var coin = new Coin { Currency = "munny", Quantity = 9266 };
            mockCoinGenerator
                .Setup(g => g.GenerateAtLevel(42))
                .Returns(coin);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, TreasureTypes.Coin.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(coin.Currency));
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Coin) at level 42");
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Coin_Numeric()
        {
            var coin = new Coin { Currency = "munny", Quantity = 9266 };
            mockCoinGenerator
                .Setup(g => g.GenerateAtLevel(42))
                .Returns(coin);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, ((int)TreasureTypes.Coin).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.EqualTo(coin.Quantity));
            Assert.That(responseTreasure.Coin.Currency, Is.EqualTo(coin.Currency));
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Coin) at level 42");
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Goods()
        {
            var goods = new List<Good> { new() { Description = "my good" }, new() { Description = "my other good" } };
            mockGoodsGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(goods);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, TreasureTypes.Goods.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(goods.Last().Description));
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Goods) at level 42");
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Goods_Numeric()
        {
            var goods = new List<Good> { new() { Description = "my good" }, new() { Description = "my other good" } };
            mockGoodsGenerator
                .Setup(g => g.GenerateAtLevelAsync(42))
                .ReturnsAsync(goods);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, ((int)TreasureTypes.Goods).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods.Count(), Is.EqualTo(goods.Count()).And.EqualTo(2));
            Assert.That(responseTreasure.Goods.First().Description, Is.EqualTo(goods.First().Description));
            Assert.That(responseTreasure.Goods.Last().Description, Is.EqualTo(goods.Last().Description));
            Assert.That(responseTreasure.Items, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Goods) at level 42");
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Items()
        {
            var items = new List<Item> { new() { Name = "my item" }, new() { Name = "my other item" } };
            mockItemsGenerator
                .Setup(g => g.GenerateRandomAtLevelAsync(42))
                .ReturnsAsync(items);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, TreasureTypes.Items.ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(items.Count).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Items) at level 42");
        }

        [Test]
        public async Task RunV2_ReturnsTheGeneratedTreasure_Items_Numeric()
        {
            var items = new List<Item> { new() { Name = "my item" }, new() { Name = "my other item" } };
            mockItemsGenerator
                .Setup(g => g.GenerateRandomAtLevelAsync(42))
                .ReturnsAsync(items);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, ((int)TreasureTypes.Items).ToString(), 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseTreasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(responseTreasure.Coin.Quantity, Is.Zero);
            Assert.That(responseTreasure.Goods, Is.Empty);
            Assert.That(responseTreasure.Items.Count(), Is.EqualTo(items.Count).And.EqualTo(2));
            Assert.That(responseTreasure.Items.First().Summary, Is.EqualTo(items.First().Summary));
            Assert.That(responseTreasure.Items.Last().Summary, Is.EqualTo(items.Last().Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Generated Treasure (Items) at level 42");
        }

        [TestCase("coolpoints")]
        [TestCase("coins")]
        [TestCase("Coins")]
        [TestCase("good")]
        [TestCase("Good")]
        [TestCase("item")]
        [TestCase("Item")]
        public async Task RunV2_ReturnsBadRequest_WhenTreasureTypeInvalid(string invalid)
        {
            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, invalid, 42);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog($"Parameter 'treasureType' of '{invalid}' is not a valid Treasure Type. Should be one of: Treasure, Coin, Goods, Items", LogLevel.Error);
        }

        [TestCase(LevelLimits.Minimum - 2)]
        [TestCase(LevelLimits.Minimum - 1)]
        public async Task RunV2_ReturnsBadRequest_WhenLevelNotValid_OutOfRange(int level)
        {
            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, TreasureTypes.Treasure.ToString(), level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomTreasureFunction.RunV2) processed a request.");
            mockLogger.AssertLog($"Parameter 'level' of '{level}' is not a valid level. Should be 1 <= L <= 100", LogLevel.Error);
        }
    }
}