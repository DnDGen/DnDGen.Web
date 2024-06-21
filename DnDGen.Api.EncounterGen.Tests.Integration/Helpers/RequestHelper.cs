using DnDGen.Api.EncounterGen.Tests.Integration.Fakes;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.EncounterGen.Tests.Integration.Helpers
{
    public static class RequestHelper
    {
        public static HttpRequestData BuildRequest(string url)
        {
            var context = new FakeFunctionContext();
            var request = new FakeHttpRequestData(context, new Uri(url));

            return request;
        }
    }
}
