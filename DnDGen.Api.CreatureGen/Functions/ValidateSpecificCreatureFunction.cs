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
    public class ValidateSpecificCreatureFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<ValidateSpecificCreatureFunction>();
        private readonly ICreatureVerifier _creatureVerifier = dependencyFactory.Get<ICreatureVerifier>();

        [Function("ValidateSpecificCreatureFunction")]
        [OpenApiOperation(operationId: "ValidateCreatureFunctionRun", tags: ["v1"],
            Summary = "Validate parameters for creature generation",
            Description = "Validates the parameters for creature generation")]
        [OpenApiParameter(name: "creatureName",
            In = ParameterLocation.Path,
            Required = true,
            Type = typeof(string),
            Description = "The creature to generate")]
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
            _logger.LogInformation("C# HTTP trigger function (ValidateSpecificCreatureFunction.RunV1) processed a request.");

            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(creatureName, req);
            if (!Valid)
            {
                _logger.LogError($"Parameters are not valid. Error: {Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.OK);
                await invalidResponse.WriteAsJsonAsync(false);
                return invalidResponse;
            }

            var valid = _creatureVerifier.VerifyCompatibility(false, CreatureSpecifications!.Creature, null, CreatureSpecifications.Filters, CreatureSpecifications.Templates);

            _logger.LogInformation($"Validated Creature = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }
    }
}
