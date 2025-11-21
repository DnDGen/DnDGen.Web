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

        [Test]
        public void SpecificationsAreValid()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = 15;
            creatureSpecifications.Temperature = "temperature";
            creatureSpecifications.TimeOfDay = "time of day";

            Assert.That(creatureSpecifications.IsValid(), Is.True);
        }

        [Test]
        public void SpecificationsAreInvalidIfEnvironmentMissing()
        {
            creatureSpecifications.Level = 15;
            creatureSpecifications.Temperature = "temperature";
            creatureSpecifications.TimeOfDay = "time of day";

            Assert.That(creatureSpecifications.IsValid(), Is.False);
        }

        [Test]
        public void SpecificationsAreInvalidIfTemperatureMissing()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = 15;
            creatureSpecifications.TimeOfDay = "time of day";

            Assert.That(creatureSpecifications.IsValid(), Is.False);
        }

        [Test]
        public void SpecificationsAreInvalidIfTimeOfDayMissing()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = 15;
            creatureSpecifications.Temperature = "temperature";

            Assert.That(creatureSpecifications.IsValid(), Is.False);
        }

        [Test]
        public void SpecificationsAreInvalidIfCreatureFiltersAreNull()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = 15;
            creatureSpecifications.Temperature = "temperature";
            creatureSpecifications.TimeOfDay = "time of day";
            creatureSpecifications.CreatureTypeFilters = null;

            Assert.That(creatureSpecifications.IsValid(), Is.False);
        }

        [Test]
        public void SpecificationsAreInvalidIfLevelIsLessThanMinimumLevel()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = EncounterSpecifications.MinimumLevel - 1;
            creatureSpecifications.Temperature = "temperature";
            creatureSpecifications.TimeOfDay = "time of day";

            Assert.That(creatureSpecifications.IsValid(), Is.False);
        }

        [Test]
        public void SpecificationsAreInvalidIfLevelIsMoreThanMaximumLevel()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = EncounterSpecifications.MaximumLevel + 1;
            creatureSpecifications.Temperature = "temperature";
            creatureSpecifications.TimeOfDay = "time of day";

            Assert.That(creatureSpecifications.IsValid(), Is.False);
        }

        [Test]
        public void SpecificationsAreValidIfLevelIsBetweenMinAndMax()
        {
            for (var level = EncounterSpecifications.MinimumLevel; level <= EncounterSpecifications.MaximumLevel; level++)
            {
                creatureSpecifications.Environment = "environment";
                creatureSpecifications.Level = level;
                creatureSpecifications.Temperature = "temperature";
                creatureSpecifications.TimeOfDay = "time of day";

                Assert.That(creatureSpecifications.IsValid(), Is.True, level.ToString());
            }
        }

        [Test]
        public void SpecificationsHaveDescription()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = 15;
            creatureSpecifications.Temperature = "temperature";
            creatureSpecifications.TimeOfDay = "time of day";

            Assert.That(creatureSpecifications.Description, Is.EqualTo("Level 15 temperature environment time of day"));
        }

        [Test]
        public void SpecificationsHaveFullDescription()
        {
            creatureSpecifications.Environment = "environment";
            creatureSpecifications.Level = 15;
            creatureSpecifications.Temperature = "temperature";
            creatureSpecifications.TimeOfDay = "time of day";
            creatureSpecifications.AllowAquatic = true;
            creatureSpecifications.AllowUnderground = true;
            creatureSpecifications.CreatureTypeFilters = new[] { "filter 1", "filter 2" };

            Assert.That(creatureSpecifications.Description, Is.EqualTo("Level 15 temperature environment time of day, allowing aquatic, allowing underground, allowing [filter 1, filter 2]"));
        }

        [Test]
        public void LevelIsInvalidIfLevelIsLessThanMinimumLevel()
        {
            Assert.That(EncounterSpecifications.LevelIsValid(EncounterSpecifications.MinimumLevel - 1), Is.False);
        }

        [Test]
        public void LevelIsInvalidIfLevelIsMoreThanMaximumLevel()
        {
            Assert.That(EncounterSpecifications.LevelIsValid(EncounterSpecifications.MaximumLevel + 1), Is.False);
        }

        [Test]
        public void LevelIsValidIfLevelIsBetweenMinAndMax()
        {
            for (var level = EncounterSpecifications.MinimumLevel; level <= EncounterSpecifications.MaximumLevel; level++)
            {
                Assert.That(EncounterSpecifications.LevelIsValid(level), Is.True, level.ToString());
            }
        }

        [Test]
        public void CloneSpecifications()
        {
            creatureSpecifications.AllowAquatic = Convert.ToBoolean(random.Next(2));
            creatureSpecifications.AllowUnderground = Convert.ToBoolean(random.Next(2));
            creatureSpecifications.CreatureTypeFilters = new[] { Guid.NewGuid().ToString(), Guid.NewGuid().ToString() };
            creatureSpecifications.Environment = Guid.NewGuid().ToString();
            creatureSpecifications.Level = random.Next();
            creatureSpecifications.Temperature = Guid.NewGuid().ToString();
            creatureSpecifications.TimeOfDay = Guid.NewGuid().ToString();

            var clone = creatureSpecifications.Clone();
            Assert.That(clone, Is.Not.EqualTo(creatureSpecifications));
            Assert.That(clone.AllowAquatic, Is.EqualTo(creatureSpecifications.AllowAquatic));
            Assert.That(clone.AllowUnderground, Is.EqualTo(creatureSpecifications.AllowUnderground));
            Assert.That(clone.Environment, Is.EqualTo(creatureSpecifications.Environment));
            Assert.That(clone.Level, Is.EqualTo(creatureSpecifications.Level));
            Assert.That(clone.Temperature, Is.EqualTo(creatureSpecifications.Temperature));
            Assert.That(clone.TimeOfDay, Is.EqualTo(creatureSpecifications.TimeOfDay));
            Assert.That(clone.CreatureTypeFilters, Is.EquivalentTo(creatureSpecifications.CreatureTypeFilters));
            Assert.That(clone.CreatureTypeFilters, Is.Not.SameAs(creatureSpecifications.CreatureTypeFilters));
        }

        [Test]
        public void SpecificEnvironmentIsTemperatureAndEnvironment()
        {
            creatureSpecifications.Temperature = "temp";
            creatureSpecifications.Environment = "environment";

            Assert.That(creatureSpecifications.SpecificEnvironment, Is.EqualTo("tempenvironment"));
        }
    }
}
