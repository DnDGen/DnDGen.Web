using DnDGen.Api.Web.Models.Treasures;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.Web.Functions
{
    public class GetTreasureViewModelFunction
    {
        private readonly ILogger _logger;

        public GetTreasureViewModelFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<GetTreasureViewModelFunction>();
        }

        [Function("GetTreasureViewModelFunction")]
        [OpenApiOperation(operationId: "GetTreasureViewModelFunctionRun", Summary = "Get the TreasureGen View Model",
            Description = "Gets the initial view data for the RollGen view")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(TreasureViewModel),
            Description = "The OK response containing the treasuregen view model")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/treasure/viewmodel")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (GetTreasureViewModelFunction.Run) processed a request.");

            var model = new TreasureViewModel();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(model);
            return response;
        }
    }
}
