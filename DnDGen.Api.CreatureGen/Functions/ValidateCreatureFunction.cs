using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Validators;
using DnDGen.CreatureGen.Verifiers;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.CreatureGen.Functions
{
    public class ValidateCreatureFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<ValidateCreatureFunction>();
        private readonly ICreatureVerifier _creatureVerifier = dependencyFactory.Get<ICreatureVerifier>();

        [Function("ValidateCreatureFunction")]
        [OpenApiOperation(operationId: "ValidateCreatureFunctionRun", tags: ["v1"],
            Summary = "Validate parameters for creature generation",
            Description = "Validates the parameters for creature generation")]
        [OpenApiParameter(name: "creatureName",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "The creature to generate")]
        [OpenApiParameter(name: "alignment",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The desired alignment for the creature")]
        [OpenApiParameter(name: "templates",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string[]),
            Description = "The desired templates to apply to the generated creature. Templates are applied in order set in query.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the validity of the parameter combination")]
        public async Task<HttpResponseData> RunV1(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/creature/{creatureName}/validate")] HttpRequestData req,
            string creatureName)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateCreatureFunction.RunV1) processed a request.");

            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(creatureName, req);
            if (!Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.OK);
                await invalidResponse.WriteAsJsonAsync(false);
                return invalidResponse;
            }

            var valid = _creatureVerifier.VerifyCompatibility(false, CreatureSpecifications.Creature, CreatureSpecifications.Filters);

            _logger.LogInformation($"Validated Creature = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }
    }
}
