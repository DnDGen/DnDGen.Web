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
    public class ValidateRandomCreatureFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<ValidateRandomCreatureFunction>();
        private readonly ICreatureVerifier _creatureVerifier = dependencyFactory.Get<ICreatureVerifier>();

        [Function("ValidateRandomCreatureFunction")]
        [OpenApiOperation(operationId: "ValidateRandomCreatureFunctionRun", tags: ["v1"],
            Summary = "Validate parameters for random creature generation",
            Description = "Validate parameters for random creature generation")]
        [OpenApiParameter(name: "templates",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string[]),
            Description = "The desired templates to apply to the generated creature. Templates are applied in the order set in the query.")]
        [OpenApiParameter(name: "alignment",
            In = ParameterLocation.Query,
            Required = true,
            Type = typeof(string),
            Description = "The desired alignment of the creature")]
        [OpenApiParameter(name: "type",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string[]),
            Description = "The desired type or subtype of the generated creature.")]
        [OpenApiParameter(name: "cr",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string[]),
            Description = "The desired Challenge Rating of the generated creature.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the validity of the parameter combination")]
        public async Task<HttpResponseData> RunV1([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/creature/random/validate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateRandomCreatureFunction.RunV1) processed a request.");

            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, req);
            if (!Valid)
            {
                _logger.LogError($"Parameters are not valid. Error: {Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.OK);
                await invalidResponse.WriteAsJsonAsync(false);
                return invalidResponse;
            }

            var valid = _creatureVerifier.VerifyCompatibility(false, CreatureSpecifications!.Creature, CreatureSpecifications.Filters);

            _logger.LogInformation($"Compatible Parameters = {valid}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(valid);
            return response;
        }
    }
}
