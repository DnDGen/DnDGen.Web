using DnDGen.Api.Web.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.Web.Functions
{
    public class GetCharacterViewModelFunction
    {
        private readonly ILogger _logger;

        public GetCharacterViewModelFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<GetCharacterViewModelFunction>();
        }

        [Function("GetCharacterViewModelFunction")]
        [OpenApiOperation(operationId: "GetCharacterViewModelFunctionRun", tags: ["v1"],
            Summary = "Get the CharacterGen View Model",
            Description = "Gets the initial view data for the CharacterGen view")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(CharacterViewModel),
            Description = "The OK response containing the charactergen view model")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/character/viewmodel")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (GetCharacterViewModelFunction.Run) processed a request.");

            var model = new CharacterViewModel();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(model);
            return response;
        }
    }
}
