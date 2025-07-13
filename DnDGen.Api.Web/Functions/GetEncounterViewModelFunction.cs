using DnDGen.Api.Web.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.Web.Functions
{
    public class GetEncounterViewModelFunction
    {
        private readonly ILogger _logger;

        public GetEncounterViewModelFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<GetEncounterViewModelFunction>();
        }

        [Function("GetEncounterViewModelFunction")]
        [OpenApiOperation(operationId: "GetEncounterViewModelFunctionRun", tags: ["v1"],
            Summary = "Get the EncounterGen View Model",
            Description = "Gets the initial view data for the EncounterGen view")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(EncounterViewModel),
            Description = "The OK response containing the encountergen view model")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/encounter/viewmodel")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (GetEncounterViewModelFunction.Run) processed a request.");

            var model = new EncounterViewModel();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(model);
            return response;
        }
    }
}
