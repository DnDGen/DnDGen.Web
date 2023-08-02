using DnDGen.Api.TreasureGen.Helpers;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.Api.TreasureGen.Validators;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.TreasureGen.Functions
{
    public class ValidateRandomItemFunction
    {
        [FunctionName("ValidateRandomItemFunction")]
        [OpenApiOperation(operationId: "ValidateRandomItemFunctionRun", Summary = "Validate parameters for random item generation",
            Description = "Validates the parameters for random item generation")]
        [OpenApiParameter(name: "itemType", In = ParameterLocation.Path, Required = true, Type = typeof(ItemTypes),
            Description = "The type of item to generate. Valid values: Alchemical Item, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, Wondrous Item")]
        [OpenApiParameter(name: "power", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The power at which to generate the item. Valid values: Mundane, Minor, Medium, Major. Not all powers are compatible with all item types.")]
        [OpenApiParameter(name: "name", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The name of the item to generate. Will potentially add random magical powers, ability, curses, and intelligence.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the generated item")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/item/{itemType}/power/{power}/validate")] HttpRequest req,
            string itemType, string power, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (ValidateRandomItemFunction.Run) processed a request.");

            var name = (string)req.Query["name"];
            var validItemType = Enum.TryParse<ItemTypes>(itemType, out var validatedItemType);
            var valid = validItemType;

            if (validItemType)
            {
                var itemTypeDescription = EnumHelper.GetDescription(validatedItemType);

                if (name == null)
                {
                    valid &= ItemValidator.Validate(itemTypeDescription, power);
                }
                else
                {
                    valid &= ItemValidator.Validate(itemTypeDescription, power, name);
                }
            }

            IActionResult result = new OkObjectResult(valid);

            if (name == null)
                log.LogInformation($"Validated Item ({itemType}) at power '{power}' = {valid}");
            else
                log.LogInformation($"Validated Item {name} ({itemType}) at power '{power}' = {valid}");

            return Task.FromResult(result);
        }
    }
}
