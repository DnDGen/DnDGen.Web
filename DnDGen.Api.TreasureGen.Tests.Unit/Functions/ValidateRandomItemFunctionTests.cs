using DnDGen.Api.TreasureGen.Functions;
using DnDGen.TreasureGen.Items;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        [TestCase("AlchemicalItem", PowerConstants.Mundane, true)]
        [TestCase("AlchemicalItem", PowerConstants.Medium, false)]
        [TestCase("AlchemicalItem", "bad power", false)]
        [TestCase("Alchemical Item", PowerConstants.Mundane, false)]
        [TestCase("Alchemical Item", PowerConstants.Medium, false)]
        [TestCase("Alchemical Item", "bad power", false)]
        [TestCase("Alchemical+Item", PowerConstants.Mundane, false)]
        [TestCase("Alchemical+Item", PowerConstants.Medium, false)]
        [TestCase("Alchemical+Item", "bad power", false)]
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
        [TestCase("Wondrous Item", PowerConstants.Medium, false)]
        [TestCase("Wondrous Item", "bad power", false)]
        [TestCase("Wondrous+Item", PowerConstants.Mundane, false)]
        [TestCase("Wondrous+Item", PowerConstants.Medium, false)]
        [TestCase("Wondrous+Item", "bad power", false)]
        [TestCase("10", PowerConstants.Mundane, false)]
        [TestCase("10", PowerConstants.Medium, true)]
        [TestCase("10", "bad power", false)]
        public async Task Run_ReturnsTheParameterValidity(string itemType, string power, bool valid)
        {
            var result = await function.Run(mockRequest.Object, itemType, power, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(valid));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomItemFunction.Run) processed a request.");
            mockLogger.AssertLog($"Validated Item ({itemType}) at power '{power}' = {valid}");
        }
    }
}