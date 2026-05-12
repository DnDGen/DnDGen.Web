using DnDGen.Api.Web.Models;
using DnDGen.CreatureGen.Alignments;
using DnDGen.CreatureGen.Creatures;

namespace DnDGen.Api.Web.Tests.Unit.Models
{
    public class CreatureViewModelTests
    {
        private CreatureViewModel model;

        [SetUp]
        public void Setup()
        {
            model = new CreatureViewModel();
        }

        [Test]
        public void ModelHasCreatures()
        {
            var creatures = CreatureConstants.GetAll();
            Assert.That(model.Creatures, Is.EquivalentTo(creatures));
        }

        [Test]
        public void ModelHasTemplates()
        {
            var templates = CreatureConstants.Templates.GetAll();
            Assert.That(model.Templates, Is.EquivalentTo(templates));
        }

        [Test]
        public void ModelHasAlignments()
        {
            Assert.That(model.Alignments, Is.EquivalentTo(
            [
                AlignmentConstants.ChaoticEvil,
                AlignmentConstants.ChaoticGood,
                AlignmentConstants.ChaoticNeutral,
                AlignmentConstants.LawfulEvil,
                AlignmentConstants.LawfulGood,
                AlignmentConstants.LawfulNeutral,
                AlignmentConstants.NeutralEvil,
                AlignmentConstants.NeutralGood,
                AlignmentConstants.TrueNeutral,
            ]));
        }

        [Test]
        public void ModelHasCreatureTypes()
        {
            var creatureTypes = CreatureConstants.Types.GetAll();
            var creatureSubtypes = CreatureConstants.Types.Subtypes.GetAll();
            Assert.That(model.CreatureTypes, Is.SupersetOf(creatureTypes));
            Assert.That(model.CreatureTypes, Is.SupersetOf(creatureSubtypes));
            Assert.That(model.CreatureTypes.Count(), Is.EqualTo(creatureTypes.Count() + creatureSubtypes.Count()));
        }

        [Test]
        public void ModelHasChallengeRatings()
        {
            var challengeRatings = ChallengeRatingConstants.GetOrdered();
            Assert.That(model.ChallengeRatings, Is.EquivalentTo(challengeRatings));
        }
    }
}
