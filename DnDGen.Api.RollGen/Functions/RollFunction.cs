using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Helpers;
using DnDGen.RollGen;
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

namespace DnDGen.Api.RollGen.Functions
{
    public class RollFunction
    {
        private readonly Dice dice;

        public RollFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("RollFunction")]
        [OpenApiOperation(operationId: "RollFunctionRun", Summary = "Roll XdY",
            Description = "Rolls the die Y quantity X times (XdY) and returns the sum")]
        [OpenApiParameter(name: "quantity", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The Quantity to roll. Should be 0 < Q <= 10,000")]
        [OpenApiParameter(name: "die", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The Die to roll. Should be 0 < D <= 10,000")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/roll")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (RollFunction.Run) processed a request.");

            var valid = QueryHelper.CheckParameters(req, log, "quantity", "die");
            if (!valid)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var quantity = Convert.ToInt32(req.Query["quantity"]);
            var die = Convert.ToInt32(req.Query["die"]);

            var roll = dice.Roll(quantity).d(die).AsSum();
            IActionResult result = new OkObjectResult(roll);

            log.LogInformation($"Rolled {quantity}d{die} = {roll}");

            return Task.FromResult(result);
        }
    }
}
