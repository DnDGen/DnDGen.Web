namespace DnDGen.Web.Models
{
    public class CharacterSpecifications
    {
        public string AlignmentRandomizerType { get; set; }
        public string ClassNameRandomizerType { get; set; }
        public string LevelRandomizerType { get; set; }
        public string BaseRaceRandomizerType { get; set; }
        public string MetaraceRandomizerType { get; set; }
        public string AbilitiesRandomizerType { get; set; }
        public string SetAlignment { get; set; }
        public string SetClassName { get; set; }
        public int SetLevel { get; set; }
        public string SetBaseRace { get; set; }
        public bool ForceMetarace { get; set; }
        public string SetMetarace { get; set; }
        public int SetStrength { get; set; }
        public int SetConstitution { get; set; }
        public int SetDexterity { get; set; }
        public int SetIntelligence { get; set; }
        public int SetWisdom { get; set; }
        public int SetCharisma { get; set; }
        public bool AllowAbilityAdjustments { get; set; }
    }
}