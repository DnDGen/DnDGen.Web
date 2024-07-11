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
    public class RollFunctionTests
    {
        private RollFunction function;
        private Mock<Dice> mockDice;
        private Mock<PartialRoll> mockRoll;
        private Mock<ILogger<RollFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockDice = new Mock<Dice>();
            mockRoll = new Mock<PartialRoll>();
            mockLogger = new Mock<ILogger<RollFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.RollGen.Functions.RollFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<Dice>()).Returns(mockDice.Object);

            function = new RollFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task RunV1_ReturnsTheRollAsSum()
        {
            var query = new NameValueCollection
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };

            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(true);
            mockRoll.Setup(r => r.d(90210).AsSum<int>()).Returns(42);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.EqualTo(42));

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Rolled 9266d90210 = 42");
        }

        [TestCase("quantity")]
        [TestCase("die")]
        public async Task RunV1_ReturnsBadRequest_WhenParameterMissing(string missing)
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

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.RunV1) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WhenRollIsNotValid()
        {
            var query = new NameValueCollection
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };

            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(false);
            mockRoll.Setup(r => r.d(90210).AsSum<int>()).Returns(666);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Roll 9266d90210 is not a valid roll.", LogLevel.Error);
        }

        [Test]
        public async Task RunV2_ReturnsTheRollAsSum()
        {
            var query = new NameValueCollection
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };

            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(true);
            mockRoll.Setup(r => r.d(90210).AsSum<int>()).Returns(42);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV2(request, 9266, 90210);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.EqualTo(42));

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Rolled 9266d90210 = 42");
        }

        [Test]
        public async Task RunV2_ReturnsBadRequest_WhenRollIsNotValid()
        {
            var query = new NameValueCollection
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };

            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).IsValid()).Returns(false);
            mockRoll.Setup(r => r.d(90210).AsSum<int>()).Returns(666);

            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV2(request, 9266, 90210);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.RunV2) processed a request.");
            mockLogger.AssertLog("Roll 9266d90210 is not a valid roll.", LogLevel.Error);
        }
    }
}