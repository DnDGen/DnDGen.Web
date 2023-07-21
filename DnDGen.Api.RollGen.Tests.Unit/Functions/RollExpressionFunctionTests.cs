using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.RollGen;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;

namespace DnDGen.Api.RollGen.Tests.Unit.Functions
{
    public class RollExpressionFunctionTests
    {
        private RollExpressionFunction function;
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

            function = new RollExpressionFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Run_ReturnsTheExpressionRolledAsSum()
        {
            var query = new QueryCollection(new Dictionary<string, StringValues>
            {
                { "expression", new StringValues("my+expression") },
            });
            mockRequest.Setup(x => x.Query).Returns(query);

            mockDice.Setup(d => d.Roll("my+expression")).Returns(mockRoll.Object);
            mockRoll.Setup(r => r.AsSum<int>()).Returns(9266);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(9266));

            mockLogger.AssertLog("C# HTTP trigger function (RollExpressionFunction.Run) processed a request.");
            mockLogger.AssertLog("Rolled my+expression = 9266");
        }

        [TestCase("expression")]
        public async Task Run_ReturnsBadRequest_WhenParameterMissing(string missing)
        {
            var values = new Dictionary<string, StringValues>
            {
                { "expression", new StringValues("my+expression") },
            };
            values.Remove(missing);

            var query = new QueryCollection(values);
            mockRequest.Setup(x => x.Query).Returns(query);

            var result = await function.Run(mockRequest.Object, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (RollExpressionFunction.Run) processed a request.");
            mockLogger.AssertLog($"Query parameter '{missing}' is missing", LogLevel.Error);
        }
    }
}