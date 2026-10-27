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
        public string[] TemplateFilters { get; private set; } = [];

        public static readonly IEnumerable<string> Creatures = CreatureConstants.GetAll();

        public static readonly IEnumerable<string> Templates = CreatureConstants.Templates.GetAll();

        public static readonly IEnumerable<string> ChallengeRatings = ChallengeRatingConstants.GetOrdered();

        public static readonly IEnumerable<string> CreatureTypes = CreatureConstants.Types.GetAll()
            .Concat(CreatureConstants.Types.Subtypes.GetAll());

        public static readonly IEnumerable<string> Alignments =
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
            Filters.Alignments.Add(Alignments.FirstOrDefault(a => a.Equals(alignment, StringComparison.CurrentCultureIgnoreCase)) ?? badValue);
        }

        public void SetTypeFilter(string? creatureType)
        {
            if (creatureType is null)
                return;

            Filters ??= new();
            Filters.Types.Add(CreatureTypes.FirstOrDefault(a => a.Equals(creatureType, StringComparison.CurrentCultureIgnoreCase)) ?? badValue);
        }

        public void SetChallengeRatingFilter(string? challengeRating)
        {
            if (challengeRating is null)
                return;

            Filters ??= new();
            Filters.ChallengeRatings.Add(ChallengeRatings.FirstOrDefault(a => a.Equals(challengeRating, StringComparison.CurrentCultureIgnoreCase)) ?? badValue);
        }

        public void SetTemplatesFilter(string?[] templates)
        {
            if (templates.Length == 0)
                return;

            TemplateFilters = templates.Select(t => Templates.FirstOrDefault(x => x.Equals(t, StringComparison.CurrentCultureIgnoreCase)) ?? badValue).ToArray();
        }

        public (bool Valid, string Error) IsValid()
        {
            var valid = true;

            valid &= Creature != badValue;
            if (!valid)
                return (false, $"Creature is not valid. Should be one of: [{string.Join(", ", Creatures)}]");

            valid &= !TemplateFilters.Contains(badValue);
            if (!valid)
                return (false, $"Templates filter is not valid. Should be subset of: [{string.Join(", ", Templates)}]");

            valid &= Filters?.Alignments.Contains(badValue) != true;
            if (!valid)
                return (false, $"Alignment filter is not valid. Should be one of: [{string.Join(", ", Alignments)}]");

            valid &= Filters?.ChallengeRatings.Contains(badValue) != true;
            if (!valid)
                return (false, $"Challenge Rating filter is not valid. Should be one of: [{string.Join(", ", ChallengeRatings)}]");

            valid &= Filters?.Types.Contains(badValue) != true;
            if (!valid)
                return (false, $"Creature Type filter is not valid. Should be one of: [{string.Join(", ", CreatureTypes)}]");

            return (valid, string.Empty);
        }
    }
}
