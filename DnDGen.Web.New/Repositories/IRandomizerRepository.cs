using CharacterGen.Randomizers.Abilities;
using CharacterGen.Randomizers.Alignments;
using CharacterGen.Randomizers.CharacterClasses;
using CharacterGen.Randomizers.Races;

namespace DnDGen.Web.New.Repositories
{
    public interface IRandomizerRepository
    {
        IAlignmentRandomizer GetAlignmentRandomizer(string alignmentRandomizerType, string setAlignment);
        IClassNameRandomizer GetClassNameRandomizer(string classNameRandomizerType, string setClassName);
        ILevelRandomizer GetLevelRandomizer(string levelRandomizerType, int setLevel);
        RaceRandomizer GetBaseRaceRandomizer(string baseRaceRandomizerType, string setBaseRace);
        RaceRandomizer GetMetaraceRandomizer(string metaraceRandomizerType, bool forceMetarace, string setMetarace);
        IAbilitiesRandomizer GetAbilitiesRandomizer(string statRandomizerType, int setStrength, int setConstitution, int setDexterity, int setIntelligence, int setWisdom, int setCharisma, bool allowAdjustments);
    }
}
