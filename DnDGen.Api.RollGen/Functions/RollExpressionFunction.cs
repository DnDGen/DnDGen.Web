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
    public class RollExpressionFunction
    {
        private readonly Dice _dice;
        private readonly ILogger _logger;

        public RollExpressionFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<RollExpressionFunction>();
            _dice = dependencyFactory.Get<Dice>();
        }

        [Function("RollExpressionFunction")]
        [OpenApiOperation(operationId: "RollExpressionFunctionRun", Summary = "Roll an expression",
            Description = "Computes the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The expression to compute")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public async Task<HttpResponseData> RunV1([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/expression/roll")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (RollExpressionFunction.RunV1) processed a request.");

            var valid = QueryHelper.CheckParameters(req, _logger, "expression");
            if (!valid)
            {
                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var expression = req.Query["expression"];

            var validRoll = _dice.Roll(expression).IsValid();
            if (!validRoll)
            {
                _logger.LogError($"Roll {expression} is not a valid roll expression.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var roll = _dice.Roll(expression).AsSum();

            _logger.LogInformation($"Rolled {expression} = {roll}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(roll);
            return response;
        }

        //HACK: Have to put the expression in the query, instead of the path, as the expression may contain invalid path characters such as slashes.
        //URL encoding does not fix the issue. It is a known issue: https://github.com/Azure/azure-functions-host/issues/9290
        [Function("RollExpressionFunctionV2")]
        [OpenApiOperation(operationId: "RollExpressionFunctionV2Run", Summary = "Roll an expression",
            Description = "Computes the expression, including all roll values")]
        [OpenApiParameter(name: "expression", In = ParameterLocation.Query, Required = true, Type = typeof(string),
            Description = "The expression to compute")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public async Task<HttpResponseData> RunV2([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/expression/roll")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (RollExpressionFunction.RunV2) processed a request.");

            var valid = QueryHelper.CheckParameters(req, _logger, "expression");
            if (!valid)
            {
                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var expression = req.Query["expression"];

            var validRoll = _dice.Roll(expression).IsValid();
            if (!validRoll)
            {
                _logger.LogError($"Roll {expression} is not a valid roll expression.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var roll = _dice.Roll(expression).AsSum();

            _logger.LogInformation($"Rolled {expression} = {roll}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(roll);
            return response;
        }
    }
}
