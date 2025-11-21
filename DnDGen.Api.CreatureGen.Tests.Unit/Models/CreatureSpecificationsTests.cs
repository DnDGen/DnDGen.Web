using DnDGen.Api.CreatureGen.Models;
using DnDGen.CreatureGen.Alignments;
using DnDGen.CreatureGen.Creatures;

namespace DnDGen.Api.CreatureGen.Tests.Unit.Models
{
    [TestFixture]
    public class CreatureSpecificationsTests
    {
        private CreatureSpecifications creatureSpecifications;
        private Random random;

        [SetUp]
        public void Setup()
        {
            creatureSpecifications = new CreatureSpecifications();
            random = new Random();
        }

        [Test]
        public void CreatureSpecificationsInitialized()
        {
            Assert.Multiple(() =>
            {
                Assert.That(creatureSpecifications.AsCharacter, Is.False);
                Assert.That(creatureSpecifications.Creature, Is.Null);
                Assert.That(creatureSpecifications.Filters, Is.Null);
            });
        }

        [TestCase(CreatureConstants.Human, CreatureConstants.Human)]
        [TestCase("human", CreatureConstants.Human)]
        [TestCase("HUMAN", CreatureConstants.Human)]
        [TestCase(CreatureConstants.MindFlayer, CreatureConstants.MindFlayer)]
        [TestCase("mind flayer (illithid)", CreatureConstants.MindFlayer)]
        [TestCase("MIND FLAYER (ILLITHID)", CreatureConstants.MindFlayer)]
        [TestCase("mind flayer", CreatureConstants.MindFlayer)]
        [TestCase("illithid", CreatureConstants.MindFlayer)]
        [TestCase("barbed devil", CreatureConstants.BarbedDevil_Hamatula)]
        [TestCase("hamatula", CreatureConstants.BarbedDevil_Hamatula)]
        [TestCase(CreatureConstants.Templates.Lich, "BADVALUE")]
        [TestCase("lich", "BADVALUE")]
        [TestCase("LICH", "BADVALUE")]
        [TestCase("Invalid", "BADVALUE")]
        [TestCase("invalid", "BADVALUE")]
        [TestCase("INVALID", "BADVALUE")]
        [TestCase("", "BADVALUE")]
        [TestCase(null, null)]
        public void SetCreature_SetsCreature(string? input, string? expected)
        {
            creatureSpecifications.SetCreature(input);
            Assert.That(creatureSpecifications.Creature, Is.EqualTo(expected));
        }

        [Test]
        public void SetCreature_AllCreaturesAreValid()
        {
            var allCreatures = CreatureConstants.GetAll();
            foreach (var creature in allCreatures)
            {
                creatureSpecifications.SetCreature(creature);
                Assert.That(creatureSpecifications.Creature, Is.EqualTo(creature), creature);
            }
        }

        [TestCase(AlignmentConstants.LawfulGood, AlignmentConstants.LawfulGood)]
        [TestCase("lawful good", AlignmentConstants.LawfulGood)]
        [TestCase("LAWFUL GOOD", AlignmentConstants.LawfulGood)]
        [TestCase(AlignmentConstants.LawfulNeutral, AlignmentConstants.LawfulNeutral)]
        [TestCase("lawful neutral", AlignmentConstants.LawfulNeutral)]
        [TestCase("LAWFUL NEUTRAL", AlignmentConstants.LawfulNeutral)]
        [TestCase(AlignmentConstants.LawfulEvil, AlignmentConstants.LawfulEvil)]
        [TestCase("lawful evil", AlignmentConstants.LawfulEvil)]
        [TestCase("LAWFUL EVIL", AlignmentConstants.LawfulEvil)]
        [TestCase(AlignmentConstants.NeutralGood, AlignmentConstants.NeutralGood)]
        [TestCase("neutral good", AlignmentConstants.NeutralGood)]
        [TestCase("NEUTRAL GOOD", AlignmentConstants.NeutralGood)]
        [TestCase(AlignmentConstants.TrueNeutral, AlignmentConstants.TrueNeutral)]
        [TestCase("true neutral", AlignmentConstants.TrueNeutral)]
        [TestCase("TRUE NEUTRAL", AlignmentConstants.TrueNeutral)]
        [TestCase(AlignmentConstants.NeutralEvil, AlignmentConstants.NeutralEvil)]
        [TestCase("neutral evil", AlignmentConstants.NeutralEvil)]
        [TestCase("NEUTRAL EVIL", AlignmentConstants.NeutralEvil)]
        [TestCase(AlignmentConstants.ChaoticGood, AlignmentConstants.ChaoticGood)]
        [TestCase("chaotic good", AlignmentConstants.ChaoticGood)]
        [TestCase("CHAOTIC GOOD", AlignmentConstants.ChaoticGood)]
        [TestCase(AlignmentConstants.ChaoticNeutral, AlignmentConstants.ChaoticNeutral)]
        [TestCase("chaotic neutral", AlignmentConstants.ChaoticNeutral)]
        [TestCase("CHAOTIC NEUTRAL", AlignmentConstants.ChaoticNeutral)]
        [TestCase(AlignmentConstants.ChaoticEvil, AlignmentConstants.ChaoticEvil)]
        [TestCase("chaotic evil", AlignmentConstants.ChaoticEvil)]
        [TestCase("CHAOTIC EVIL", AlignmentConstants.ChaoticEvil)]
        [TestCase(CreatureConstants.Types.Humanoid, "BADVALUE")]
        [TestCase("humanoid", "BADVALUE")]
        [TestCase("HUMANOID", "BADVALUE")]
        [TestCase("Invalid", "BADVALUE")]
        [TestCase("invalid", "BADVALUE")]
        [TestCase("INVALID", "BADVALUE")]
        [TestCase("", "BADVALUE")]
        [TestCase(null, null)]
        public void SetAlignmentFilter_SetsAlignmentOnFilters(string? input, string? expected)
        {
            creatureSpecifications.SetAlignmentFilter(input);
            Assert.That(creatureSpecifications.Filters, Is.Not.Null);
            Assert.That(creatureSpecifications.Filters.Alignment, Is.EqualTo(expected));
        }

        [TestCase(CreatureConstants.Types.Humanoid, CreatureConstants.Types.Humanoid)]
        [TestCase("humanoid", CreatureConstants.Types.Humanoid)]
        [TestCase("HUMANOID", CreatureConstants.Types.Humanoid)]
        [TestCase(CreatureConstants.Types.MagicalBeast, CreatureConstants.Types.MagicalBeast)]
        [TestCase("magical beast", CreatureConstants.Types.MagicalBeast)]
        [TestCase("MAGICAL BEAST", CreatureConstants.Types.MagicalBeast)]
        [TestCase(CreatureConstants.Types.Subtypes.Native, CreatureConstants.Types.Subtypes.Native)]
        [TestCase("native", CreatureConstants.Types.Subtypes.Native)]
        [TestCase("NATIVE", CreatureConstants.Types.Subtypes.Native)]
        [TestCase(CreatureConstants.Types.Subtypes.Goblinoid, CreatureConstants.Types.Subtypes.Goblinoid)]
        [TestCase("goblinoid", CreatureConstants.Types.Subtypes.Goblinoid)]
        [TestCase("GOBLINOID", CreatureConstants.Types.Subtypes.Goblinoid)]
        [TestCase(CreatureConstants.Goblin, "BADVALUE")]
        [TestCase("goblin", "BADVALUE")]
        [TestCase("GOBLIN", "BADVALUE")]
        [TestCase("Invalid", "BADVALUE")]
        [TestCase("invalid", "BADVALUE")]
        [TestCase("INVALID", "BADVALUE")]
        [TestCase("", "BADVALUE")]
        [TestCase(null, null)]
        public void SetTypeFilter_SetsTypeOnFilters(string? input, string? expected)
        {
            creatureSpecifications.SetTypeFilter(input);
            Assert.That(creatureSpecifications.Filters, Is.Not.Null);
            Assert.That(creatureSpecifications.Filters.Type, Is.EqualTo(expected));
        }

        [Test]
        public void SetTypeFilter_AllTypesAreValid()
        {
            var allTypes = CreatureConstants.Types.GetAll();
            foreach (var creatureType in allTypes)
            {
                creatureSpecifications.SetTypeFilter(creatureType);
                Assert.That(creatureSpecifications.Filters, Is.Not.Null, creatureType);
                Assert.That(creatureSpecifications.Filters.Type, Is.EqualTo(creatureType), creatureType);
            }
        }

        [Test]
        public void SetTypeFilter_AllSubtypesAreValid()
        {
            var allTypes = CreatureConstants.Types.Subtypes.GetAll();
            foreach (var creatureType in allTypes)
            {
                creatureSpecifications.SetTypeFilter(creatureType);
                Assert.That(creatureSpecifications.Filters, Is.Not.Null, creatureType);
                Assert.That(creatureSpecifications.Filters.Type, Is.EqualTo(creatureType), creatureType);
            }
        }

        [TestCase(ChallengeRatingConstants.CR1, ChallengeRatingConstants.CR1)]
        [TestCase(ChallengeRatingConstants.CR1_2nd, ChallengeRatingConstants.CR1_2nd)]
        [TestCase("-1", "BADVALUE")]
        [TestCase("30", "BADVALUE")]
        [TestCase("1/5", "BADVALUE")]
        [TestCase("2/3", "BADVALUE")]
        [TestCase("0.5", "BADVALUE")]
        [TestCase("Invalid", "BADVALUE")]
        [TestCase("invalid", "BADVALUE")]
        [TestCase("INVALID", "BADVALUE")]
        [TestCase("", "BADVALUE")]
        [TestCase(null, null)]
        public void SetChallengeRatingFilter_SetsCROnFilters(string? input, string? expected)
        {
            creatureSpecifications.SetChallengeRatingFilter(input);
            Assert.That(creatureSpecifications.Filters, Is.Not.Null);
            Assert.That(creatureSpecifications.Filters.ChallengeRating, Is.EqualTo(expected));
        }

        [Test]
        public void SetChallengeRatingFilter_AllCRsAreValid()
        {
            var crs = ChallengeRatingConstants.GetOrdered();
            foreach (var cr in crs)
            {
                creatureSpecifications.SetChallengeRatingFilter(cr);
                Assert.That(creatureSpecifications.Filters, Is.Not.Null, cr);
                Assert.That(creatureSpecifications.Filters.ChallengeRating, Is.EqualTo(cr), cr);
            }
        }

        [TestCase(CreatureConstants.Templates.None, CreatureConstants.Templates.None)]
        [TestCase("none", CreatureConstants.Templates.None)]
        [TestCase("NONE", CreatureConstants.Templates.None)]
        [TestCase(CreatureConstants.Templates.Ghost, CreatureConstants.Templates.Ghost)]
        [TestCase("ghost", CreatureConstants.Templates.Ghost)]
        [TestCase("GHOST", CreatureConstants.Templates.Ghost)]
        [TestCase(CreatureConstants.Templates.FiendishCreature, CreatureConstants.Templates.FiendishCreature)]
        [TestCase("fiendish creature", CreatureConstants.Templates.FiendishCreature)]
        [TestCase("FIENDISH CREATURE", CreatureConstants.Templates.FiendishCreature)]
        [TestCase(CreatureConstants.Templates.HalfDragon_Black, CreatureConstants.Templates.HalfDragon_Black)]
        [TestCase("half-dragon (black)", CreatureConstants.Templates.HalfDragon_Black)]
        [TestCase("HALF-DRAGON (BLACK)", CreatureConstants.Templates.HalfDragon_Black)]
        [TestCase(CreatureConstants.Templates.Lycanthrope_Wolf_Natural, CreatureConstants.Templates.Lycanthrope_Wolf_Natural)]
        [TestCase("lycanthrope, wolf (werewolf, natural)", CreatureConstants.Templates.Lycanthrope_Wolf_Natural)]
        [TestCase("LYCANTHROPE, WOLF (WEREWOLF, NATURAL)", CreatureConstants.Templates.Lycanthrope_Wolf_Natural)]
        [TestCase("half-dragon", "BADVALUE")]
        [TestCase("black", "BADVALUE")]
        [TestCase(CreatureConstants.Goblin, "BADVALUE")]
        [TestCase("goblin", "BADVALUE")]
        [TestCase("GOBLIN", "BADVALUE")]
        [TestCase("Invalid", "BADVALUE")]
        [TestCase("invalid", "BADVALUE")]
        [TestCase("INVALID", "BADVALUE")]
        [TestCase("", "BADVALUE")]
        [TestCase(null, "BADVALUE")]
        public void SetTemplatesFilter_SetsTemplatesOnFilters(string? input, string? expected)
        {
            creatureSpecifications.SetTemplatesFilter([input]);
            Assert.That(creatureSpecifications.Filters, Is.Not.Null);
            Assert.That(creatureSpecifications.Filters.Type, Is.EqualTo(expected));
        }

        [Test]
        public void SetTemplatesFilter_EmptyTemplatesAreNull()
        {
            creatureSpecifications.SetTemplatesFilter([]);
            Assert.That(creatureSpecifications.Filters, Is.Null);
        }

        [Test]
        public void SetTemplatesFilter_AllTemplatesAreValid()
        {
            var allTemplates = CreatureConstants.Templates.GetAll();
            foreach (var template in allTemplates)
            {
                creatureSpecifications.SetTemplatesFilter([template]);
                Assert.That(creatureSpecifications.Filters, Is.Not.Null, template);
                Assert.That(creatureSpecifications.Filters.Templates, Is.EquivalentTo(new[] { template }), template);
            }
        }

        [Test]
        public void SetTemplatesFilter_MultipleTemplatesAreValid()
        {
            creatureSpecifications.SetTemplatesFilter([CreatureConstants.Templates.CelestialCreature, CreatureConstants.Templates.HalfDragon_Gold]);
            Assert.That(creatureSpecifications.Filters, Is.Not.Null);
            Assert.That(creatureSpecifications.Filters.Templates, Is.EquivalentTo(new[] { CreatureConstants.Templates.CelestialCreature, CreatureConstants.Templates.HalfDragon_Gold }));
        }

        [Test]
        public void SpecificationsAreValid()
        {
            creatureSpecifications.Creature = "my creature";

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
            });
        }

        [Test]
        public void SpecificationsAreInvalid_CreatureIsBad()
        {
            creatureSpecifications.Creature = "BADVALUE";

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                var creatures = CreatureConstants.GetAll();

                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Creature is not valid. Should be one of: [{string.Join(", ", creatures)}]"));
            });
        }

        [Test]
        public void SpecificationsAreValid_WithOneTemplate()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetTemplatesFilter([CreatureConstants.Templates.Ghost]);

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
            });
        }

        [Test]
        public void SpecificationsAreValid_WithTwoTemplates()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetTemplatesFilter([CreatureConstants.Templates.HalfDragon_Bronze, CreatureConstants.Templates.Ghost]);

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
            });
        }

        [Test]
        public void SpecificationsAreValid_WithNoneTemplate()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetTemplatesFilter([CreatureConstants.Templates.None]);

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
            });
        }

        [Test]
        public void SpecificationsAreInvalid_TemplateIsBad()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetTemplatesFilter([CreatureConstants.Templates.Ghost, "bad template"]);

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                var templates = CreatureConstants.Templates.GetAll();

                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Templates filter is not valid. Should be one of: [{string.Join(", ", templates)}]"));
            });
        }

        [Test]
        public void SpecificationsAreValid_WithAlignment()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetAlignmentFilter(AlignmentConstants.LawfulGood);

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
            });
        }

        [Test]
        public void SpecificationsAreInvalid_AlignmentIsBad()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetAlignmentFilter("chaotic lawful");

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                var alignments = new[]
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

                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Alignment filter is not valid. Should be one of: [{string.Join(", ", alignments)}]"));
            });
        }

        [Test]
        public void SpecificationsAreValid_WithChallengeRating()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetChallengeRatingFilter(ChallengeRatingConstants.CR11);

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
            });
        }

        [Test]
        public void SpecificationsAreInvalid_ChallengeRatingIsBad()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetChallengeRatingFilter("666");

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                var crs = ChallengeRatingConstants.GetOrdered();

                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Challenge Rating filter is not valid. Should be one of: [{string.Join(", ", crs)}]"));
            });
        }

        [Test]
        public void SpecificationsAreValid_WithCreatureType()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetTypeFilter(CreatureConstants.Types.Aberration);

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                Assert.That(Valid, Is.True);
                Assert.That(Error, Is.Empty);
            });
        }

        [Test]
        public void SpecificationsAreInvalid_CreatureTypeIsBad()
        {
            creatureSpecifications.Creature = "my creature";
            creatureSpecifications.SetTypeFilter("extraterrestrial");

            var (Valid, Error) = creatureSpecifications.IsValid();
            Assert.Multiple(() =>
            {
                var types = CreatureConstants.Types.GetAll().Concat(CreatureConstants.Types.Subtypes.GetAll());

                Assert.That(Valid, Is.False);
                Assert.That(Error, Is.EqualTo($"Creature Type filter is not valid. Should be one of: [{string.Join(", ", types)}]"));
            });
        }
    }
}
