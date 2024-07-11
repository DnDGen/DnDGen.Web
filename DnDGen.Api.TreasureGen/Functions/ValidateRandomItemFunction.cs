using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Validators;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.TreasureGen.Functions
{
    public class ValidateRandomItemFunction
    {
        private readonly ILogger _logger;

        public ValidateRandomItemFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateRandomItemFunction>();
        }

        [Function("ValidateRandomItemFunction")]
        [OpenApiOperation(operationId: "ValidateRandomItemFunctionRun", Summary = "Validate parameters for random item generation",
            Description = "Validates the parameters for random item generation")]
        [OpenApiParameter(name: "itemType", In = ParameterLocation.Path, Required = true, Type = typeof(ItemTypes),
            Description = "The type of item to generate. Valid values: AlchemicalItem, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, WondrousItem")]
        [OpenApiParameter(name: "power", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The power at which to generate the item. Valid values: Mundane, Minor, Medium, Major. Not all powers are compatible with all item types.")]
        [OpenApiParameter(name: "name", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The name of the item to generate. Will potentially add random magical powers, ability, curses, and intelligence.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the generated item")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/item/{itemType}/power/{power}/validate")] HttpRequestData req,
            string itemType, string power)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateRandomItemFunction.Run) processed a request.");

            var name = req.Query["name"];
            var validatorResult = ItemValidator.GetValid(itemType, power, name);

            if (name == null)
                _logger.LogInformation($"Validated Item ({itemType}) at power '{power}' = {validatorResult.Valid}");
            else
                _logger.LogInformation($"Validated Item {name} ({itemType}) at power '{power}' = {validatorResult.Valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(validatorResult.Valid);
            return response;
        }
    }
}
