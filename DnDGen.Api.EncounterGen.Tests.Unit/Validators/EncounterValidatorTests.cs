using DnDGen.Api.EncounterGen.Tests.Unit.Helpers;
using DnDGen.Api.EncounterGen.Validators;
using DnDGen.EncounterGen.Models;
using System.Collections.Specialized;

namespace DnDGen.Api.EncounterGen.Tests.Unit.Validators
{
    internal class EncounterValidatorTests
    {
        [Test]
        public void GetValid_ReturnsValidEncounterSpec()
        {
            var request = RequestHelper.BuildRequest();
            var result = EncounterValidator.GetSpecifications(
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

        [Test]
        public void Validate_ReturnsValid_AllowAquatic_Default()
        {
            var request = RequestHelper.BuildRequest();
            var result = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowAquatic, Is.False);
        }

        [TestCase(true)]
        [TestCase(false)]
        public void Validate_ReturnsValid_AllowAquatic(bool allowAquatic)
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", allowAquatic.ToString() }
            };
            var request = RequestHelper.BuildRequest(query);
            var result = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowAquatic, Is.EqualTo(allowAquatic));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void Validate_ReturnsInvalid_AllowAquatic(string allowAquatic)
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", allowAquatic }
            };
            var request = RequestHelper.BuildRequest(query);
            var result = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowAquatic, Is.False);
        }

        [Test]
        public void Validate_ReturnsValid_AllowUnderground_Default()
        {
            var request = RequestHelper.BuildRequest();
            var result = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowUnderground, Is.False);
        }

        [TestCase(true)]
        [TestCase(false)]
        public void Validate_ReturnsValid_AllowUnderground(bool allowUnderground)
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", allowUnderground.ToString() }
            };
            var request = RequestHelper.BuildRequest(query);
            var result = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowUnderground, Is.EqualTo(allowUnderground));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void Validate_ReturnsInvalid_AllowUnderground(string allowUnderground)
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", allowUnderground }
            };
            var request = RequestHelper.BuildRequest(query);
            var result = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(result.Valid, Is.True);
            Assert.That(result.EncounterSpecifications.AllowUnderground, Is.False);
        }
    }
}
