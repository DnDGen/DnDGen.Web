using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
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
    public class RollExpressionFunctionTests
    {
        private RollExpressionFunction function;
        private Mock<Dice> mockDice;
        private Mock<PartialRoll> mockRoll;
        private Mock<ILogger<RollExpressionFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockDice = new Mock<Dice>();
            mockRoll = new Mock<PartialRoll>();
            mockLogger = new Mock<ILogger<RollExpressionFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.RollGen.Functions.RollExpressionFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<Dice>()).Returns(mockDice.Object);

            function = new RollExpressionFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task RunV1_ReturnsTheExpressionRolledAsSum()
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };

            mockDice.Setup(d => d.Roll("my+expression")).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.IsValid()).Returns(true);
            mockRoll.Setup(r => r.AsSum<int>()).Returns(9266);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.EqualTo(9266));

            mockLogger.AssertLog("C# HTTP trigger function (RollExpressionFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Rolled my+expression = 9266");
        }

        [TestCase("expression")]
        public async Task RunV1_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var query = new NameValueCollection();
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (RollExpressionFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WhenExpressionIsNotValid()
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };

            mockDice.Setup(d => d.Roll("my+expression")).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.IsValid()).Returns(false);
            mockRoll.Setup(r => r.AsSum<int>()).Returns(666);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (RollExpressionFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Roll my+expression is not a valid roll expression.", LogLevel.Error);
        }

        [Test]
        public async Task RunV2_ReturnsTheExpressionRolledAsSum()
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };

            mockDice.Setup(d => d.Roll("my+expression")).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.IsValid()).Returns(true);
            mockRoll.Setup(r => r.AsSum<int>()).Returns(9266);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.EqualTo(9266));

            mockLogger.AssertLog("C# HTTP trigger function (RollExpressionFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Rolled my+expression = 9266");
        }

        [Test]
        public async Task RunV2_ReturnsBadRequest_WhenExpressionIsNotValid()
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };

            mockDice.Setup(d => d.Roll("my+expression")).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.IsValid()).Returns(false);
            mockRoll.Setup(r => r.AsSum<int>()).Returns(666);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (RollExpressionFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Roll my+expression is not a valid roll expression.", LogLevel.Error);
        }
    }
}