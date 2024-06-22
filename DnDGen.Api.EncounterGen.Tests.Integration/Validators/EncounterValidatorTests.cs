using DnDGen.Api.EncounterGen.Tests.Integration.Helpers;
using DnDGen.Api.EncounterGen.Validators;
using DnDGen.EncounterGen.Models;

namespace DnDGen.Api.EncounterGen.Tests.Integration.Validators
{
    internal class EncounterValidatorTests : IntegrationTests
    {
        [Test]
        public void GetValid_ReturnsValidEncounterSpec()
        {
            var request = RequestHelper.BuildRequest("https://encounter.dndgen.com/api/v1/encounter/Temperate/Plains/Day/level/1/validate");
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.EncounterSpecifications.CreatureTypeFilters, Is.Not.Null.And.Empty);
            Assert.That(result.EncounterSpecifications.CreatureTypeFilters.Any(), Is.False);
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }
    }
}
