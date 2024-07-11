using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Helpers;
using DnDGen.RollGen;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
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
        private readonly Dice _dice;
        private readonly ILogger _logger;

        public ValidateRollFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateRollFunction>();
            _dice = dependencyFactory.Get<Dice>();
        }

        [Function("ValidateRollFunction")]
        [OpenApiOperation(operationId: "ValidateRollFunctionRun", Summary = "Validate XdY",
            Description = "Validates that XdY is a valid roll")]
        [OpenApiParameter(name: "quantity", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The Quantity to roll. Should be 1 <= Q <= 10,000")]
        [OpenApiParameter(name: "die", In = ParameterLocation.Query, Required = true, Type = typeof(int),
            Description = "The Die to roll. Should be 1 <= D <= 10,000")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing whether the provided roll is valid")]
        public async Task<HttpResponseData> RunV1([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/roll/validate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateRollFunction.RunV1) processed a request.");

            var validParameters = QueryHelper.CheckParameters(req, _logger, "quantity", "die");
            if (!validParameters)
            {
                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var quantity = Convert.ToInt32(req.Query["quantity"]);
            var die = Convert.ToInt32(req.Query["die"]);

            var valid = _dice.Roll(quantity).d(die).IsValid();

            _logger.LogInformation($"Validated {quantity}d{die} = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }

        [Function("ValidateRollFunctionV2")]
        [OpenApiOperation(operationId: "ValidateRollFunctionV2Run", Summary = "Validate XdY",
            Description = "Validates that XdY is a valid roll")]
        [OpenApiParameter(name: "quantity", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The Quantity to roll. Should be 1 <= Q <= 10,000")]
        [OpenApiParameter(name: "die", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The Die to roll. Should be 1 <= D <= 10,000")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public async Task<HttpResponseData> RunV2(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/{quantity:int}/d/{die:int}/validate")] HttpRequestData req,
            int quantity, int die)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateRollFunction.RunV2) processed a request.");

            var valid = _dice.Roll(quantity).d(die).IsValid();

            _logger.LogInformation($"Validated {quantity}d{die} = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }
    }
}
