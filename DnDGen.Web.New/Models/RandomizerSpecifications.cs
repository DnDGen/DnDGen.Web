namespace DnDGen.Web.New.Models
{
    public class RandomizerSpecifications
    {
        public string AlignmentRandomizerType { get; set; }
        public string ClassNameRandomizerType { get; set; }
        public string LevelRandomizerType { get; set; }
        public string BaseRaceRandomizerType { get; set; }
        public string MetaraceRandomizerType { get; set; }
        public string SetAlignment { get; set; }
        public string SetClassName { get; set; }
        public int SetLevel { get; set; }
        public string SetBaseRace { get; set; }
        public bool ForceMetarace { get; set; }
        public string SetMetarace { get; set; }
    }
}