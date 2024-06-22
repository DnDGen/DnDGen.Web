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
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.CreatureTypeFilters, Is.Not.Null.And.Empty);
            Assert.That(result.EncounterSpecifications.CreatureTypeFilters.Any(), Is.False);
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        private string GetUrl(
            string temperature = EnvironmentConstants.Temperatures.Temperate,
            string environment = EnvironmentConstants.Plains,
            string timeOfDay = EnvironmentConstants.TimesOfDay.Day,
            int level = 1,
            string query = "")
        {
            var url = $"https://encounter.dndgen.com/api/v1/encounter/{temperature}/{environment}/{timeOfDay}/level/{level}/validate";
            if (query.Any())
                url += "?" + query;

            return url;
        }

        [Test]
        public void Validate_ReturnsValid_AllowAquatic_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowAquatic, Is.False);
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase(true)]
        [TestCase(false)]
        public void Validate_ReturnsValid_AllowAquatic(bool allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowAquatic, Is.EqualTo(allowAquatic));
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void Validate_ReturnsInvalid_AllowAquatic(string allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.False);
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [Test]
        public void Validate_ReturnsValid_AllowUnderground_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowUnderground, Is.False);
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase(true)]
        [TestCase(false)]
        public void Validate_ReturnsValid_AllowUnderground(bool allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowUnderground, Is.EqualTo(allowUnderground));
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void Validate_ReturnsInvalid_AllowUnderground(string allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var result = EncounterValidator.GetValid(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.False);
            Assert.That(result.EncounterSpecifications.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }
    }
}
