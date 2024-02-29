using DnDGen.Api.CharacterGen.Models;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using Microsoft.AspNetCore.Http;
using System;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class CharacterValidator
    {
        public static (bool Valid, string Error, CharacterSpecifications CharacterSpecifications) GetValid(HttpRequest request)
        {
            var spec = new CharacterSpecifications();

            var alignmentRandomizerType = (string)request.Query["alignmentRandomizerType"] ?? AlignmentRandomizerTypeConstants.Any;
            var classNameRandomizerType = (string)request.Query["classNameRandomizerType"] ?? ClassNameRandomizerTypeConstants.AnyPlayer;
            var levelRandomizerType = (string)request.Query["levelRandomizerType"] ?? LevelRandomizerTypeConstants.Any;
            var baseRaceRandomizerType = (string)request.Query["baseRaceRandomizerType"] ?? RaceRandomizerTypeConstants.BaseRace.AnyBase;
            var metaraceRandomizerType = (string)request.Query["metaraceRandomizerType"] ?? RaceRandomizerTypeConstants.Metarace.AnyMeta;
            var abilitiesRandomizerType = (string)request.Query["abilitiesRandomizerType"] ?? AbilitiesRandomizerTypeConstants.Raw;

            var setAlignment = (string)request.Query["setAlignment"];
            var setClassName = (string)request.Query["setClassName"];
            var setLevel = Convert.ToInt32(request.Query["setLevel"]);
            var setBaseRace = (string)request.Query["setBaseRace"];
            var setMetarace = (string)request.Query["setMetarace"];
            var validForceMetarace = bool.TryParse(request.Query["forceMetarace"], out var forceMetarace);
            var setStrength = Convert.ToInt32(request.Query["setStrength"]);
            var setConstitution = Convert.ToInt32(request.Query["setConstitution"]);
            var setDexterity = Convert.ToInt32(request.Query["setDexterity"]);
            var setIntelligence = Convert.ToInt32(request.Query["setIntelligence"]);
            var setWisdom = Convert.ToInt32(request.Query["setWisdom"]);
            var setCharisma = Convert.ToInt32(request.Query["setCharisma"]);
            var allowAbilityAdjustments = Convert.ToBoolean(request.Query["allowAbilityAdjustments"]);

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

            if (!validForceMetarace)
                return (false, "forceMetarace must be true or false", spec);

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
