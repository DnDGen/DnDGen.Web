using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Validators;
using DnDGen.Infrastructure.Generators;
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
    public class ValidateRandomItemFunction
    {
        private readonly JustInTimeFactory justInTimeFactory;

        public ValidateRandomItemFunction(IDependencyFactory dependencyFactory)
        {
            justInTimeFactory = dependencyFactory.Get<JustInTimeFactory>();
        }

        [FunctionName("ValidateRandomItemFunction")]
        [OpenApiOperation(operationId: "ValidateRandomItemFunctionRun", Summary = "Validate parameters for random item generation",
            Description = "Validates the parameters for random item generation")]
        [OpenApiParameter(name: "itemType", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The type of item to generate. Valid values: Alchemical Item, Armor, Potion, Ring, Rod, Scroll, Staff, Tool, Wand, Weapon, Wondrous Item")]
        [OpenApiParameter(name: "power", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The power at which to generate the item. Valid values: Mundane, Minor, Medium, Major. Not all powers are compatible with all item types.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the generated item")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/item/{itemType}/power/{power}/validate")] HttpRequest req,
            string itemType, string power, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (ValidateRandomItemFunction.Run) processed a request.");

            var valid = ItemValidator.Validate(itemType, power);
            IActionResult result = new OkObjectResult(valid);

            log.LogInformation($"Validated Item ({itemType}) at power {power} = {valid}");

            return Task.FromResult(result);
        }
    }
}
