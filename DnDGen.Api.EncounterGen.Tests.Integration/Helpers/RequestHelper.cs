using DnDGen.Api.EncounterGen.Tests.Integration.Fakes;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.EncounterGen.Tests.Integration.Helpers
{
    public static class RequestHelper
    {
        public static HttpRequestData BuildRequest(string url, IServiceProvider serviceProvider)
        {
            var context = new FakeFunctionContext { InstanceServices = serviceProvider };
            var request = new FakeHttpRequestData(context, new Uri(url));

            return request;
        }
    }
}
