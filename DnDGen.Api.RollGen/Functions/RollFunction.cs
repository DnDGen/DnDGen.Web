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
    public class RollFunction
    {
        private readonly Dice _dice;
        private readonly ILogger _logger;

        public RollFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<RollFunction>();
            _dice = dependencyFactory.Get<Dice>();
        }

        [Function("RollFunction")]
        [OpenApiOperation(operationId: "RollFunctionRun", tags: ["v1"],
            Summary = "Roll XdY",
            Description = "Rolls the die Y quantity X times (XdY) and returns the sum")]
        [OpenApiParameter(name: "quantity",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(int),
            Description = "The Quantity to roll. Should be 1 <= Q <= 10,000")]
        [OpenApiParameter(name: "die",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(int),
            Description = "The Die to roll. Should be 1 <= D <= 10,000")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public async Task<HttpResponseData> RunV1([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/roll")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (RollFunction.RunV1) processed a request.");

            var valid = QueryHelper.CheckParameters(req, _logger, "quantity", "die");
            if (!valid)
            {
                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var quantity = Convert.ToInt32(req.Query["quantity"]);
            var die = Convert.ToInt32(req.Query["die"]);

            var validRoll = _dice.Roll(quantity).d(die).IsValid();
            if (!validRoll)
            {
                _logger.LogError($"Roll {quantity}d{die} is not a valid roll.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var roll = _dice.Roll(quantity).d(die).AsSum();

            _logger.LogInformation($"Rolled {quantity}d{die} = {roll}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(roll);
            return response;
        }

        [Function("RollFunctionV2")]
        [OpenApiOperation(operationId: "RollFunctionV2Run", tags: ["v2"],
            Summary = "Roll XdY",
            Description = "Rolls the die Y quantity X times (XdY) and returns the sum")]
        [OpenApiParameter(name: "quantity",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(int),
            Description = "The Quantity to roll. Should be 1 <= Q <= 10,000")]
        [OpenApiParameter(name: "die",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(int),
            Description = "The Die to roll. Should be 1 <= D <= 10,000")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int),
            Description = "The OK response containing the resulting roll")]
        public async Task<HttpResponseData> RunV2(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/{quantity:int}/d/{die:int}/roll")] HttpRequestData req,
            int quantity, int die)
        {
            _logger.LogInformation("C# HTTP trigger function (RollFunction.RunV2) processed a request.");

            var validRoll = _dice.Roll(quantity).d(die).IsValid();
            if (!validRoll)
            {
                _logger.LogError($"Roll {quantity}d{die} is not a valid roll.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var roll = _dice.Roll(quantity).d(die).AsSum();

            _logger.LogInformation($"Rolled {quantity}d{die} = {roll}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(roll);
            return response;
        }
    }
}
