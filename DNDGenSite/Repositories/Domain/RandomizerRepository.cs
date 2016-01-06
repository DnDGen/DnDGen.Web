using CharacterGen.Common.Alignments;
using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Randomizers.Stats;
using DNDGenSite.App_Start.Factories;
using System;

namespace DNDGenSite.Repositories.Domain
{
    public class RandomizerRepository : IRandomizerRepository
    {
        private RuntimeFactory runtimeFactory;

        public RandomizerRepository(RuntimeFactory runtimeFactory)
        {
            this.runtimeFactory = runtimeFactory;
        }

        public IAlignmentRandomizer GetAlignmentRandomizer(String alignmentRandomizerType, String setAlignment)
        {
            if (alignmentRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<IAlignmentRandomizer>(alignmentRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetAlignmentRandomizer>();
            setRandomizer.SetAlignment = new Alignment(setAlignment);

            return setRandomizer;
        }

        public RaceRandomizer GetBaseRaceRandomizer(String baseRaceRandomizerType, String setBaseRace)
        {
            if (baseRaceRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<RaceRandomizer>(baseRaceRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetBaseRaceRandomizer>();
            setRandomizer.SetBaseRace = setBaseRace;

            return setRandomizer;
        }

        public IClassNameRandomizer GetClassNameRandomizer(String classNameRandomizerType, String setClassName)
        {
            if (classNameRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<IClassNameRandomizer>(classNameRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetClassNameRandomizer>();
            setRandomizer.SetClassName = setClassName;

            return setRandomizer;
        }

        public ILevelRandomizer GetLevelRandomizer(String levelRandomizerType, Int32 setLevel, Boolean allowAdjustments)
        {
            if (levelRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<ILevelRandomizer>(levelRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetLevelRandomizer>();
            setRandomizer.SetLevel = setLevel;
            setRandomizer.AllowAdjustments = allowAdjustments;

            return setRandomizer;
        }

        public RaceRandomizer GetMetaraceRandomizer(String metaraceRandomizerType, Boolean forceMetarace, String setMetarace)
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

        public IStatsRandomizer GetStatsRandomizer(String statRandomizerType, Int32 setStrength, Int32 setConstitution, Int32 setDexterity, Int32 setIntelligence, Int32 setWisdom, Int32 setCharisma, Boolean allowAdjustments)
        {
            if (statRandomizerType != RandomizerTypeConstants.Set)
                return runtimeFactory.Create<IStatsRandomizer>(statRandomizerType);

            var setRandomizer = runtimeFactory.Create<ISetStatsRandomizer>();
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