using DnDGen.Api.TreasureGen.Functions;
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
    public class ValidateRandomItemFunctionTests
    {
        private ValidateRandomItemFunction function;
        private Mock<ILogger> mockLogger;
        private Mock<HttpRequest> mockRequest;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger>();
            mockRequest = new Mock<HttpRequest>();

            function = new ValidateRandomItemFunction();
        }

        [TestCase("bad item type", PowerConstants.Mundane, false)]
        [TestCase("bad item type", PowerConstants.Medium, false)]
        [TestCase("bad item type", "bad power", false)]
        [TestCase("AlchemicalItem", PowerConstants.Mundane, true)]
        [TestCase("AlchemicalItem", PowerConstants.Medium, false)]
        [TestCase("AlchemicalItem", "bad power", false)]
        [TestCase("Alchemical Item", PowerConstants.Mundane, false)]
        [TestCase("Alchemical+Item", PowerConstants.Mundane, false)]
        [TestCase("0", PowerConstants.Mundane, true)]
        [TestCase("0", PowerConstants.Medium, false)]
        [TestCase("0", "bad power", false)]
        [TestCase("Weapon", PowerConstants.Mundane, true)]
        [TestCase("Weapon", PowerConstants.Medium, true)]
        [TestCase("Weapon", "bad power", false)]
        [TestCase("WondrousItem", PowerConstants.Mundane, false)]
        [TestCase("WondrousItem", PowerConstants.Medium, true)]
        [TestCase("WondrousItem", "bad power", false)]
        [TestCase("Wondrous Item", PowerConstants.Mundane, false)]
        [TestCase("Wondrous+Item", PowerConstants.Mundane, false)]
        [TestCase("10", PowerConstants.Mundane, false)]
        [TestCase("10", PowerConstants.Medium, true)]
        [TestCase("10", "bad power", false)]
        public async Task Run_ReturnsTheParameterValidity(string itemType, string power, bool valid)
        {
            var query = new QueryCollection();
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, itemType, power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));

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
        [TestCase("Weapon", PowerConstants.Mundane, WeaponConstants.Arrow, true)]
        [TestCase("Weapon", "bad power", WeaponConstants.Arrow, false)]
        [TestCase("WondrousItem", PowerConstants.Medium, AlchemicalItemConstants.Acid, false)]
        [TestCase("WondrousItem", PowerConstants.Medium, WondrousItemConstants.AmuletOfHealth, true)]
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
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "name", new StringValues(name) },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, itemType, power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Validated Item {name} ({itemType}) at power '{power}' = {valid}");
        }
    }
}