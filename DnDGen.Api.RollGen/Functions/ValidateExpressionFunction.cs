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
    public class ValidateExpressionFunction
    {
        private readonly Dice dice;

        public ValidateExpressionFunction(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [FunctionName("ValidateExpressionFunction")]
        [OpenApiOperation(operationId: "ValidateExpressionFunctionRun", Summary = "Validate an expression",
            Description = "Validates the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The expression to validate")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing whether the provided expression is valid")]
        public Task<IActionResult> RunV1(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/expression/validate")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (ValidateExpressionFunction.RunV1) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, log, "expression");
            if (!validParameters)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var expression = req.Query["expression"];

            var valid = dice.Roll(expression).IsValid();
            IActionResult result = new OkObjectResult(valid);

            log.LogInformation($"Validated {expression} = {valid}");

            return Task.FromResult(result);
        }

        //HACK: Have to put the expression in the query, instead of the path, as the expression may contain invalid path characters such as slashes.
        //URL encoding does not fix the issue. It is a known issue: https://github.com/Azure/azure-functions-host/issues/9290
        [FunctionName("ValidateExpressionFunctionV2")]
        [OpenApiOperation(operationId: "ValidateExpressionFunctionV2Run", Summary = "Roll an expression",
            Description = "Computes the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The expression to compute")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public Task<IActionResult> RunV2(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/expression/validate")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (ValidateExpressionFunction.RunV2) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, log, "expression");
            if (!validParameters)
            {
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var expression = req.Query["expression"];

            var valid = dice.Roll(expression).IsValid();
            IActionResult result = new OkObjectResult(valid);

            log.LogInformation($"Validated {expression} = {valid}");

            return Task.FromResult(result);
        }
    }
}
