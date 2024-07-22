using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.RollGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using System.Collections.Specialized;
using System.Net;

namespace DnDGen.Api.RollGen.Tests.Unit.Functions
{
    public class ValidateRollFunctionTests
    {
        private ValidateRollFunction function;
        private Mock<Dice> mockDice;
        private Mock<PartialRoll> mockRoll;
        private Mock<ILogger<ValidateRollFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockDice = new Mock<Dice>();
            mockRoll = new Mock<PartialRoll>();
            mockLogger = new Mock<ILogger<ValidateRollFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.RollGen.Functions.ValidateRollFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<Dice>()).Returns(mockDice.Object);

            function = new ValidateRollFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheValidatedRoll(bool validRoll)
        {
            var query = new NameValueCollection
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };

            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(validRoll);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(validRoll));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRollFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Validated 9266d90210 = {validRoll}");
        }

        [TestCase("quantity")]
        [TestCase("die")]
        public async Task RollV1_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var query = new NameValueCollection
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };
            query.Remove(missing);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

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
            var query = new NameValueCollection
            {
                { "quantity", new StringValues(quantity.ToString()) },
                { "die", new StringValues(die.ToString()) },
            };

            mockDice.Setup(d => d.Roll(quantity)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(die).IsValid()).Returns(true);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.True);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRollFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Validated {quantity}d{die} = {true}");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV2_ReturnsTheValidatedRoll(bool validRoll)
        {
            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(validRoll);

            var request = requestHelper.BuildRequest();

            var response = await function.RunV2(request, 9266, 90210);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(validRoll));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRollFunction.RunV2) processed a request.");
            mockLogger.AssertLog($"Validated 9266d90210 = {validRoll}");
        }
    }
}