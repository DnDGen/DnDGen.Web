using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Validators;
using DnDGen.Infrastructure.Generators;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.TreasureGen.Functions
{
    public class GenerateRandomItemFunction
    {
        private readonly JustInTimeFactory justInTimeFactory;

        public GenerateRandomItemFunction(IDependencyFactory dependencyFactory)
        {
            justInTimeFactory = dependencyFactory.Get<JustInTimeFactory>();
        }

        [FunctionName("GenerateRandomItemFunction")]
        [OpenApiOperation(operationId: "GenerateRandomItemFunctionRun", Summary = "Generate random item",
            Description = "Generate a random item of the specified item type at the specified power.")]
        [OpenApiParameter(name: "itemType", In = ParameterLocation.Path, Required = true, Type = typeof(ItemTypes),
            Description = "The type of item to generate. Valid values: AlchemicalItem, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, WondrousItem")]
        [OpenApiParameter(name: "power", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The power at which to generate the item. Valid values: Mundane, Minor, Medium, Major. Not all powers are compatible with all item types.")]
        [OpenApiParameter(name: "name", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The name of the item to generate. Will potentially add random magical powers, ability, curses, and intelligence.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Item),
            Description = "The OK response containing the generated item")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/item/{itemType}/power/{power}/generate")] HttpRequest req,
            string itemType, string power, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");

            var name = (string)req.Query["name"];
            var validatorResult = ItemValidator.GetValid(itemType, power, name);

            if (!validatorResult.Valid)
            {
                log.LogError($"Parameters are not a valid combination. Item Type: {itemType}; Power: {power}; Name: {name ?? "(None)"}");
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var item = GetItem(validatorResult.ItemType, validatorResult.Power, validatorResult.Name);
            IActionResult result = new OkObjectResult(item);

            if (validatorResult.Name == null)
                log.LogInformation($"Generated Item ({validatorResult.ItemType}) at power {validatorResult.Power}");
            else
                log.LogInformation($"Generated Item {validatorResult.Name} ({validatorResult.ItemType}) at power {validatorResult.Power}");

            return Task.FromResult(result);
        }

        private Item GetItem(string itemType, string power, string name)
        {
            if (power == PowerConstants.Mundane)
            {
                var mundaneGenerator = justInTimeFactory.Build<MundaneItemGenerator>(itemType);
                if (name != null)
                    return mundaneGenerator.Generate(name);

                return mundaneGenerator.GenerateRandom();
            }

            var magicalGenerator = justInTimeFactory.Build<MagicalItemGenerator>(itemType);

            if (name != null)
                return magicalGenerator.Generate(power, name);

            return magicalGenerator.GenerateRandom(power);
        }
    }
}
