using System;
using System.Collections.Generic;

namespace DNDGenSite.Models
{
    public class CharacterModel
    {
        public IEnumerable<String> AlignmentRandomizerTypes { get; set; }
        public IEnumerable<String> Alignments { get; set; }
        public IEnumerable<String> ClassNameRandomizerTypes { get; set; }
        public IEnumerable<String> ClassNames { get; set; }
        public IEnumerable<String> LevelRandomizerTypes { get; set; }
        public IEnumerable<String> BaseRaceRandomizerTypes { get; set; }
        public IEnumerable<String> BaseRaces { get; set; }
        public IEnumerable<String> MetaraceRandomizerTypes { get; set; }
        public IEnumerable<String> Metaraces { get; set; }
        public IEnumerable<String> StatsRandomizerTypes { get; set; }
    }
}