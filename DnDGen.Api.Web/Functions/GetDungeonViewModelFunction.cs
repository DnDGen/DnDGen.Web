using DnDGen.Api.Web.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.Web.Functions
{
    public class GetDungeonViewModelFunction
    {
        private readonly ILogger _logger;

        public GetDungeonViewModelFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<GetDungeonViewModelFunction>();
        }

        [Function("GetDungeonViewModelFunction")]
        [OpenApiOperation(operationId: "GetDungeonViewModelFunctionRun", Summary = "Get the RollGen View Model",
            Description = "Gets the initial view data for the RollGen view")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(DungeonViewModel),
            Description = "The OK response containing the rollgen view model")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/dungeon/viewmodel")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (GetDungeonViewModelFunction.Run) processed a request.");

            var model = new DungeonViewModel();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(model);
            return response;
        }
    }
}
