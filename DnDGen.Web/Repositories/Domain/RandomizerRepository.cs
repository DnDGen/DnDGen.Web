using CharacterGen.Alignments;
using CharacterGen.Randomizers.Abilities;
using CharacterGen.Randomizers.Alignments;
using CharacterGen.Randomizers.CharacterClasses;
using CharacterGen.Randomizers.Races;
using DnDGen.Web.App_Start.Factories;

namespace DnDGen.Web.Repositories.Domain
{
    public class RandomizerRepository : IRandomizerRepository
    {
        private JustInTimeFactory runtimeFactory;

        public RandomizerRepository(JustInTimeFactory runtimeFactory)
        {
            this.runtimeFactory = runtimeFactory;
        }

        public IAlignmentRandomizer GetAlignmentRandomizer(string alignmentRandomizerType, string setAlignment)
        {
            if (alignmentRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<IAlignmentRandomizer>(alignmentRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetAlignmentRandomizer>();
            setRandomizer.SetAlignment = new Alignment(setAlignment);

            return setRandomizer;
        }

        public RaceRandomizer GetBaseRaceRandomizer(string baseRaceRandomizerType, string setBaseRace)
        {
            if (baseRaceRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<RaceRandomizer>(baseRaceRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetBaseRaceRandomizer>();
            setRandomizer.SetBaseRace = setBaseRace;

            return setRandomizer;
        }

        public IClassNameRandomizer GetClassNameRandomizer(string classNameRandomizerType, string setClassName)
        {
            if (classNameRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<IClassNameRandomizer>(classNameRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetClassNameRandomizer>();
            setRandomizer.SetClassName = setClassName;

            return setRandomizer;
        }

        public ILevelRandomizer GetLevelRandomizer(string levelRandomizerType, int setLevel, bool allowAdjustments)
        {
            if (levelRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<ILevelRandomizer>(levelRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetLevelRandomizer>();
            setRandomizer.SetLevel = setLevel;
            setRandomizer.AllowAdjustments = allowAdjustments;

            return setRandomizer;
        }

        public RaceRandomizer GetMetaraceRandomizer(string metaraceRandomizerType, bool forceMetarace, string setMetarace)
        {
            if (metaraceRandomizerType == RandomizerTypeConstants.Set)
            {
                var setRandomizer = runtimeFactory.Create<ISetMetaraceRandomizer>();
                setRandomizer.SetMetarace = setMetarace;

                return setRandomizer;
            }

            var randomizer = runtimeFactory.Create<RaceRandomizer>(metaraceRandomizerType);

            if (randomizer is IForcableMetaraceRandomizer)
            {
                var forcableRandomizer = randomizer as IForcableMetaraceRandomizer;
                forcableRandomizer.ForceMetarace = forceMetarace;
            }

            return randomizer;
        }

        public IAbilitiesRandomizer GetAbilitiesRandomizer(string statRandomizerType, int setStrength, int setConstitution, int setDexterity, int setIntelligence, int setWisdom, int setCharisma, bool allowAdjustments)
        {
            if (statRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<IAbilitiesRandomizer>(statRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetAbilitiesRandomizer>();
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