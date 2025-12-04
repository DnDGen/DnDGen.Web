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
    public class GenerateCreatureFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
    {
        private readonly ILogger _logger = loggerFactory.CreateLogger<GenerateCreatureFunction>();
        private readonly ICreatureVerifier _creatureVerifier = dependencyFactory.Get<ICreatureVerifier>();
        private readonly ICreatureGenerator _creatureGenerator = dependencyFactory.Get<ICreatureGenerator>();

        [Function("GenerateCreatureFunction")]
        [OpenApiOperation(operationId: "GenerateCreatureFunctionRun", tags: ["v1"],
            Summary = "Generate a creature",
            Description = "Generate a creature")]
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
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Creature),
            Description = "The generated creature")]
        public async Task<HttpResponseData> RunV1(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/creature/{creatureName}/generate")] HttpRequestData req,
            string creatureName)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateCreatureFunction.RunV1) processed a request.");

            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(creatureName, req);
            if (!Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var compatible = _creatureVerifier.VerifyCompatibility(false, CreatureSpecifications!.Creature, CreatureSpecifications.Filters);
            _logger.LogInformation($"Compatible Creature = {compatible}");

            if (!compatible)
            {
                _logger.LogError("Creature parameters are not a valid combination.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var templates = CreatureSpecifications.Filters?.CleanTemplates.ToArray() ?? [];

            var creature = await _creatureGenerator.GenerateAsync(false, creatureName, templates: templates);

            _logger.LogInformation($"Generated Creature: {creature.Summary}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteDnDGenModelAsJsonAsync(creature);
            return response;
        }
    }
}
