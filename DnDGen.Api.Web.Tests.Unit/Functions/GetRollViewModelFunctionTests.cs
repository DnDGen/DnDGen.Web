using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models;
using DnDGen.RollGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.Web.Tests.Unit.Functions
{
    public class GetRollViewModelFunctionTests
    {
        private GetRollViewModelFunction function;
        private Mock<ILogger<GetRollViewModelFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger<GetRollViewModelFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.Web.Functions.GetRollViewModelFunction")).Returns(mockLogger.Object);

            function = new GetRollViewModelFunction(mockLoggerFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheRollViewModel()
        {
            var request = requestHelper.BuildRequest();

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var model = StreamHelper.Read<RollViewModel>(response.Body);
            Assert.That(model, Is.Not.Null);
            Assert.That(model.QuantityLimit_Lower, Is.EqualTo(1));
            Assert.That(model.QuantityLimit_Upper, Is.EqualTo(Limits.Quantity));
            Assert.That(model.DieLimit_Lower, Is.EqualTo(1));
            Assert.That(model.DieLimit_Upper, Is.EqualTo(Limits.Die));

            mockLogger.AssertLog("C# HTTP trigger function (GetRollViewModelFunction.Run) processed a request.");
        }
    }
}