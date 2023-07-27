using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Helpers;
using DnDGen.Infrastructure.Generators;
using DnDGen.TreasureGen;
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
        [OpenApiParameter(name: "itemType", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The type of item to generate. Valid values: Alchemical Item, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, Wondrous Item")]
        [OpenApiParameter(name: "power", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The power at which to generate the item. Valid values: Mundane, Minor, Medium, Major. Not all powers are compatible with all item types.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Treasure),
            Description = "The OK response containing the generated item")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/item/generate")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (GenerateRandomItemFunction.Run) processed a request.");

            var valid = QueryHelper.CheckParameters(req, log, "itemType", "power");
            if (!valid)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var itemType = req.Query["itemType"];
            var power = req.Query["power"];

            var item = GetItem(itemType, power);
            IActionResult result = new OkObjectResult(item);

            log.LogInformation($"Generated Item ({itemType}) at power {power}");

            return Task.FromResult(result);
        }

        private Item GetItem(string itemType, string power)
        {
            if (power == PowerConstants.Mundane)
            {
                var mundaneGenerator = justInTimeFactory.Build<MundaneItemGenerator>(itemType);
                return mundaneGenerator.GenerateRandom();
            }

            var magicalGenerator = justInTimeFactory.Build<MagicalItemGenerator>(itemType);
            return magicalGenerator.GenerateRandom(power);
        }
    }
}
