using DnDGen.Api.RollGen.Dependencies;
using DnDGen.RollGen;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;

namespace DnDGen.Api.RollGen.Tests.Unit
{
    public class RollFunctionTests
    {
        private RollFunction function;
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

            function = new RollFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Roll_ReturnsTheRollAsSum()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            mockDice.Setup(d => d.Roll(9266)).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.d(90210).AsSum<int>()).Returns(42);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(42));

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
            mockLogger.AssertLog("Rolled 9266d90210 = 42");
        }

        [TestCase("quantity")]
        [TestCase("die")]
        public async Task Roll_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var values = new Dictionary<string, StringValues>
            {
                { "quantity", new StringValues("9266") },
                { "die", new StringValues("90210") },
            };
            values.Remove(missing);

            var query = new QueryCollection(values);
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (RollFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }
    }
}