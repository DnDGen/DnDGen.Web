using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Specialized;

namespace DnDGen.Api.EncounterGen.Tests.Unit.Helpers
{
    public static class RequestHelper
    {
        public static HttpRequestData BuildRequest(NameValueCollection? query = null)
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddScoped<ILoggerFactory, LoggerFactory>();
            var serviceProvider = serviceCollection.BuildServiceProvider();

            var context = new Mock<FunctionContext>();
            context.SetupProperty(c => c.InstanceServices, serviceProvider);

            var request = new Mock<HttpRequestData>(context.Object);
            request.SetupGet(r => r.Query).Returns(new NameValueCollection());

            if (query?.Count > 0)
            {
                request.SetupGet(r => r.Query).Returns(query!);
            }

            request.Setup(r => r.CreateResponse()).Returns(() =>
            {
                var response = new Mock<HttpResponseData>(context.Object);
                response.SetupProperty(r => r.Headers, new HttpHeadersCollection());
                response.SetupProperty(r => r.StatusCode);
                response.SetupProperty(r => r.Body, new MemoryStream());
                return response.Object;
            });

            return request.Object;
        }
    }
}
