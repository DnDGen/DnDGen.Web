using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Helpers;
using DnDGen.Api.CharacterGen.Repositories;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Generators.Characters;
using DnDGen.CharacterGen.Verifiers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Threading.Tasks;

namespace DnDGen.Api.CharacterGen.Functions
{
    public class GenerateCharacterFunction
    {
        private readonly IRandomizerRepository randomizerRepository;
        private readonly ICharacterGenerator characterGenerator;
        private readonly IRandomizerVerifier randomizerVerifier;

        public GenerateCharacterFunction(IDependencyFactory dependencyFactory)
        {
            randomizerRepository = dependencyFactory.Get<IRandomizerRepository>();
            characterGenerator = dependencyFactory.Get<ICharacterGenerator>();
            randomizerVerifier = dependencyFactory.Get<IRandomizerVerifier>();
        }

        [FunctionName("GenerateCharacterFunction")]
        [OpenApiOperation(operationId: "GenerateCharacterFunctionRun", Summary = "Generate character",
            Description = "Generate a random character with the specified randomizers.")]
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
        [OpenApiParameter(name: "abilitiesRandomizerType", In = ParameterLocation.Query, Required = false, Type = typeof(string),
            Description = "The type of abilities randomizer. Defaults to 'Raw'. Valid values: Set, Average, Best of Four, Good, Heroic, Ones as Sixes, Poor, Raw, 2d10")]
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
        [OpenApiParameter(name: "allowAbilityAdjustments", In = ParameterLocation.Query, Required = false, Type = typeof(bool),
            Description = "Sets whether racial modifiers can adjust abilities. Defaults to 'true'")]
        [OpenApiParameter(name: "setStrength", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The specific Strength score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setConstitution", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The specific Constitution score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setDexterity", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The specific Dexterity score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setIntelligence", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The specific Intelligence score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setWisdom", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The specific Wisdom score. Required if using the 'Set' abilities randomizer")]
        [OpenApiParameter(name: "setCharisma", In = ParameterLocation.Query, Required = false, Type = typeof(int),
            Description = "The specific Charisma score. Required if using the 'Set' abilities randomizer")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Character),
            Description = "The OK response containing the generated item")]
        public Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/character/generate")] HttpRequest req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function (GenerateCharacterFunction.Run) processed a request.");

            var validatorResult = CharacterValidator.GetValid(req);
            if (!validatorResult.Valid)
            {
                log.LogError($"Parameters are not a valid combination. Error: {validatorResult.Error}");
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var characterSpecifications = validatorResult.CharacterSpecifications;

            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer(characterSpecifications.AlignmentRandomizerType, characterSpecifications.SetAlignment);
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer(characterSpecifications.ClassNameRandomizerType, characterSpecifications.SetClassName);
            var levelRandomizer = randomizerRepository.GetLevelRandomizer(characterSpecifications.LevelRandomizerType, characterSpecifications.SetLevel);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer(characterSpecifications.BaseRaceRandomizerType, characterSpecifications.SetBaseRace);
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer(
                characterSpecifications.MetaraceRandomizerType,
                characterSpecifications.ForceMetarace,
                characterSpecifications.SetMetarace);
            var abilitiesRandomizer = randomizerRepository.GetAbilitiesRandomizer(
                characterSpecifications.AbilitiesRandomizerType,
                characterSpecifications.SetStrength,
                characterSpecifications.SetConstitution,
                characterSpecifications.SetDexterity,
                characterSpecifications.SetIntelligence,
                characterSpecifications.SetWisdom,
                characterSpecifications.SetCharisma,
                characterSpecifications.AllowAbilityAdjustments);

            var compatible = randomizerVerifier.VerifyCompatibility(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer);
            if (!compatible)
            {
                log.LogError("Randomizers are not a valid combination.");
                IActionResult badResult = new BadRequestResult();
                return Task.FromResult(badResult);
            }

            var character = characterGenerator.GenerateWith(
                alignmentRandomizer,
                classNameRandomizer,
                levelRandomizer,
                baseRaceRandomizer,
                metaraceRandomizer,
                abilitiesRandomizer);

            character.Skills = CharacterHelper.SortSkills(character.Skills);

            log.LogInformation($"Generated Character: {character.Summary}");

            IActionResult result = new OkObjectResult(character);
            return Task.FromResult(result);
        }
    }
}
