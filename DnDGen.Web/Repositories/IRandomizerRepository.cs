using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Randomizers.Stats;
using System;

namespace DnDGen.Web.Repositories
{
    public interface IRandomizerRepository
    {
        IAlignmentRandomizer GetAlignmentRandomizer(String alignmentRandomizerType, String setAlignment);
        IClassNameRandomizer GetClassNameRandomizer(String classNameRandomizerType, String setClassName);
        ILevelRandomizer GetLevelRandomizer(String levelRandomizerType, Int32 setLevel, Boolean allowAdjustments);
        RaceRandomizer GetBaseRaceRandomizer(String baseRaceRandomizerType, String setBaseRace);
        RaceRandomizer GetMetaraceRandomizer(String metaraceRandomizerType, Boolean forceMetarace, String setMetarace);
        IStatsRandomizer GetStatsRandomizer(String statRandomizerType, Int32 setStrength, Int32 setConstitution, Int32 setDexterity, Int32 setIntelligence, Int32 setWisdom, Int32 setCharisma, Boolean allowAdjustments);
    }
}
