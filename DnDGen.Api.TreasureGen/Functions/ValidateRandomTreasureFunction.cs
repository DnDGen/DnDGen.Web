using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.TreasureGen.Functions
{
    public class ValidateRandomTreasureFunction
    {
        private readonly ILogger _logger;

        public ValidateRandomTreasureFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateRandomTreasureFunction>();
        }

        [Function("ValidateRandomTreasureFunction")]
        [OpenApiOperation(operationId: "ValidateRandomTreasureFunctionRun", Summary = "Validate parameters for random treasure generation",
            Description = "Validates the parameters for random treasure generation")]
        [OpenApiParameter(name: "treasureType", In = ParameterLocation.Path, Required = true, Type = typeof(TreasureTypes),
            Description = "The type of treasure to generate. Valid values: Treasure, Coin, Goods, Items")]
        [OpenApiParameter(name: "level", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The level at which to generate the treasure. Should be 1 <= L <= 100")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the generated treasure")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/{treasureType}/level/{level:int}/validate")] HttpRequestData req,
            string treasureType, int level)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateRandomTreasureFunction.Run) processed a request.");

            var validTreasureType = Enum.TryParse<TreasureTypes>(treasureType, true, out var validatedTreasureType);
            var valid = validTreasureType && LevelLimits.Minimum <= level && level <= LevelLimits.Maximum;

            _logger.LogInformation($"Validated Treasure ({treasureType}) at level {level} = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }
    }
}
