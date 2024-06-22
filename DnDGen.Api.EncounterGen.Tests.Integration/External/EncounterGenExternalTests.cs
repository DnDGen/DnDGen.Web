using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;

namespace DnDGen.Api.EncounterGen.Tests.Integration.External
{
    internal class EncounterGenExternalTests : IntegrationTests
    {
        private IEncounterVerifier encounterVerifier;

        [SetUp]
        public void Setup()
        {
            encounterVerifier = GetDependency<IEncounterVerifier>();
        }

        [TestCase(EnvironmentConstants.Plains,
            EnvironmentConstants.Temperatures.Temperate,
            EnvironmentConstants.TimesOfDay.Day,
            1, false, false)]
        public void ValidEncounterExists_ReturnsTrue(string environment, string temperature, string timeOfDay, int level, bool allowAquatic, bool allowUnderground)
        {
            var specifications = new EncounterSpecifications
            {
                Environment = environment,
                Temperature = temperature,
                TimeOfDay = timeOfDay,
                Level = level,
                AllowAquatic = allowAquatic,
                AllowUnderground = allowUnderground
            };

            var valid = encounterVerifier.ValidEncounterExists(specifications);
            Assert.That(valid, Is.True);
        }

        [TestCase(EnvironmentConstants.Plains,
            EnvironmentConstants.Temperatures.Temperate,
            EnvironmentConstants.TimesOfDay.Day,
            1, false, false)]
        public void EncounterSpecifications_Description(string environment, string temperature, string timeOfDay, int level, bool allowAquatic, bool allowUnderground)
        {
            var specifications = new EncounterSpecifications
            {
                Environment = environment,
                Temperature = temperature,
                TimeOfDay = timeOfDay,
                Level = level,
                AllowAquatic = allowAquatic,
                AllowUnderground = allowUnderground
            };

            Assert.That(specifications.CreatureTypeFilters, Is.Not.Null.And.Empty);
            Assert.That(specifications.CreatureTypeFilters.Any(), Is.False);
            Assert.That(specifications.Description, Is.EqualTo($"Level {level} {temperature} {environment} {timeOfDay}"));
        }
    }
}
