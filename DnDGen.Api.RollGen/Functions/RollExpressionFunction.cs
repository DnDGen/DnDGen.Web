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
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.RollGen.Functions
{
    public class RollExpressionFunction
    {
        private readonly Dice dice;

        public RollExpressionFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("RollExpressionFunction")]
        [OpenApiOperation(operationId: "RollExpressionFunctionRun", Summary = "Roll an expression",
            Description = "Computes the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The expression to compute")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public Task<IActionResult> RunV1(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/expression/roll")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (RollExpressionFunction.RunV1) processed a request.");

            var valid = QueryHelper.CheckParameters(req, log, "expression");
            if (!valid)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var expression = req.Query["expression"];

            var validRoll = dice.Roll(expression).IsValid();
            if (!validRoll)
            {
                log.LogError($"Roll {expression} is not a valid roll expression.");

                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var roll = dice.Roll(expression).AsSum();
            IActionResult result = new OkObjectResult(roll);

            log.LogInformation($"Rolled {expression} = {roll}");

            return Task.FromResult(result);
        }

        [FunctionName("RollExpressionFunctionV2")]
        [OpenApiOperation(operationId: "RollExpressionFunctionV2Run", Summary = "Roll an expression",
            Description = "Computes the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The expression to compute")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public Task<IActionResult> RunV2(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/{expression}/roll")] HttpRequest req,
            string expression, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (RollExpressionFunction.RunV2) processed a request.");

            var validRoll = dice.Roll(expression).IsValid();
            if (!validRoll)
            {
                log.LogError($"Roll {expression} is not a valid roll expression.");

                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var roll = dice.Roll(expression).AsSum();
            IActionResult result = new OkObjectResult(roll);

            log.LogInformation($"Rolled {expression} = {roll}");

            return Task.FromResult(result);
        }
    }
}
