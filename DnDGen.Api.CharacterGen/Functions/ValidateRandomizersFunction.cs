using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Verifiers;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.CharacterGen.Functions
{
    public class ValidateRandomizersFunction
    {
        private readonly IRandomizerRepository _randomizerRepository;
        private readonly IRandomizerVerifier _randomizerVerifier;
        private readonly ILogger _logger;

        public ValidateRandomizersFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateRandomizersFunction>();
            _randomizerRepository = dependencyFactory.Get<IRandomizerRepository>();
            _randomizerVerifier = dependencyFactory.Get<IRandomizerVerifier>();
        }

        [Function("ValidateRandomizersFunction")]
        [OpenApiOperation(operationId: "ValidateRandomizersFunctionRun", Summary = "Validate randomizers",
            Description = "Validate the randomizer combination for character generation.")]
        [OpenApiParameter(name: "alignmentRandomizerType", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The type of alignment randomizer. Defaults to 'Any'. Valid values: Set, Any, Chaotic, Evil, Good, Lawful, Neutral, Non-Chaotic, Non-Evil, Non-Good, Non-Lawful, Non-Neutral")]
        [OpenApiParameter(name: "classNameRandomizerType", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The type of class name randomizer. Defaults to 'Any Player'. Valid values: Set, Any Player, Any NPC, Arcane Spellcaster, Divine Spellcaster, Non-Spellcaster, Physical Combat, Spellcaster, Stealth")]
        [OpenApiParameter(name: "levelRandomizerType", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The type of level randomizer. Defaults to 'Any'. Valid values: Set, Low, Medium, High, Very High")]
        [OpenApiParameter(name: "baseRaceRandomizerType", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The type of base race randomizer. Defaults to 'Any Base'. Valid values: Set, Any Base, Aquatic Base, Monster Base, Non-Monster Base, Non-Standard Base, Standard Base")]
        [OpenApiParameter(name: "metaraceRandomizerType", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The type of metarace randomizer. Defaults to 'Any Meta'. Valid values: Set, Any Meta, Genetic Meta, Lycanthrope Meta, No Meta, Undead Meta")]
        [OpenApiParameter(name: "setAlignment", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The specific alignment. Required if using the 'Set' alignment randomizer")]
        [OpenApiParameter(name: "setClassName", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The specific class name. Required if using the 'Set' class name randomizer")]
        [OpenApiParameter(name: "setLevel", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The specific level. Required if using the 'Set' level randomizer")]
        [OpenApiParameter(name: "setBaseRace", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The specific base race. Required if using the 'Set' base race randomizer")]
        [OpenApiParameter(name: "forceMetarace", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Sets whether the metarace of 'None' is allowed in the metarace randomizer. Defaults to 'false'")]
        [OpenApiParameter(name: "setMetarace", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The specific metarace. Required if using the 'Set' metarace randomizer")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(bool),
            Description = "The OK response containing the validity of the randomizer combination")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/character/validate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (ValidateRandomizersFunction.Run) processed a request.");

            var validatorResult = CharacterValidator.GetValid(req);
            if (!validatorResult.Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {validatorResult.Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.OK);
                await invalidResponse.WriteAsJsonAsync(validatorResult.Valid);
                return invalidResponse;
            }

            var characterSpecifications = validatorResult.CharacterSpecifications;

            var alignmentRandomizer = _randomizerRepository.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment);
            var classNameRandomizer = _randomizerRepository.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName);
            var levelRandomizer = _randomizerRepository.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel);
            var baseRaceRandomizer = _randomizerRepository.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace);
            var metaraceRandomizer = _randomizerRepository.GetMetaraceRandomizer(
                characterSpecifications.MetaraceRandomizerType,
                characterSpecifications.ForceMetarace,
                characterSpecifications.SetMetarace);

            var compatible = _randomizerVerifier.VerifyCompatibility(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer);
            _logger.LogInformation($"Randomizer Validity: {compatible}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(compatible);
            return response;
        }
    }
}
