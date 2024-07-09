using DnDGen.Api.DungeonGen.Dependencies;
using DnDGen.Api.DungeonGen.Helpers;
using DnDGen.Api.DungeonGen.Validators;
using DnDGen.DungeonGen.Generators;
using DnDGen.DungeonGen.Models;
using DnDGen.EncounterGen.Generators;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DnDGen.Api.DungeonGen.Functions
{
    public class GenerateFromHallFunction
    {
        private readonly ILogger _logger;
        private readonly IEncounterVerifier _verifier;
        private readonly IDungeonGenerator _generator;

        public GenerateFromHallFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<GenerateFromHallFunction>();
            _verifier = dependencyFactory.Get<IEncounterVerifier>();
            _generator = dependencyFactory.Get<IDungeonGenerator>();
        }

        [Function("GenerateFromHallFunction")]
        [OpenApiOperation(operationId: "GenerateFromHallFunctionRun", Summary = "Generate an area of a dungeon, starting at a hall",
            Description = "Generate an area of a dungeon, starting at a hall, for the given parameters.")]
        [OpenApiParameter(name: "dungeonLevel", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The physical level of the dungeon")]
        [OpenApiParameter(name: "environment", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The environment of the dungeon. Valid values: Aquatic, Civilized, Desert, Forest, Hill, Marsh, Mountain, Plains, Underground")]
        [OpenApiParameter(name: "partyLevel", In = ParameterLocation.Path, Required = true, Type = typeof(int),
            Description = "The level of the party in the dungeon. Valid values: 1 <= L <= 30")]
        [OpenApiParameter(name: "temperature", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The temperature of the environment for the dungeon. Valid values: Cold, Temperate, Warm")]
        [OpenApiParameter(name: "timeOfDay", In = ParameterLocation.Path, Required = true, Type = typeof(string),
            Description = "The time of day for the dungeon. Valid values: Day, Night")]
        [OpenApiParameter(name: "allowAquatic", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Whether to allow aquatic encounters. Defaults to false.")]
        [OpenApiParameter(name: "allowUnderground", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Whether to allow underground encounters. Defaults to false")]
        [OpenApiParameter(name: "creatureTypeFilters", In = ParameterLocation.Query, Required = false, Type = typeof(string[]),
            Description = "The allowed creature types for encounters. Providing all is the same as providing none. Valid values: Aberration, Animal, Construct, Dragon, Elemental, Fey, Giant, Humanoid, Magical Beast, Monstrous Humanoid, Ooze, Outsider, Plant, Undead, Vermin")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Area[]),
            Description = "The generated areas of the dungeon")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/dungeon/level/{dungeonLevel:int}/hall/{temperature}/{environment}/{timeOfDay}/level/{partyLevel:int}/generate")] HttpRequestData req,
            int dungeonLevel, string temperature, string environment, string timeOfDay, int partyLevel)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateFromHallFunction.Run) processed a request.");

            var spec = EncounterValidator.GetSpecifications(req, temperature, environment, timeOfDay, partyLevel);
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

            var areas = _generator.GenerateFromHall(dungeonLevel, spec);

            var characters = areas.SelectMany(a => a.Contents.Encounters).SelectMany(e => e.Characters)
                .Union(areas.SelectMany(a => a.Contents.Pool?.Encounter?.Characters ?? []));

            foreach (var character in characters)
            {
                character.Skills = CharacterHelper.SortSkills(character.Skills);
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(areas);
            return response;
        }
    }
}
