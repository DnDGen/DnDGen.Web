using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.RollGen;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;

namespace DnDGen.Api.RollGen.Tests.Unit.Functions
{
    public class ValidateRollFunctionTests
    {
        private ValidateRollFunction function;
        private Mock<Dice> mockDice;
        private Mock<PartialRoll> mockRoll;
        private Mock<ILogger> mockLogger;
        private Mock<HttpRequest> mockRequest;

        [SetUp]
        public void Setup()
        {
            mockDice = new Mock<Dice>();
            mockRoll = new Mock<PartialRoll>();
            mockLogger = new Mock<ILogger>();
            mockRequest = new Mock<HttpRequest>();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<Dice>()).Returns(mockDice.Object);

            function = new ValidateRollFunction(mockDependencyFactory.Object);
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheValidatedRoll(bool validRoll)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(validRoll);

            var result = await function.RunV1(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(validRoll));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRollFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Validated 9266d90210 = {validRoll}");
        }

        [TestCase("quantity")]
        [TestCase("die")]
        public async Task RollV1_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var values = new Dictionary<string, StringValues>
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };
            values.Remove(missing);

            var query = new QueryCollection(values);
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.RunV1(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRollFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }

        [TestCase(10_001, 1)]
        [TestCase(10_001, 10_000)]
        [TestCase(10_001, 10_001)]
        [TestCase(16_500_000, 1)]
        [TestCase(16_500_001, 1)]
        public async Task BUG_RunV1_HandlesQuantityAndDie(int quantity, int die)
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "quantity", new StringValues(quantity.ToString()) },
                { "die", new StringValues(die.ToString()) },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            mockDice.Setup(d => d.Roll(quantity)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(die).IsValid()).Returns(true);

            var result = await function.RunV1(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.True);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRollFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Validated {quantity}d{die} = {true}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV2_ReturnsTheValidatedRoll(bool validRoll)
        {
            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(validRoll);

            var result = await function.RunV2(mockRequest.Object, 9266, 90210, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(validRoll));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRollFunction.RunV2) processed a request.");
            mockLogger.AssertLog($"Validated 9266d90210 = {validRoll}");
        }
    }
}