using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models.Treasures;
using DnDGen.TreasureGen.Items;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.Web.Tests.Integration.Functions
{
    public class GetTreasureViewModelFunctionTests : IntegrationTests
    {
        private GetTreasureViewModelFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            function = new GetTreasureViewModelFunction(loggerFactory);
        }

        [Test]
        public async Task Run_ReturnsTreasureViewModel()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
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
        }

        private string GetUrl(string query = "")
        {
            var url = "https://web.dndgen.com/api/v1/treasure/viewmodel";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }
    }
}