using DnDGen.Api.CreatureGen.Models;
using DnDGen.Api.CreatureGen.Validators;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CreatureGen.Alignments;
using DnDGen.CreatureGen.Creatures;
using System.Collections.Specialized;

namespace DnDGen.Api.CreatureGen.Tests.Unit.Validators
{
    internal class CreatureValidatorTests
    {
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            requestHelper = new RequestHelper();
        }

        [Test]
        public void GetValid_ReturnsValid_WithCreatureSpec()
        {
            var request = requestHelper.BuildRequest();
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.Null);
                Assert.That(CreatureSpecifications.Filters, Is.Null);
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }

        [Test]
        public void GetValid_ReturnsValid_WithCreatureSpec_WithCreature()
        {
            var request = requestHelper.BuildRequest();
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid("human", request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.EqualTo(CreatureConstants.Human));
                Assert.That(CreatureSpecifications.Filters, Is.Null);
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithCreature()
        {
            var request = requestHelper.BuildRequest();
            var (Valid, Error, creatureSpecifications) = CreatureValidator.GetValid("bandersnatch", request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Creature is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.Creatures)}]"));
                Assert.That(creatureSpecifications, Is.Null);
            }
        }

        [Test]
        public void GetValid_ReturnsValid_WithCreatureSpec_WithAlignment()
        {
            var request = requestHelper.BuildRequest($"?alignment=neutral evil");
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.Null);
                Assert.That(CreatureSpecifications.Filters, Is.Not.Null);
                Assert.That(CreatureSpecifications.Filters!.Alignment, Is.EqualTo(AlignmentConstants.NeutralEvil));
                Assert.That(CreatureSpecifications.Filters.Type, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Templates, Is.Empty);
                Assert.That(CreatureSpecifications.Filters.ChallengeRating, Is.Null);
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithAlignment()
        {
            var request = requestHelper.BuildRequest($"?alignment=invalid alignment");
            var (Valid, Error, creatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Alignment filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.Alignments)}]"));
                Assert.That(creatureSpecifications, Is.Null);
            }
        }

        [TestCase("creatureType")]
        [TestCase("type")]
        public void GetValid_ReturnsValid_WithCreatureSpec_WithCreatureType(string property)
        {
            var request = requestHelper.BuildRequest($"?{property}=dragon");
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.Null);
                Assert.That(CreatureSpecifications.Filters, Is.Not.Null);
                Assert.That(CreatureSpecifications.Filters!.Alignment, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Type, Is.EqualTo(CreatureConstants.Types.Dragon));
                Assert.That(CreatureSpecifications.Filters.Templates, Is.Empty);
                Assert.That(CreatureSpecifications.Filters.ChallengeRating, Is.Null);
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }

        [TestCase("creatureType")]
        [TestCase("type")]
        public void GetValid_ReturnsInvalid_WithCreatureType(string property)
        {
            var request = requestHelper.BuildRequest($"?{property}=invalid");
            var (Valid, Error, creatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Creature Type filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.CreatureTypes)}]"));
                Assert.That(creatureSpecifications, Is.Null);
            }
        }

        [TestCase("challengeRating")]
        [TestCase("cr")]
        public void GetValid_ReturnsValid_WithCreatureSpec_WithChallengeRating(string property)
        {
            var request = requestHelper.BuildRequest($"?{property}=9");
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.Null);
                Assert.That(CreatureSpecifications.Filters, Is.Not.Null);
                Assert.That(CreatureSpecifications.Filters!.Alignment, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Type, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Templates, Is.Empty);
                Assert.That(CreatureSpecifications.Filters.ChallengeRating, Is.EqualTo(ChallengeRatingConstants.CR9));
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }

        [TestCase("challengeRating")]
        [TestCase("cr")]
        public void GetValid_ReturnsInvalid_WithChallengeRating(string property)
        {
            var request = requestHelper.BuildRequest($"?{property}=666");
            var (Valid, Error, creatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Challenge Rating filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.ChallengeRatings)}]"));
                Assert.That(creatureSpecifications, Is.Null);
            }
        }

        [Test]
        public void GetValid_ReturnsValid_WithCreatureSpec_WithTemplate()
        {
            var request = requestHelper.BuildRequest($"?templates=vampire");
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.Null);
                Assert.That(CreatureSpecifications.Filters, Is.Not.Null);
                Assert.That(CreatureSpecifications.Filters!.Alignment, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Type, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Templates, Is.EqualTo([CreatureConstants.Templates.Vampire]));
                Assert.That(CreatureSpecifications.Filters.ChallengeRating, Is.Null);
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }

        [Test]
        public void GetValid_ReturnsValid_WithCreatureSpec_WithMultipleTemplates()
        {
            var query = new NameValueCollection
            {
                { "templates", "half-dragon (gold)" },
                { "templates", "ghost" },
            };
            var request = requestHelper.BuildRequest(query);
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }

            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.Null);
                Assert.That(CreatureSpecifications.Filters, Is.Not.Null);
                Assert.That(CreatureSpecifications.Filters!.Alignment, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Type, Is.Null);
                Assert.That(CreatureSpecifications.Filters.Templates, Is.EqualTo([CreatureConstants.Templates.HalfDragon_Gold, CreatureConstants.Templates.Ghost]));
                Assert.That(CreatureSpecifications.Filters.ChallengeRating, Is.Null);
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithTemplates()
        {
            var request = requestHelper.BuildRequest($"?templates=half-dragon (gold)&templates=invalid");
            var (Valid, Error, creatureSpecifications) = CreatureValidator.GetValid(null, request);

            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Templates filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.Templates)}]"));
                Assert.That(creatureSpecifications, Is.Null);
            }
        }

        [Test]
        public void GetValid_ReturnsValid_WithCreatureSpec_WithAllFilters()
        {
            var request = requestHelper.BuildRequest($"?alignment=lawful good&creatureType=giant&cr=5&templates=celestial creature");
            var (Valid, Error, CreatureSpecifications) = CreatureValidator.GetValid("ogre", request);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
                Assert.That(CreatureSpecifications, Is.Not.Null);
            }
            using (Assert.EnterMultipleScope())
            {
                Assert.That(CreatureSpecifications.Creature, Is.EqualTo(CreatureConstants.Ogre));
                Assert.That(CreatureSpecifications.Filters, Is.Not.Null);
                Assert.That(CreatureSpecifications.Filters!.Alignment, Is.EqualTo(AlignmentConstants.LawfulGood));
                Assert.That(CreatureSpecifications.Filters.Type, Is.EqualTo(CreatureConstants.Types.Giant));
                Assert.That(CreatureSpecifications.Filters.Templates, Is.EqualTo([CreatureConstants.Templates.CelestialCreature]));
                Assert.That(CreatureSpecifications.Filters.ChallengeRating, Is.EqualTo(ChallengeRatingConstants.CR5));
                Assert.That(CreatureSpecifications.AsCharacter, Is.False);
            }
        }
    }
}
