using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models;
using DnDGen.RollGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.Web.Tests.Integration.Functions
{
    public class GetRollViewModelFunctionTests : IntegrationTests
    {
        private GetRollViewModelFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            function = new GetRollViewModelFunction(loggerFactory);
        }

        [Test]
        public async Task Run_ReturnsRollViewModel()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
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
        }

        private string GetUrl(string query = "")
        {
            var url = "https://web.dndgen.com/api/v1/roll/viewmodel";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }
    }
}