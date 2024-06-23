using DnDGen.Api.EncounterGen.Tests.Integration.Helpers;
using DnDGen.Api.EncounterGen.Validators;
using DnDGen.EncounterGen.Models;

namespace DnDGen.Api.EncounterGen.Tests.Integration.Validators
{
    internal class EncounterValidatorTests : IntegrationTests
    {
        [Test]
        public void GetSpecifications_ReturnsValidEncounterSpec()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.IsValid(), Is.True);
            Assert.That(spec.CreatureTypeFilters, Is.Not.Null.And.Empty);
            Assert.That(spec.CreatureTypeFilters.Any(), Is.False);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
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
        public void GetSpecifications_ReturnsValid_AllowAquatic_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.IsValid(), Is.True);
            Assert.That(spec.AllowAquatic, Is.False);
        }

        [TestCase(true)]
        [TestCase(false)]
        public void GetSpecifications_ReturnsValid_AllowAquatic(bool allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.IsValid(), Is.True);
            Assert.That(spec.AllowAquatic, Is.EqualTo(allowAquatic));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void GetSpecifications_ReturnsInvalid_AllowAquatic(string allowAquatic)
        {
            var url = GetUrl(query: $"allowAquatic={allowAquatic}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.IsValid(), Is.True);
            Assert.That(spec.AllowAquatic, Is.False);
        }

        [Test]
        public void GetSpecifications_ReturnsValid_AllowUnderground_Default()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.IsValid(), Is.True);
            Assert.That(spec.AllowUnderground, Is.False);
        }

        [TestCase(true)]
        [TestCase(false)]
        public void GetSpecifications_ReturnsValid_AllowUnderground(bool allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.IsValid(), Is.True);
            Assert.That(spec.AllowUnderground, Is.EqualTo(allowUnderground));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void GetSpecifications_ReturnsInvalid_AllowUnderground(string allowUnderground)
        {
            var url = GetUrl(query: $"allowUnderground={allowUnderground}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.IsValid(), Is.True);
            Assert.That(spec.AllowUnderground, Is.False);
        }
    }
}
