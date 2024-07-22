using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models.Treasures;
using DnDGen.TreasureGen.Items;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.Web.Tests.Unit.Functions
{
    public class GetTreasureViewModelFunctionTests
    {
        private GetTreasureViewModelFunction function;
        private Mock<ILogger<GetTreasureViewModelFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger<GetTreasureViewModelFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.Web.Functions.GetTreasureViewModelFunction")).Returns(mockLogger.Object);

            function = new GetTreasureViewModelFunction(mockLoggerFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheTreasureViewModel()
        {
            var request = requestHelper.BuildRequest();

            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var model = StreamHelper.Read<TreasureViewModel>(response.Body);
            Assert.That(model, Is.Not.Null);
            Assert.That(model.TreasureTypes, Is.EquivalentTo(new[] { "Treasure", "Coin", "Goods", "Items" }));
            Assert.That(model.MaxTreasureLevel, Is.EqualTo(100));
            Assert.That(model.ItemTypeViewModels.Count(), Is.EqualTo(11).And.EqualTo(Enum.GetValues<ItemTypes>().Length));
            Assert.That(model.Powers, Is.EquivalentTo(new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major,
            }));
            Assert.That(model.ItemNames.Count(), Is.EqualTo(11).And.EqualTo(Enum.GetValues<ItemTypes>().Length));

            mockLogger.AssertLog("C# HTTP trigger function (GetTreasureViewModelFunction.Run) processed a request.");
        }
    }
}