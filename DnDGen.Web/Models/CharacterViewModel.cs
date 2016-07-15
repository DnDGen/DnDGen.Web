using System.Collections.Generic;

namespace DnDGen.Web.Models
{
    public class CharacterViewModel
    {
        public IEnumerable<string> AlignmentRandomizerTypes { get; set; }
        public IEnumerable<string> Alignments { get; set; }
        public IEnumerable<string> ClassNameRandomizerTypes { get; set; }
        public IEnumerable<string> ClassNames { get; set; }
        public IEnumerable<string> LevelRandomizerTypes { get; set; }
        public IEnumerable<string> BaseRaceRandomizerTypes { get; set; }
        public IEnumerable<string> BaseRaces { get; set; }
        public IEnumerable<string> MetaraceRandomizerTypes { get; set; }
        public IEnumerable<string> Metaraces { get; set; }
        public IEnumerable<string> StatsRandomizerTypes { get; set; }
    }
}