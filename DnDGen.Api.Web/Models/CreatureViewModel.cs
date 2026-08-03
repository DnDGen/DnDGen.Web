using DnDGen.CreatureGen.Alignments;
using DnDGen.CreatureGen.Creatures;

namespace DnDGen.Api.Web.Models
{
    public class CreatureViewModel
    {
        public IEnumerable<string> Creatures { get; set; }
        public IEnumerable<string> Templates { get; set; }
        public IEnumerable<string> Alignments { get; set; }
        public IEnumerable<string> CreatureTypes { get; set; }
        public IEnumerable<string> ChallengeRatings { get; set; }

        public CreatureViewModel()
        {
            Creatures = CreatureConstants.GetAll();
            Templates = CreatureConstants.Templates.GetAll();

            Alignments =
            [
                AlignmentConstants.LawfulGood,
                AlignmentConstants.NeutralGood,
                AlignmentConstants.ChaoticGood,
                AlignmentConstants.LawfulNeutral,
                AlignmentConstants.TrueNeutral,
                AlignmentConstants.ChaoticNeutral,
                AlignmentConstants.LawfulEvil,
                AlignmentConstants.NeutralEvil,
                AlignmentConstants.ChaoticEvil,
            ];

            CreatureTypes = [.. CreatureConstants.Types.GetAll(), .. CreatureConstants.Types.Subtypes.GetAll()];
            ChallengeRatings = ChallengeRatingConstants.GetOrdered();
        }
    }
}
