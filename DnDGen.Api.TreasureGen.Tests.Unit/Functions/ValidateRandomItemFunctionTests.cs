using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using System.Collections.Specialized;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Unit.Functions
{
    public class ValidateRandomItemFunctionTests
    {
        private ValidateRandomItemFunction function;
        private Mock<ILogger<ValidateRandomItemFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger<ValidateRandomItemFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.TreasureGen.Functions.ValidateRandomItemFunction")).Returns(mockLogger.Object);

            function = new ValidateRandomItemFunction(mockLoggerFactory.Object);
            requestHelper = new RequestHelper();
        }

        [TestCase("bad item type", PowerConstants.Mundane, false)]
        [TestCase("bad item type", PowerConstants.Medium, false)]
        [TestCase("bad item type", "bad power", false)]
        [TestCase("AlchemicalItem", PowerConstants.Mundane, true)]
        [TestCase("alchemicalitem", PowerConstants.Mundane, true)]
        [TestCase("ALCHEMICALITEM", PowerConstants.Mundane, true)]
        [TestCase("AlchemicalItem", PowerConstants.Medium, false)]
        [TestCase("AlchemicalItem", "bad power", false)]
        [TestCase("Alchemical Item", PowerConstants.Mundane, false)]
        [TestCase("Alchemical+Item", PowerConstants.Mundane, false)]
        [TestCase("0", PowerConstants.Mundane, true)]
        [TestCase("0", PowerConstants.Medium, false)]
        [TestCase("0", "bad power", false)]
        [TestCase("Weapon", PowerConstants.Mundane, true)]
        [TestCase("Weapon", PowerConstants.Medium, true)]
        [TestCase("WEAPON", PowerConstants.Medium, true)]
        [TestCase("weapon", PowerConstants.Medium, true)]
        [TestCase("Weapon", "bad power", false)]
        [TestCase("WondrousItem", PowerConstants.Mundane, false)]
        [TestCase("WondrousItem", PowerConstants.Medium, true)]
        [TestCase("WONDROUSITEM", PowerConstants.Medium, true)]
        [TestCase("wondrousitem", PowerConstants.Medium, true)]
        [TestCase("WondrousItem", "bad power", false)]
        [TestCase("Wondrous Item", PowerConstants.Mundane, false)]
        [TestCase("Wondrous+Item", PowerConstants.Mundane, false)]
        [TestCase("10", PowerConstants.Mundane, false)]
        [TestCase("10", PowerConstants.Medium, true)]
        [TestCase("10", "bad power", false)]
        public async Task Run_ReturnsTheParameterValidity(string itemType, string power, bool valid)
        {
            var request = requestHelper.BuildRequest();

            var response = await function.Run(request, itemType, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Validated Item ({itemType}) at power '{power}' = {valid}");
        }

        [TestCase("bad item type", PowerConstants.Mundane, "bad item", false)]
        [TestCase("bad item type", PowerConstants.Mundane, AlchemicalItemConstants.Acid, false)]
        [TestCase("bad item type", PowerConstants.Mundane, WeaponConstants.Arrow, false)]
        [TestCase("bad item type", PowerConstants.Medium, WeaponConstants.Arrow, false)]
        [TestCase("bad item type", "bad power", WeaponConstants.Arrow, false)]
        [TestCase("AlchemicalItem", PowerConstants.Mundane, "bad item", false)]
        [TestCase("AlchemicalItem", PowerConstants.Mundane, AlchemicalItemConstants.Acid, true)]
        [TestCase("alchemicalitem", PowerConstants.Mundane, AlchemicalItemConstants.Acid, true)]
        [TestCase("ALCHEMICALITEM", PowerConstants.Mundane, AlchemicalItemConstants.Acid, true)]
        [TestCase("AlchemicalItem", "MUNDANE", AlchemicalItemConstants.Acid, true)]
        [TestCase("AlchemicalItem", "mundane", AlchemicalItemConstants.Acid, true)]
        [TestCase("AlchemicalItem", PowerConstants.Mundane, "ACID", true)]
        [TestCase("AlchemicalItem", PowerConstants.Mundane, "acid", true)]
        [TestCase("AlchemicalItem", PowerConstants.Mundane, WeaponConstants.Arrow, false)]
        [TestCase("AlchemicalItem", PowerConstants.Medium, AlchemicalItemConstants.Acid, false)]
        [TestCase("AlchemicalItem", "bad power", AlchemicalItemConstants.Acid, false)]
        [TestCase("Alchemical Item", PowerConstants.Mundane, AlchemicalItemConstants.Acid, false)]
        [TestCase("Alchemical+Item", PowerConstants.Mundane, AlchemicalItemConstants.Acid, false)]
        [TestCase("0", PowerConstants.Mundane, "bad item", false)]
        [TestCase("0", PowerConstants.Mundane, AlchemicalItemConstants.Acid, true)]
        [TestCase("0", PowerConstants.Mundane, WeaponConstants.Arrow, false)]
        [TestCase("0", PowerConstants.Medium, AlchemicalItemConstants.Acid, false)]
        [TestCase("0", "bad power", AlchemicalItemConstants.Acid, false)]
        [TestCase("Weapon", PowerConstants.Medium, "bad item", false)]
        [TestCase("Weapon", PowerConstants.Medium, AlchemicalItemConstants.Acid, false)]
        [TestCase("Weapon", PowerConstants.Medium, WeaponConstants.Arrow, true)]
        [TestCase("WEAPON", PowerConstants.Medium, WeaponConstants.Arrow, true)]
        [TestCase("weapon", PowerConstants.Medium, WeaponConstants.Arrow, true)]
        [TestCase("Weapon", "MEDIUM", WeaponConstants.Arrow, true)]
        [TestCase("Weapon", "medium", WeaponConstants.Arrow, true)]
        [TestCase("Weapon", PowerConstants.Medium, "ARROW", true)]
        [TestCase("Weapon", PowerConstants.Medium, "arrow", true)]
        [TestCase("Weapon", PowerConstants.Mundane, WeaponConstants.Arrow, true)]
        [TestCase("Weapon", "bad power", WeaponConstants.Arrow, false)]
        [TestCase("WondrousItem", PowerConstants.Medium, AlchemicalItemConstants.Acid, false)]
        [TestCase("WondrousItem", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, true)]
        [TestCase("WONDROUSITEM", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, true)]
        [TestCase("wondrousitem", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, true)]
        [TestCase("WondrousItem", "MEDIUM", WondrousItemConstants.AmuletOfHealth, true)]
        [TestCase("WondrousItem", "medium", WondrousItemConstants.AmuletOfHealth, true)]
        [TestCase("WondrousItem", PowerConstants.Medium, "AMULET OF HEALTH", true)]
        [TestCase("WondrousItem", PowerConstants.Medium, "amulet of health", true)]
        [TestCase("WondrousItem", PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false)]
        [TestCase("WondrousItem", "bad power", WondrousItemConstants.AmuletOfHealth, false)]
        [TestCase("Wondrous Item", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false)]
        [TestCase("Wondrous+Item", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, false)]
        [TestCase("10", PowerConstants.Medium, "bad item", false)]
        [TestCase("10", PowerConstants.Medium, AlchemicalItemConstants.Acid, false)]
        [TestCase("10", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, true)]
        [TestCase("10", PowerConstants.Mundane, WondrousItemConstants.AmuletOfHealth, false)]
        [TestCase("10", "bad power", WondrousItemConstants.AmuletOfHealth, false)]
        public async Task Run_ReturnsTheParameterValidity_WithName(string itemType, string power, string name, bool valid)
        {
            var query = new NameValueCollection
            {
                { "name", new StringValues(name) },
            };

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, itemType, power);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Validated Item {name} ({itemType}) at power '{power}' = {valid}");
        }
    }
}