using DnDGen.CreatureGen.Alignments;
using DnDGen.CreatureGen.Creatures;
using DnDGen.CreatureGen.Generators.Creatures;

namespace DnDGen.Api.CreatureGen.Models
{
    public class CreatureSpecifications
    {
        public bool AsCharacter { get; set; }
        public string? Creature { get; set; }
        public Filters? Filters { get; private set; }

        public static readonly IEnumerable<string> CreatureTypes = [
            CreatureConstants.Types.Aberration,
            CreatureConstants.Types.Animal,
            CreatureConstants.Types.Construct,
            CreatureConstants.Types.Dragon,
            CreatureConstants.Types.Elemental,
            CreatureConstants.Types.Fey,
            CreatureConstants.Types.Giant,
            CreatureConstants.Types.Humanoid,
            CreatureConstants.Types.MagicalBeast,
            CreatureConstants.Types.MonstrousHumanoid,
            CreatureConstants.Types.Ooze,
            CreatureConstants.Types.Outsider,
            CreatureConstants.Types.Plant,
            CreatureConstants.Types.Undead,
            CreatureConstants.Types.Vermin];

        private static readonly IEnumerable<string> Alignments =
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

        private static readonly IEnumerable<string> Creatures = CreatureConstants.GetAll();

        private static readonly IEnumerable<string> Templates = CreatureConstants.Templates.GetAll();

        private static readonly IEnumerable<string> ChallengeRatings = ChallengeRatingConstants.GetOrdered();

        private const string badValue = "BADVALUE";

        public void SetCreature(string? creature)
        {
            if (creature is null)
                return;

            Creature = Creatures.FirstOrDefault(c => c.Equals(creature, StringComparison.CurrentCultureIgnoreCase)) ?? badValue;
        }

        public void SetAlignmentFilter(string? alignment)
        {
            if (alignment is null)
                return;

            Filters ??= new();
            Filters.Alignment = Alignments.FirstOrDefault(a => a.Equals(alignment, StringComparison.CurrentCultureIgnoreCase)) ?? badValue;
        }

        internal void SetTypeFilter(string? creatureType)
        {
            if (creatureType is null)
                return;

            Filters ??= new();
            Filters.Type = CreatureTypes.FirstOrDefault(a => a.Equals(creatureType, StringComparison.CurrentCultureIgnoreCase)) ?? badValue;
        }

        internal void SetChallengeRatingFilter(string? challengeRating)
        {
            if (challengeRating is null)
                return;

            Filters ??= new();
            Filters.ChallengeRating = ChallengeRatings.FirstOrDefault(a => a.Equals(challengeRating, StringComparison.CurrentCultureIgnoreCase)) ?? badValue;
        }

        internal void SetTemplatesFilter(string[] templates)
        {
            if (templates.Length == 0)
                return;

            Filters ??= new();
            Filters.Templates = [];

            foreach (var template in templates)
            {
                var validTemplate = Templates.FirstOrDefault(t => t.Equals(template, StringComparison.CurrentCultureIgnoreCase));
                if (validTemplate is null)
                    Filters.Templates.Add(badValue);
                else
                    Filters.Templates.Add(validTemplate);
            }
        }

        public (bool Valid, string Error) IsValid()
        {
            var valid = true;

            valid &= AlignmentRandomizerType != string.Empty;
            if (!valid)
                return (false, $"AlignmentRandomizerType is not valid. Should be one of: [{string.Join(", ", AlignmentRandomizers)}]");

            valid &= ClassNameRandomizerType != string.Empty;
            if (!valid)
                return (false, $"ClassNameRandomizerType is not valid. Should be one of: [{string.Join(", ", ClassNameRandomizers)}]");

            valid &= LevelRandomizerType != string.Empty;
            if (!valid)
                return (false, $"LevelRandomizerType is not valid. Should be one of: [{string.Join(", ", LevelRandomizers)}]");

            valid &= BaseRaceRandomizerType != string.Empty;
            if (!valid)
                return (false, $"BaseRaceRandomizerType is not valid. Should be one of: [{string.Join(", ", BaseRaceRandomizers)}]");

            valid &= MetaraceRandomizerType != string.Empty;
            if (!valid)
                return (false, $"MetaraceRandomizerType is not valid. Should be one of: [{string.Join(", ", MetaraceRandomizers)}]");

            valid &= AbilitiesRandomizerType != string.Empty;
            if (!valid)
                return (false, $"AbilitiesRandomizerType is not valid. Should be one of: [{string.Join(", ", AbilitiesRandomizers)}]");

            valid &= Creature != string.Empty;
            if (!valid)
                return (false, $"Creature is not valid. Should be one of: [{string.Join(", ", C)}]");

            valid &= Filters?.Alignment != string.Empty;
            if (!valid)
                return (false, $"Alignment filter is not valid. Should be one of: [{string.Join(", ", Alignments)}]");

            if (ClassNameRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetClassName != string.Empty;
                if (!valid)
                    return (false, $"SetClassName is not valid. Should be one of: [{string.Join(", ", ClassNames)}]");
            }

            if (LevelRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetLevel > 0;
                valid &= SetLevel <= 20;
                if (!valid)
                    return (false, "SetLevel is not valid. Should be 1 <= level <= 20");
            }

            if (BaseRaceRandomizerType == RandomizerTypeConstants.Set)
            {
            }

            if (MetaraceRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetMetarace != InvalidMetarace;
                if (!valid)
                    return (false, $"SetMetarace is not valid. Should be one of: [{string.Join(", ", Metaraces)}]");
            }

            if (AbilitiesRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetStrength > 0;
                if (!valid)
                    return (false, "SetStrength is not valid. Should be SetStrength > 0");

                valid &= SetConstitution > 0;
                if (!valid)
                    return (false, "SetConstitution is not valid. Should be SetConstitution > 0");

                valid &= SetDexterity > 0;
                if (!valid)
                    return (false, "SetDexterity is not valid. Should be SetDexterity > 0");

                valid &= SetIntelligence > 0;
                if (!valid)
                    return (false, "SetIntelligence is not valid. Should be SetIntelligence > 0");

                valid &= SetWisdom > 0;
                if (!valid)
                    return (false, "SetWisdom is not valid. Should be SetWisdom > 0");

                valid &= SetCharisma > 0;
                if (!valid)
                    return (false, "SetCharisma is not valid. Should be SetCharisma > 0");
            }

            return (valid, string.Empty);
        }
    }
}