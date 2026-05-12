using DnDGen.Api.Web.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.Web.Functions
{
    public class GetCreatureViewModelFunction(ILoggerFactory loggerFactory)
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<GetCreatureViewModelFunction>();

        [Function("GetCreatureViewModelFunction")]
        [OpenApiOperation(operationId: "GetCreatureViewModelFunctionRun", tags: ["v1"],
            Summary = "Get the CreatureGen View Model",
            Description = "Gets the initial view data for the CreatureGen view")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(CreatureViewModel),
            Description = "The OK response containing the creaturegen view model")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/creature/viewmodel")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (GetCreatureViewModelFunction.Run) processed a request.");

            var model = new CreatureViewModel();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteDnDGenModelAsJsonAsync(model);
            return response;
        }
    }
}
