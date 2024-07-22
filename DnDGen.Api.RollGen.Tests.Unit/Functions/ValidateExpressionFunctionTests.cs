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
    public class ValidateExpressionFunctionTests
    {
        private ValidateExpressionFunction function;
        private Mock<Dice> mockDice;
        private Mock<PartialRoll> mockRoll;
        private Mock<ILogger<ValidateExpressionFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockDice = new Mock<Dice>();
            mockRoll = new Mock<PartialRoll>();
            mockLogger = new Mock<ILogger<ValidateExpressionFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.RollGen.Functions.ValidateExpressionFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<Dice>()).Returns(mockDice.Object);

            function = new ValidateExpressionFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheValidatedExpression(bool validRoll)
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };

            mockDice.Setup(d => d.Roll("my+expression")).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.IsValid()).Returns(validRoll);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(validRoll));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateExpressionFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Validated my+expression = {validRoll}");
        }

        [TestCase("expression")]
        public async Task RollV1_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };
            query.Remove(missing);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateExpressionFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV2ReturnsTheValidatedExpression(bool validRoll)
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };

            mockDice.Setup(d => d.Roll("my+expression")).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.IsValid()).Returns(validRoll);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(validRoll));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateExpressionFunction.RunV2) processed a request.");
            mockLogger.AssertLog($"Validated my+expression = {validRoll}");
        }

        [TestCase("expression")]
        public async Task RollV2_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var query = new NameValueCollection
            {
                { "expression", new StringValues("my+expression") },
            };
            query.Remove(missing);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV2(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateExpressionFunction.RunV2) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }
    }
}