using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Api.CharacterGen.Models
{
    public class CohortSpecifications
    {
        public int LeaderLevel { get; set; }
        public string LeaderAlignment { get; set; }
        public string LeaderClassName { get; set; }

        private static IEnumerable<string> Alignments = new[]
        {
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticNeutral,
            AlignmentConstants.ChaoticEvil,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil,
        };

        private static IEnumerable<string> ClassNames = new[]
        {
            CharacterClassConstants.Adept,
            CharacterClassConstants.Aristocrat,
            CharacterClassConstants.Barbarian,
            CharacterClassConstants.Bard,
            CharacterClassConstants.Cleric,
            CharacterClassConstants.Commoner,
            CharacterClassConstants.Druid,
            CharacterClassConstants.Expert,
            CharacterClassConstants.Fighter,
            CharacterClassConstants.Monk,
            CharacterClassConstants.Paladin,
            CharacterClassConstants.Ranger,
            CharacterClassConstants.Rogue,
            CharacterClassConstants.Sorcerer,
            CharacterClassConstants.Warrior,
            CharacterClassConstants.Wizard,
        };

        public void SetAlignment(string value)
        {
            LeaderAlignment = Alignments.FirstOrDefault(a => a.ToLower() == value?.ToLower());
        }

        public void SetClassName(string value)
        {
            LeaderClassName = ClassNames.FirstOrDefault(a => a.ToLower() == value?.ToLower());
        }

        public (bool Valid, string Error) IsValid()
        {
            var valid = true;

            valid &= LeaderLevel >= 6 && LeaderLevel <= 20;
            if (!valid)
                return (false, $"LeaderLevel is not valid. Should be 6 <= level <= 20");

            valid &= SetAlignment != null;
            if (!valid)
                return (false, $"LeaderAlignment is not valid. Should be one of: [{string.Join(", ", Alignments)}]");

            valid &= SetClassName != null;
            if (!valid)
                return (false, $"LeaderClassName is not valid. Should be one of: [{string.Join(", ", ClassNames)}]");

            return (valid, null);
        }
    }
}