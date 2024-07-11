using DnDGen.Api.CharacterGen.Models;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class CharacterValidator
    {
        public static (bool Valid, string Error, CharacterSpecifications CharacterSpecifications) GetValid(HttpRequestData request)
        {
            var spec = new CharacterSpecifications();

            var alignmentRandomizerType = request.Query["alignmentRandomizerType"] ?? AlignmentRandomizerTypeConstants.Any;
            var classNameRandomizerType = request.Query["classNameRandomizerType"] ?? ClassNameRandomizerTypeConstants.AnyPlayer;
            var levelRandomizerType = request.Query["levelRandomizerType"] ?? LevelRandomizerTypeConstants.Any;
            var baseRaceRandomizerType = request.Query["baseRaceRandomizerType"] ?? RaceRandomizerTypeConstants.BaseRace.AnyBase;
            var metaraceRandomizerType = request.Query["metaraceRandomizerType"] ?? RaceRandomizerTypeConstants.Metarace.AnyMeta;
            var abilitiesRandomizerType = request.Query["abilitiesRandomizerType"] ?? AbilitiesRandomizerTypeConstants.Raw;

            var setAlignment = request.Query["setAlignment"] ?? string.Empty;
            var setClassName = request.Query["setClassName"] ?? string.Empty;
            var validSetLevel = int.TryParse(request.Query["setLevel"], out var setLevel);
            var setBaseRace = request.Query["setBaseRace"] ?? string.Empty;
            var setMetarace = request.Query["setMetarace"] ?? string.Empty;
            var validForceMetarace = bool.TryParse(request.Query["forceMetarace"], out var forceMetarace);
            var validSetStrength = int.TryParse(request.Query["setStrength"], out var setStrength);
            var validSetConstitution = int.TryParse(request.Query["setConstitution"], out var setConstitution);
            var validSetDexterity = int.TryParse(request.Query["setDexterity"], out var setDexterity);
            var validSetIntelligence = int.TryParse(request.Query["setIntelligence"], out var setIntelligence);
            var validSetWisdom = int.TryParse(request.Query["setWisdom"], out var setWisdom);
            var validSetCharisma = int.TryParse(request.Query["setCharisma"], out var setCharisma);
            var validAllowAbilityAdjustments = bool.TryParse(request.Query["allowAbilityAdjustments"], out var allowAbilityAdjustments);

            if (!validSetLevel)
                setLevel = 0;

            if (!validForceMetarace)
                forceMetarace = false;

            if (!validSetStrength)
                setStrength = 0;

            if (!validSetConstitution)
                setConstitution = 0;

            if (!validSetDexterity)
                setDexterity = 0;

            if (!validSetIntelligence)
                setIntelligence = 0;

            if (!validSetWisdom)
                setWisdom = 0;

            if (!validSetCharisma)
                setCharisma = 0;

            if (!validAllowAbilityAdjustments)
                allowAbilityAdjustments = true;

            spec.SetAlignmentRandomizer(alignmentRandomizerType, setAlignment);
            spec.SetClassNameRandomizer(classNameRandomizerType, setClassName);
            spec.SetLevelRandomizer(levelRandomizerType, setLevel);
            spec.SetBaseRaceRandomizer(baseRaceRandomizerType, setBaseRace);
            spec.SetMetaraceRandomizer(metaraceRandomizerType, setMetarace, forceMetarace);
            spec.SetAbilitiesRandomizer(
                abilitiesRandomizerType,
                setStrength,
                setConstitution,
                setDexterity,
                setIntelligence,
                setWisdom,
                setCharisma,
                allowAbilityAdjustments);

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
