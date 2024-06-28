using DnDGen.Api.EncounterGen.Dependencies;
using DnDGen.Api.EncounterGen.Helpers;
using DnDGen.Api.EncounterGen.Validators;
using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.EncounterGen.Functions
{
    public class GenerateFunction
    {
        private readonly ILogger _logger;
        private readonly IEncounterVerifier _verifier;
        private readonly IEncounterGenerator _generator;

        public GenerateFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<GenerateFunction>();
            _verifier = dependencyFactory.Get<IEncounterVerifier>();
            _generator = dependencyFactory.Get<IEncounterGenerator>();
        }

        [Function("GenerateFunction")]
        [OpenApiOperation(operationId: "GenerateFunctionRun", Summary = "Generate an encounter",
            Description = "Generate an encounter for the given parameters.")]
        [OpenApiParameter(name: "environment", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The environment of the encounter. Valid values: Aquatic, Civilized, Desert, Forest, Hill, Marsh, Mountain, Plains, Underground")]
        [OpenApiParameter(name: "level", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The target level of the encounter. Valid values: 1 <= L <= 30")]
        [OpenApiParameter(name: "temperature", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The temperature of the environment for the encounter. Valid values: Cold, Temperate, Warm")]
        [OpenApiParameter(name: "timeOfDay", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The time of day for the encounter. Valid values: Day, Night")]
        [OpenApiParameter(name: "allowAquatic", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Whether to allow aquatic encounters. Defaults to false.")]
        [OpenApiParameter(name: "allowUnderground", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Whether to allow underground encounters. Defaults to false")]
        [OpenApiParameter(name: "creatureTypeFilters", In = ParameterLocation.Query, Required = false, Type = typeof(string[]),
            Description = "The allowed creature types for the encounter. Providing all is the same as providing none. Valid values: Aberration, Animal, Construct, Dragon, Elemental, Fey, Giant, Humanoid, Magical Beast, Monstrous Humanoid, Ooze, Outsider, Plant, Undead, Vermin")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Encounter),
            Description = "The generated encounter")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/encounter/{temperature}/{environment}/{timeOfDay}/level/{level:int}/generate")] HttpRequestData req,
            string temperature, string environment, string timeOfDay, int level)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateFunction.Run) processed a request.");

            var spec = EncounterValidator.GetSpecifications(req, temperature, environment, timeOfDay, level);
            if (!spec.IsValid())
            {
                _logger.LogError($"Parameters are not a valid combination. Valid specification: {spec.Description}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var compatible = _verifier.ValidEncounterExists(spec);
            _logger.LogInformation($"Encounter Validity: {compatible}");
            if (!compatible)
            {
                _logger.LogError($"There are no valid encounters for the given specification: {spec.Description}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var encounter = _generator.Generate(spec);

            foreach (var character in encounter.Characters)
            {
                character.Skills = CharacterHelper.SortSkills(character.Skills);
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(encounter);
            return response;
        }
    }
}
