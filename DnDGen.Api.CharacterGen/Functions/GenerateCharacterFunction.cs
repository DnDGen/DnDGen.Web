using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Helpers;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Characters;
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
    public class GenerateCharacterFunction(ILoggerFactory loggerFactory, IDependencyFactory dependencyFactory)
    {
        private readonly IRandomizerRepository _randomizerRepository = dependencyFactory.Get<IRandomizerRepository>();
        private readonly ICharacterGenerator _characterGenerator = dependencyFactory.Get<ICharacterGenerator>();
        private readonly IRandomizerVerifier _randomizerVerifier = dependencyFactory.Get<IRandomizerVerifier>();
        private readonly ILogger _logger = loggerFactory.CreateLogger<GenerateCharacterFunction>();

        [Function("GenerateCharacterFunction")]
        [OpenApiOperation(operationId: "GenerateCharacterFunctionRun", tags: ["v1"],
            Summary = "Generate character",
            Description = "Generate a random character with the specified randomizers.")]
        [OpenApiParameter(name: "alignmentRandomizerType",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The type of alignment randomizer. Defaults to 'Any'. Valid values: Set, Any, Chaotic, Evil, Good, Lawful, Neutral, Non-Chaotic, Non-Evil, Non-Good, Non-Lawful, Non-Neutral")]
        [OpenApiParameter(name: "classNameRandomizerType",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The type of class name randomizer. Defaults to 'Any Player'. Valid values: Set, Any Player, Any NPC, Arcane Spellcaster, Divine Spellcaster, Non-Spellcaster, Physical Combat, Spellcaster, Stealth")]
        [OpenApiParameter(name: "levelRandomizerType",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The type of level randomizer. Defaults to 'Any'. Valid values: Set, Low, Medium, High, Very High")]
        [OpenApiParameter(name: "baseRaceRandomizerType",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The type of base race randomizer. Defaults to 'Any Base'. Valid values: Set, Any Base, Aquatic Base, Monster Base, Non-Monster Base, Non-Standard Base, Standard Base")]
        [OpenApiParameter(name: "metaraceRandomizerType",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The type of metarace randomizer. Defaults to 'Any Meta'. Valid values: Set, Any Meta, Genetic Meta, Lycanthrope Meta, No Meta, Undead Meta")]
        [OpenApiParameter(name: "abilitiesRandomizerType",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The type of abilities randomizer. Defaults to 'Raw'. Valid values: Set, Average, Best of Four, Good, Heroic, Ones as Sixes, Poor, Raw, 2d10")]
        [OpenApiParameter(name: "setAlignment",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The specific alignment. Required if using the 'Set' alignment randomizer")]
        [OpenApiParameter(name: "setClassName",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The specific class name. Required if using the 'Set' class name randomizer")]
        [OpenApiParameter(name: "setLevel",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The specific level. Required if using the 'Set' level randomizer")]
        [OpenApiParameter(name: "setBaseRace",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The specific base race. Required if using the 'Set' base race randomizer")]
        [OpenApiParameter(name: "forceMetarace",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(bool),
            Description = "Sets whether the metarace of 'None' is allowed in the metarace randomizer. Defaults to 'false'")]
        [OpenApiParameter(name: "setMetarace",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(string),
            Description = "The specific metarace. Required if using the 'Set' metarace randomizer")]
        [OpenApiParameter(name: "allowAbilityAdjustments",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(bool),
            Description = "Sets whether racial modifiers can adjust abilities. Defaults to 'true'")]
        [OpenApiParameter(name: "setStrength",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The specific Strength score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setConstitution",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The specific Constitution score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setDexterity",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The specific Dexterity score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setIntelligence",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The specific Intelligence score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setWisdom",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The specific Wisdom score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setCharisma",
            In = ParameterLocation.Query,
            Required = false,
            Type = typeof(int),
            Description = "The specific Charisma score. Required if using the 'Set' abilities randomizer")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Character),
            Description = "The OK response containing the generated item")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/character/generate")] HttpRequestData req)
        {
            _logger.LogInformation("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");

            var (Valid, Error, CharacterSpecifications) = CharacterValidator.GetValid(req);
            if (!Valid)
            {
                _logger.LogError($"Parameters are not a valid combination. Error: {Error}");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var characterSpecifications = CharacterSpecifications;

            var alignmentRandomizer = _randomizerRepository.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment);
            var classNameRandomizer = _randomizerRepository.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName);
            var levelRandomizer = _randomizerRepository.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel);
            var baseRaceRandomizer = _randomizerRepository.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace);
            var metaraceRandomizer = _randomizerRepository.GetMetaraceRandomizer(
                characterSpecifications.MetaraceRandomizerType,
                characterSpecifications.ForceMetarace,
                characterSpecifications.SetMetarace);
            var abilitiesRandomizer = _randomizerRepository.GetAbilitiesRandomizer(
                characterSpecifications.AbilitiesRandomizerType,
                characterSpecifications.SetStrength,
                characterSpecifications.SetConstitution,
                characterSpecifications.SetDexterity,
                characterSpecifications.SetIntelligence,
                characterSpecifications.SetWisdom,
                characterSpecifications.SetCharisma,
                characterSpecifications.AllowAbilityAdjustments);

            var compatible = _randomizerVerifier.VerifyCompatibility(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer);
            if (!compatible)
            {
                _logger.LogError("Randomizers are not a valid combination.");

                var invalidResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                return invalidResponse;
            }

            var character = _characterGenerator.GenerateWith(
                alignmentRandomizer,
                classNameRandomizer,
                levelRandomizer,
                baseRaceRandomizer,
                metaraceRandomizer,
                abilitiesRandomizer);

            character.Skills = CharacterHelper.SortSkills(character.Skills);

            _logger.LogInformation($"Generated Character: {character.Summary}");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteDnDGenModelAsJsonAsync(character);
            return response;
        }
    }
}
