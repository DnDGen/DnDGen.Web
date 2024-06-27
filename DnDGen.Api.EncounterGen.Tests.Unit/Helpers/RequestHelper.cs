using Azure.Core.Serialization;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Specialized;

namespace DnDGen.Api.EncounterGen.Tests.Unit.Helpers
{
    public class RequestHelper
    {
        private readonly Mock<FunctionContext> mockContext;

        public RequestHelper()
        {
            var mockServiceProvider = new Mock<IServiceProvider>();
            var options = Options.Create(new WorkerOptions { Serializer = new JsonObjectSerializer() });
            mockServiceProvider.Setup(p => p.GetService(typeof(IOptions<WorkerOptions>))).Returns(options);

            mockContext = new Mock<FunctionContext>();
            mockContext.SetupProperty(c => c.InstanceServices, mockServiceProvider.Object);
        }

        public HttpRequestData BuildRequest(NameValueCollection? query = null)
        {
            var request = new Mock<HttpRequestData>(mockContext.Object);
            request.SetupGet(r => r.Query).Returns([]);

            if (query?.Count > 0)
            {
                request.SetupGet(r => r.Query).Returns(query!);
            }

            request.Setup(r => r.CreateResponse()).Returns(BuildResponse);

            return request.Object;
        }

        public HttpResponseData BuildResponse()
        {
            var response = new Mock<HttpResponseData>(mockContext.Object);
            response.SetupProperty(r => r.Headers, []);
            response.SetupProperty(r => r.StatusCode);
            response.SetupProperty(r => r.Body, new MemoryStream());

            return response.Object;
        }
    }
}
