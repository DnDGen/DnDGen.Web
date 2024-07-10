using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Api.CharacterGen.Models
{
    public class FollowerSpecifications
    {
        public int FollowerLevel { get; set; }
        public string LeaderAlignment { get; set; }
        public string LeaderClassName { get; set; }

        private static IEnumerable<string> Alignments =
        [
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticNeutral,
            AlignmentConstants.ChaoticEvil,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil,
        ];

        private static IEnumerable<string> ClassNames =
        [
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
        ];

        public FollowerSpecifications()
        {
            LeaderAlignment = string.Empty;
            LeaderClassName = string.Empty;
        }

        public void SetAlignment(string value)
        {
            LeaderAlignment = Alignments.FirstOrDefault(a => a.Equals(value, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
        }

        public void SetClassName(string value)
        {
            LeaderClassName = ClassNames.FirstOrDefault(a => a.Equals(value, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
        }

        public (bool Valid, string Error) IsValid()
        {
            var valid = true;

            valid &= FollowerLevel >= 1 && FollowerLevel <= 6;
            if (!valid)
                return (false, $"FollowerLevel is not valid. Should be 1 <= level <= 6");

            valid &= LeaderAlignment != string.Empty;
            if (!valid)
                return (false, $"LeaderAlignment is not valid. Should be one of: [{string.Join(", ", Alignments)}]");

            valid &= LeaderClassName != string.Empty;
            if (!valid)
                return (false, $"LeaderClassName is not valid. Should be one of: [{string.Join(", ", ClassNames)}]");

            return (valid, string.Empty);
        }
    }
}