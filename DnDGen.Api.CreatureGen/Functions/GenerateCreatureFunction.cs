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
        [OpenApiParameter(name: "asCharacter",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(bool),
            Description = "Whether to generate the creature as the basis for a character. Defaults to false")]
        [OpenApiParameter(name: "alignment",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The desired alignment for the creature")]
        [OpenApiParameter(name: "creatureType",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The desired type for the generated creature")]
        [OpenApiParameter(name: "challengeRating",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The desired challenge rating for the generated creature")]
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
            _logger.LogInformation("C# HTTP trigger function (ValidateCreatureFunction.RunV1) processed a request.");

            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(creatureName, req);
            if (!Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.OK);
                await invalidResponse.WriteAsJsonAsync(Valid);
                return invalidResponse;
            }

            var compatible = _creatureVerifier.VerifyCompatibility(CreatureSpecifications.AsCharacter, CreatureSpecifications.Creature, CreatureSpecifications.Filters);
            _logger.LogInformation($"Compatible Creature = {compatible}");

            if (!compatible)
            {
                _logger.LogError("Creature parameters are not a valid combination.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var templates = CreatureSpecifications.Filters?.CleanTemplates.ToArray() ?? [];

            // ??? - Should I handle ability generation? If the API allows `asCharacter`, then I think so.
            // But if you're generating the basis for a character, why not just use the character generator?
            // But even if not a character, you might want to have specific abilities for certain creatures.
            // But ALSO also, altering abilities for a creature advances them and changes their CR,
            // and creaturegen doesn't adjust the CR based on the abilities just yet.
            // So, won't support for now

            var creature = _creatureGenerator.GenerateAsync(CreatureSpecifications.AsCharacter, creatureName, templates: templates);

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteDnDGenModelAsJsonAsync(creature);
            return response;
        }
    }
}
