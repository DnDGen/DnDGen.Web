using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Validators;
using DnDGen.CreatureGen.Creatures;
using DnDGen.CreatureGen.Generators.Creatures;
using DnDGen.CreatureGen.Verifiers;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.CreatureGen.Functions
{
    public class GenerateRandomCreatureFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<GenerateRandomCreatureFunction>();
        private readonly ICreatureVerifier _creatureVerifier = dependencyFactory.Get<ICreatureVerifier>();
        private readonly ICreatureGenerator _creatureGenerator = dependencyFactory.Get<ICreatureGenerator>();

        [Function("GenerateRandomCreatureFunction")]
        [OpenApiOperation(operationId: "GenerateRandomCreatureFunctionRun", tags: ["v1"],
            Summary = "Generate a random creature",
            Description = "Generate a random creature")]
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
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Creature),
            Description = "The generated creature")]
        public async Task<HttpResponseData> RunV1([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/creature/random/generate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");

            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, req);
            if (!Valid)
            {
                _logger.LogError($"Parameters are not valid. Error: {Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var compatible = _creatureVerifier.VerifyCompatibility(false, CreatureSpecifications!.Creature, CreatureSpecifications.Filters);
            _logger.LogInformation($"Compatible Parameters = {compatible}");

            if (!compatible)
            {
                _logger.LogError("Creature parameters are not compatible.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var creature = await _creatureGenerator.GenerateRandomAsync(false, filters: CreatureSpecifications.Filters);

            _logger.LogInformation($"Generated Creature: {creature.Summary}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteDnDGenModelAsJsonAsync(creature);
            return response;
        }
    }
}
