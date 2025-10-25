using DnDGen.Api.CharacterGen.Models;
using DnDGen.CharacterGen.Abilities.Randomizers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.Alignments.Randomizers;
using DnDGen.CharacterGen.CharacterClasses.Randomizers.ClassNames;
using DnDGen.CharacterGen.CharacterClasses.Randomizers.Levels;
using DnDGen.CharacterGen.Races.Randomizers;
using DnDGen.CharacterGen.Races.Randomizers.BaseRaces;
using DnDGen.CharacterGen.Races.Randomizers.Metaraces;
using DnDGen.Infrastructure.Generators;

namespace DnDGen.Api.CharacterGen.Repositories
{
    public class RandomizerRepository(JustInTimeFactory justInTimeFactory) : IRandomizerRepository
    {
        public IAlignmentRandomizer GetAlignmentRandomizer(string alignmentRandomizerType, string setAlignment)
        {
            if (alignmentRandomizerType != RandomizerTypeConstants.Set)
                return justInTimeFactory.Build<IAlignmentRandomizer>(alignmentRandomizerType);

            var setRandomizer = justInTimeFactory.Build<ISetAlignmentRandomizer>();
            setRandomizer.SetAlignment = new Alignment(setAlignment);

            return setRandomizer;
        }

        public RaceRandomizer GetBaseRaceRandomizer(string baseRaceRandomizerType, string setBaseRace)
        {
            if (baseRaceRandomizerType != RandomizerTypeConstants.Set)
                return justInTimeFactory.Build<RaceRandomizer>(baseRaceRandomizerType);

            var setRandomizer = justInTimeFactory.Build<ISetBaseRaceRandomizer>();
            setRandomizer.SetBaseRace = setBaseRace;

            return setRandomizer;
        }

        public IClassNameRandomizer GetClassNameRandomizer(string classNameRandomizerType, string setClassName)
        {
            if (classNameRandomizerType != RandomizerTypeConstants.Set)
                return justInTimeFactory.Build<IClassNameRandomizer>(classNameRandomizerType);

            var setRandomizer = justInTimeFactory.Build<ISetClassNameRandomizer>();
            setRandomizer.SetClassName = setClassName;

            return setRandomizer;
        }

        public ILevelRandomizer GetLevelRandomizer(string levelRandomizerType, int setLevel)
        {
            if (levelRandomizerType != RandomizerTypeConstants.Set)
                return justInTimeFactory.Build<ILevelRandomizer>(levelRandomizerType);

            var setRandomizer = justInTimeFactory.Build<ISetLevelRandomizer>();
            setRandomizer.SetLevel = setLevel;

            return setRandomizer;
        }

        public RaceRandomizer GetMetaraceRandomizer(string metaraceRandomizerType, bool forceMetarace, string setMetarace)
        {
            if (metaraceRandomizerType == RandomizerTypeConstants.Set)
            {
                var setRandomizer = justInTimeFactory.Build<ISetMetaraceRandomizer>();
                setRandomizer.SetMetarace = setMetarace;

                return setRandomizer;
            }

            var randomizer = justInTimeFactory.Build<RaceRandomizer>(metaraceRandomizerType);

            if (randomizer is IForcableMetaraceRandomizer)
            {
                var forcableRandomizer = randomizer as IForcableMetaraceRandomizer;
                forcableRandomizer!.ForceMetarace = forceMetarace;
            }

            return randomizer;
        }

        public IAbilitiesRandomizer GetAbilitiesRandomizer(string statRandomizerType, int setStrength, int setConstitution, int setDexterity, int setIntelligence, int setWisdom, int setCharisma, bool allowAdjustments)
        {
            if (statRandomizerType != RandomizerTypeConstants.Set)
                return justInTimeFactory.Build<IAbilitiesRandomizer>(statRandomizerType);

            var setRandomizer = justInTimeFactory.Build<ISetAbilitiesRandomizer>();
            setRandomizer.SetStrength = setStrength;
            setRandomizer.SetConstitution = setConstitution;
            setRandomizer.SetDexterity = setDexterity;
            setRandomizer.SetIntelligence = setIntelligence;
            setRandomizer.SetWisdom = setWisdom;
            setRandomizer.SetCharisma = setCharisma;
            setRandomizer.AllowAdjustments = allowAdjustments;

            return setRandomizer;
        }
    }
}