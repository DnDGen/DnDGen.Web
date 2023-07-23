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
    public class ValidateRollFunction
    {
        private readonly Dice dice;

        public ValidateRollFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("ValidateRollFunction")]
        [OpenApiOperation(operationId: "ValidateRollFunctionRun", Summary = "Validate XdY",
            Description = "Validates that XdY is a valid roll")]
        [OpenApiParameter(name: "quantity", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The Quantity to roll. Should be 0 < Q <= 10,000")]
        [OpenApiParameter(name: "die", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The Die to roll. Should be 0 < D <= 10,000")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing whether the provided roll is valid")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/roll/validate")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (ValidateRollFunction.Run) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, log, "quantity", "die");
            if (!validParameters)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var quantity = Convert.ToInt32(req.Query["quantity"]);
            var die = Convert.ToInt32(req.Query["die"]);

            var valid = dice.Roll(quantity).d(die).IsValid();
            IActionResult result = new OkObjectResult(valid);

            log.LogInformation($"Validated {quantity}d{die} = {valid}");

            return Task.FromResult(result);
        }
    }
}