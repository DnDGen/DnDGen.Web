using DnDGen.CharacterGen.Abilities.Randomizers;
using DnDGen.CharacterGen.Alignments.Randomizers;
using DnDGen.CharacterGen.CharacterClasses.Randomizers.ClassNames;
using DnDGen.CharacterGen.CharacterClasses.Randomizers.Levels;
using DnDGen.CharacterGen.Races.Randomizers;

namespace DnDGen.Api.CharacterGen.Repositories
{
    public interface IRandomizerRepository
    {
        IAlignmentRandomizer GetAlignmentRandomizer(string alignmentRandomizerType, string setAlignment);
        IClassNameRandomizer GetClassNameRandomizer(string classNameRandomizerType, string setClassName);
        ILevelRandomizer GetLevelRandomizer(string levelRandomizerType, int setLevel);
        RaceRandomizer GetBaseRaceRandomizer(string baseRaceRandomizerType, string setBaseRace);
        RaceRandomizer GetMetaraceRandomizer(string metaraceRandomizerType, bool forceMetarace, string setMetarace);
        IAbilitiesRandomizer GetAbilitiesRandomizer(
            string statRandomizerType,
            int setStrength,
            int setConstitution,
            int setDexterity,
            int setIntelligence,
            int setWisdom,
            int setCharisma,
            bool allowAdjustments);
    }
}
