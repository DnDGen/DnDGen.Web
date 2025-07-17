using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Models.Legacy;
using DnDGen.Api.TreasureGen.Validators;
using DnDGen.Infrastructure.Factories;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.TreasureGen.Functions
{
    public class GenerateRandomItemFunction
    {
        private readonly JustInTimeFactory _justInTimeFactory;
        private readonly ILogger _logger;

        public GenerateRandomItemFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<GenerateRandomItemFunction>();
            _justInTimeFactory = dependencyFactory.Get<JustInTimeFactory>();
        }

        [Function("GenerateRandomItemFunction")]
        [OpenApiOperation(operationId: "GenerateRandomItemFunctionRun", tags: ["v1"],
            Summary = "Generate random item",
            Description = "Generate a random item of the specified item type at the specified power.")]
        [OpenApiParameter(name: "itemType",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(ItemTypes),
            Description = "The type of item to generate. Valid values: AlchemicalItem, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, WondrousItem")]
        [OpenApiParameter(name: "power",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "The power at which to generate the item. Valid values: Mundane, Minor, Medium, Major. Not all powers are compatible with all item types.")]
        [OpenApiParameter(name: "name",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The name of the item to generate. Will potentially add random magical powers, ability, curses, and intelligence.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Item),
            Description = "The OK response containing the generated item")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Armor),
            Description = "The OK response containing the generated armor")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(WeaponV1),
            Description = "The OK response containing the generated weapon")]
        public async Task<HttpResponseData> RunV1(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/item/{itemType}/power/{power}/generate")] HttpRequestData req,
            string itemType, string power)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateRandomItemFunction.RunV1) processed a request.");

            var name = req.Query["name"];
            var validatorResult = ItemValidator.GetValid(itemType, power, name);

            if (!validatorResult.Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Item Type: {itemType}; Power: {power}; Name: {name ?? "(None)"}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var item = GetItem(validatorResult.ItemType, validatorResult.Power, validatorResult.Name);

            if (validatorResult.Name == null)
                _logger.LogInformation($"Generated Item ({validatorResult.ItemType}) at power {validatorResult.Power}");
            else
                _logger.LogInformation($"Generated Item {validatorResult.Name} ({validatorResult.ItemType}) at power {validatorResult.Power}");

            var response = req.CreateResponse(HttpStatusCode.OK);

            if (item is Weapon)
                await response.WriteAsJsonAsync(item as WeaponV1);
            else
                await response.WriteDnDGenModelAsJsonAsync(item);

            return response;
        }

        [Function("GenerateRandomItemFunctionV2")]
        [OpenApiOperation(operationId: "GenerateRandomItemFunctionV2Run", tags: ["v2"],
            Summary = "Generate random item",
            Description = "Generate a random item of the specified item type at the specified power.")]
        [OpenApiParameter(name: "itemType",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(ItemTypes),
            Description = "The type of item to generate. Valid values: AlchemicalItem, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, WondrousItem")]
        [OpenApiParameter(name: "power",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "The power at which to generate the item. Valid values: Mundane, Minor, Medium, Major. Not all powers are compatible with all item types.")]
        [OpenApiParameter(name: "name",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The name of the item to generate. Will potentially add random magical powers, ability, curses, and intelligence.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Item),
            Description = "The OK response containing the generated item")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Armor),
            Description = "The OK response containing the generated armor")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Weapon),
            Description = "The OK response containing the generated weapon")]
        public async Task<HttpResponseData> RunV2(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/item/{itemType}/power/{power}/generate")] HttpRequestData req,
            string itemType, string power)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateRandomItemFunction.RunV2) processed a request.");

            var name = req.Query["name"];
            var validatorResult = ItemValidator.GetValid(itemType, power, name);

            if (!validatorResult.Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Item Type: {itemType}; Power: {power}; Name: {name ?? "(None)"}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var item = GetItem(validatorResult.ItemType, validatorResult.Power, validatorResult.Name);

            if (validatorResult.Name == null)
                _logger.LogInformation($"Generated Item ({validatorResult.ItemType}) at power {validatorResult.Power}");
            else
                _logger.LogInformation($"Generated Item {validatorResult.Name} ({validatorResult.ItemType}) at power {validatorResult.Power}");

            var response = req.CreateResponse(HttpStatusCode.OK);

            await response.WriteDnDGenModelAsJsonAsync(item);

            return response;
        }

        private Item GetItem(string itemType, string power, string name)
        {
            if (power == PowerConstants.Mundane)
            {
                var mundaneGenerator = _justInTimeFactory.Build<MundaneItemGenerator>(itemType);
                if (name != null)
                    return mundaneGenerator.Generate(name);

                return mundaneGenerator.GenerateRandom();
            }

            var magicalGenerator = _justInTimeFactory.Build<MagicalItemGenerator>(itemType);

            if (name != null)
                return magicalGenerator.Generate(power, name);

            return magicalGenerator.GenerateRandom(power);
        }
    }
}
