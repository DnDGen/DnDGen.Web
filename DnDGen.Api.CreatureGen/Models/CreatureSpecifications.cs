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

        private static readonly IEnumerable<string> Creatures = CreatureConstants.GetAll();

        private static readonly IEnumerable<string> Templates = CreatureConstants.Templates.GetAll();

        private static readonly IEnumerable<string> ChallengeRatings = ChallengeRatingConstants.GetOrdered();

        private static readonly IEnumerable<string> CreatureTypes = CreatureConstants.Types.GetAll();

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
                var validatedTemplate = Templates.FirstOrDefault(t => t.Equals(template, StringComparison.CurrentCultureIgnoreCase)) ?? badValue;
                Filters.Templates.Add(validatedTemplate);
            }
        }

        public (bool Valid, string Error) IsValid()
        {
            var valid = true;

            valid &= Creature != badValue;
            if (!valid)
                return (false, $"Creature is not valid. Should be one of: [{string.Join(", ", Creatures)}]");

            valid &= Filters?.CleanTemplates.Contains(badValue) != true;
            if (!valid)
                return (false, $"Templates filter is not valid. Should be one of: [{string.Join(", ", Templates)}]");

            valid &= Filters?.Alignment != badValue;
            if (!valid)
                return (false, $"Alignment filter is not valid. Should be one of: [{string.Join(", ", Alignments)}]");

            valid &= Filters?.ChallengeRating != badValue;
            if (!valid)
                return (false, $"Challenge Rating filter is not valid. Should be one of: [{string.Join(", ", ChallengeRatings)}]");

            valid &= Filters?.Type != badValue;
            if (!valid)
                return (false, $"Creature Type filter is not valid. Should be one of: [{string.Join(", ", CreatureTypes)}]");

            return (valid, string.Empty);
        }
    }
}