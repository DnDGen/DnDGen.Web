using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Helpers;
using DnDGen.RollGen;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.RollGen.Functions
{
    public class ValidateExpressionFunction
    {
        private readonly Dice _dice;
        private readonly ILogger _logger;

        public ValidateExpressionFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateExpressionFunction>();
            _dice = dependencyFactory.Get<Dice>();
        }

        [Function("ValidateExpressionFunction")]
        [OpenApiOperation(operationId: "ValidateExpressionFunctionRun", Summary = "Validate an expression",
            Description = "Validates the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The expression to validate")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing whether the provided expression is valid")]
        public async Task<HttpResponseData> RunV1([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/expression/validate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateExpressionFunction.RunV1) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, _logger, "expression");
            if (!validParameters)
            {
                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var expression = req.Query["expression"];

            var valid = _dice.Roll(expression).IsValid();

            _logger.LogInformation($"Validated {expression} = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }

        //HACK: Have to put the expression in the query, instead of the path, as the expression may contain invalid path characters such as slashes.
        //URL encoding does not fix the issue. It is a known issue: https://github.com/Azure/azure-functions-host/issues/9290
        [Function("ValidateExpressionFunctionV2")]
        [OpenApiOperation(operationId: "ValidateExpressionFunctionV2Run", Summary = "Roll an expression",
            Description = "Computes the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The expression to compute")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public async Task<HttpResponseData> RunV2([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/expression/validate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateExpressionFunction.RunV2) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, _logger, "expression");
            if (!validParameters)
            {
                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var expression = req.Query["expression"];

            var valid = _dice.Roll(expression).IsValid();

            _logger.LogInformation($"Validated {expression} = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }
    }
}
