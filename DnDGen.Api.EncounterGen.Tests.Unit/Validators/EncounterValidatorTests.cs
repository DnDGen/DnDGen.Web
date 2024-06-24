using DnDGen.Api.EncounterGen.Tests.Unit.Helpers;
using DnDGen.Api.EncounterGen.Validators;
using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using System.Collections.Specialized;

namespace DnDGen.Api.EncounterGen.Tests.Unit.Validators
{
    internal class EncounterValidatorTests
    {
        [Test]
        public void GetSpecifications_ReturnsEncounterSpec()
        {
            var request = RequestHelper.BuildRequest();
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.Temperature, Is.EqualTo(EnvironmentConstants.Temperatures.Temperate));
            Assert.That(spec.Environment, Is.EqualTo(EnvironmentConstants.Plains));
            Assert.That(spec.TimeOfDay, Is.EqualTo(EnvironmentConstants.TimesOfDay.Day));
            Assert.That(spec.Level, Is.EqualTo(1));
            Assert.That(spec.AllowAquatic, Is.False);
            Assert.That(spec.AllowUnderground, Is.False);
            Assert.That(spec.CreatureTypeFilters, Is.Not.Null.And.Empty);
            Assert.That(spec.CreatureTypeFilters.Any(), Is.False);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase(EnvironmentConstants.Temperatures.Cold, EnvironmentConstants.Temperatures.Cold)]
        [TestCase("cold", EnvironmentConstants.Temperatures.Cold)]
        [TestCase("COLD", EnvironmentConstants.Temperatures.Cold)]
        [TestCase(EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Temperatures.Temperate)]
        [TestCase("temperate", EnvironmentConstants.Temperatures.Temperate)]
        [TestCase("TEMPERATE", EnvironmentConstants.Temperatures.Temperate)]
        [TestCase(EnvironmentConstants.Temperatures.Warm, EnvironmentConstants.Temperatures.Warm)]
        [TestCase("warm", EnvironmentConstants.Temperatures.Warm)]
        [TestCase("WARM", EnvironmentConstants.Temperatures.Warm)]
        [TestCase("", "")]
        [TestCase("invalid", "")]
        public void GetSpecifications_ReturnsEncounterSpec_Temperature(string input, string expected)
        {
            var request = RequestHelper.BuildRequest();
            var spec = EncounterValidator.GetSpecifications(
                request,
                input,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.Temperature, Is.EqualTo(expected == string.Empty ? null : expected));
            Assert.That(spec.Description, Is.EqualTo($"Level 1 {expected} Plains Day"));
        }

        [TestCase(EnvironmentConstants.Aquatic, EnvironmentConstants.Aquatic)]
        [TestCase("aquatic", EnvironmentConstants.Aquatic)]
        [TestCase("AQUATIC", EnvironmentConstants.Aquatic)]
        [TestCase(EnvironmentConstants.Civilized, EnvironmentConstants.Civilized)]
        [TestCase("civilized", EnvironmentConstants.Civilized)]
        [TestCase("CIVILIZED", EnvironmentConstants.Civilized)]
        [TestCase(EnvironmentConstants.Desert, EnvironmentConstants.Desert)]
        [TestCase("desert", EnvironmentConstants.Desert)]
        [TestCase("DESERT", EnvironmentConstants.Desert)]
        [TestCase(EnvironmentConstants.Hills, EnvironmentConstants.Hills)]
        [TestCase("hills", EnvironmentConstants.Hills)]
        [TestCase("HILLS", EnvironmentConstants.Hills)]
        [TestCase(EnvironmentConstants.Marsh, EnvironmentConstants.Marsh)]
        [TestCase("marsh", EnvironmentConstants.Marsh)]
        [TestCase("MARSH", EnvironmentConstants.Marsh)]
        [TestCase(EnvironmentConstants.Mountain, EnvironmentConstants.Mountain)]
        [TestCase("mountain", EnvironmentConstants.Mountain)]
        [TestCase("MOUNTAIN", EnvironmentConstants.Mountain)]
        [TestCase(EnvironmentConstants.Plains, EnvironmentConstants.Plains)]
        [TestCase("plains", EnvironmentConstants.Plains)]
        [TestCase("PLAINS", EnvironmentConstants.Plains)]
        [TestCase(EnvironmentConstants.Underground, EnvironmentConstants.Underground)]
        [TestCase("underground", EnvironmentConstants.Underground)]
        [TestCase("UNDERGROUND", EnvironmentConstants.Underground)]
        [TestCase("", "")]
        [TestCase("invalid", "")]
        public void GetSpecifications_ReturnsEncounterSpec_Environment(string input, string expected)
        {
            var request = RequestHelper.BuildRequest();
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                input,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.Environment, Is.EqualTo(expected == string.Empty ? null : expected));
            Assert.That(spec.Description, Is.EqualTo($"Level 1 Temperate {expected} Day"));
        }

        [TestCase(EnvironmentConstants.TimesOfDay.Day, EnvironmentConstants.TimesOfDay.Day)]
        [TestCase("day", EnvironmentConstants.TimesOfDay.Day)]
        [TestCase("DAY", EnvironmentConstants.TimesOfDay.Day)]
        [TestCase(EnvironmentConstants.TimesOfDay.Night, EnvironmentConstants.TimesOfDay.Night)]
        [TestCase("night", EnvironmentConstants.TimesOfDay.Night)]
        [TestCase("NIGHT", EnvironmentConstants.TimesOfDay.Night)]
        [TestCase("", "")]
        [TestCase("invalid", "")]
        public void GetSpecifications_ReturnsEncounterSpec_TimeOfDay(string input, string expected)
        {
            var request = RequestHelper.BuildRequest();
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                input,
                1);

            Assert.That(spec.TimeOfDay, Is.EqualTo(expected == string.Empty ? null : expected));
            Assert.That(spec.Description, Is.EqualTo($"Level 1 Temperate Plains {expected}"));
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(EncounterSpecifications.MinimumLevel)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(6)]
        [TestCase(7)]
        [TestCase(8)]
        [TestCase(9)]
        [TestCase(10)]
        [TestCase(11)]
        [TestCase(12)]
        [TestCase(13)]
        [TestCase(14)]
        [TestCase(15)]
        [TestCase(16)]
        [TestCase(17)]
        [TestCase(18)]
        [TestCase(19)]
        [TestCase(20)]
        [TestCase(21)]
        [TestCase(22)]
        [TestCase(23)]
        [TestCase(24)]
        [TestCase(25)]
        [TestCase(26)]
        [TestCase(27)]
        [TestCase(28)]
        [TestCase(29)]
        [TestCase(EncounterSpecifications.MaximumLevel)]
        [TestCase(EncounterSpecifications.MaximumLevel + 1)]
        public void GetSpecifications_ReturnsEncounterSpec_TimeOfDay(int input)
        {
            var request = RequestHelper.BuildRequest();
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                input);

            Assert.That(spec.Level, Is.EqualTo(input));
            Assert.That(spec.Description, Is.EqualTo($"Level {input} Temperate Plains Day"));
        }

        [Test]
        public void GetSpecifications_ReturnsEncounterSpec_AllowAquatic_Default()
        {
            var request = RequestHelper.BuildRequest();
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowAquatic, Is.False);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [Test]
        public void GetSpecifications_ReturnsEncounterSpec_AllowAquatic()
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowAquatic, Is.True);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day, allowing aquatic"));
        }

        [Test]
        public void GetSpecifications_ReturnsEncounterSpec_DoNotAllowAquatic()
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.FalseString }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowAquatic, Is.False);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void GetSpecifications_ReturnsInvalidEncounterSpec_AllowAquatic(string allowAquatic)
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", allowAquatic }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowAquatic, Is.False);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [Test]
        public void GetSpecifications_ReturnsEncounterSpec_AllowUnderground_Default()
        {
            var request = RequestHelper.BuildRequest();
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowUnderground, Is.False);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [Test]
        public void GetSpecifications_ReturnsEncounterSpec_AllowUnderground()
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", bool.TrueString }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowUnderground, Is.EqualTo(true));
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day, allowing underground"));
        }

        [Test]
        public void GetSpecifications_ReturnsEncounterSpec_DoNotAllowUnderground()
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", bool.FalseString }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowUnderground, Is.EqualTo(false));
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase("")]
        [TestCase("Invalid")]
        public void GetSpecifications_ReturnsInvalidEncounterSpec_AllowUnderground(string allowUnderground)
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", allowUnderground }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.AllowUnderground, Is.EqualTo(false));
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [TestCase(CreatureDataConstants.Types.Aberration, CreatureDataConstants.Types.Aberration)]
        [TestCase("aberration", CreatureDataConstants.Types.Aberration)]
        [TestCase("ABERRATION", CreatureDataConstants.Types.Aberration)]
        [TestCase(CreatureDataConstants.Types.Animal, CreatureDataConstants.Types.Animal)]
        [TestCase("animal", CreatureDataConstants.Types.Animal)]
        [TestCase("ANIMAL", CreatureDataConstants.Types.Animal)]
        [TestCase(CreatureDataConstants.Types.Construct, CreatureDataConstants.Types.Construct)]
        [TestCase("construct", CreatureDataConstants.Types.Construct)]
        [TestCase("CONSTRUCT", CreatureDataConstants.Types.Construct)]
        [TestCase(CreatureDataConstants.Types.Dragon, CreatureDataConstants.Types.Dragon)]
        [TestCase("dragon", CreatureDataConstants.Types.Dragon)]
        [TestCase("DRAGON", CreatureDataConstants.Types.Dragon)]
        [TestCase(CreatureDataConstants.Types.Elemental, CreatureDataConstants.Types.Elemental)]
        [TestCase("elemental", CreatureDataConstants.Types.Elemental)]
        [TestCase("ELEMENTAL", CreatureDataConstants.Types.Elemental)]
        [TestCase(CreatureDataConstants.Types.Fey, CreatureDataConstants.Types.Fey)]
        [TestCase("fey", CreatureDataConstants.Types.Fey)]
        [TestCase("FEY", CreatureDataConstants.Types.Fey)]
        [TestCase(CreatureDataConstants.Types.Giant, CreatureDataConstants.Types.Giant)]
        [TestCase("giant", CreatureDataConstants.Types.Giant)]
        [TestCase("GIANT", CreatureDataConstants.Types.Giant)]
        [TestCase(CreatureDataConstants.Types.Humanoid, CreatureDataConstants.Types.Humanoid)]
        [TestCase("humanoid", CreatureDataConstants.Types.Humanoid)]
        [TestCase("HUMANOID", CreatureDataConstants.Types.Humanoid)]
        [TestCase(CreatureDataConstants.Types.MagicalBeast, CreatureDataConstants.Types.MagicalBeast)]
        [TestCase("magical beast", CreatureDataConstants.Types.MagicalBeast)]
        [TestCase("MAGICAL BEAST", CreatureDataConstants.Types.MagicalBeast)]
        [TestCase(CreatureDataConstants.Types.MonstrousHumanoid, CreatureDataConstants.Types.MonstrousHumanoid)]
        [TestCase("monstrous humanoid", CreatureDataConstants.Types.MonstrousHumanoid)]
        [TestCase("MONSTROUS HUMANOID", CreatureDataConstants.Types.MonstrousHumanoid)]
        [TestCase(CreatureDataConstants.Types.Ooze, CreatureDataConstants.Types.Ooze)]
        [TestCase("ooze", CreatureDataConstants.Types.Ooze)]
        [TestCase("OOZE", CreatureDataConstants.Types.Ooze)]
        [TestCase(CreatureDataConstants.Types.Outsider, CreatureDataConstants.Types.Outsider)]
        [TestCase("outsider", CreatureDataConstants.Types.Outsider)]
        [TestCase("OUTSIDER", CreatureDataConstants.Types.Outsider)]
        [TestCase(CreatureDataConstants.Types.Plant, CreatureDataConstants.Types.Plant)]
        [TestCase("plant", CreatureDataConstants.Types.Plant)]
        [TestCase("PLANT", CreatureDataConstants.Types.Plant)]
        [TestCase(CreatureDataConstants.Types.Undead, CreatureDataConstants.Types.Undead)]
        [TestCase("undead", CreatureDataConstants.Types.Undead)]
        [TestCase("UNDEAD", CreatureDataConstants.Types.Undead)]
        [TestCase(CreatureDataConstants.Types.Vermin, CreatureDataConstants.Types.Vermin)]
        [TestCase("vermin", CreatureDataConstants.Types.Vermin)]
        [TestCase("VERMIN", CreatureDataConstants.Types.Vermin)]
        public void GetSpecifications_ReturnsEncounterSpec_CreatureTypeFilter_Valid(string input, string expected)
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", input }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.CreatureTypeFilters, Is.EquivalentTo(new[] { expected }));
            Assert.That(spec.Description, Is.EqualTo($"Level 1 Temperate Plains Day, allowing [{expected}]"));
        }

        [TestCase("")]
        [TestCase("invalid")]
        public void GetSpecifications_ReturnsEncounterSpec_CreatureTypeFilter_Invalid(string input)
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", input }
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.CreatureTypeFilters, Is.Not.Null.And.Empty);
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day"));
        }

        [Test]
        public void GetSpecifications_ReturnsEncounterSpec_MultipleCreatureTypeFilters()
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Undead },
                { "creatureTypeFilters", CreatureDataConstants.Types.Ooze },
            };
            var request = RequestHelper.BuildRequest(query);
            var spec = EncounterValidator.GetSpecifications(
                request,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Plains,
                EnvironmentConstants.TimesOfDay.Day,
                1);

            Assert.That(spec.CreatureTypeFilters, Is.EquivalentTo(new[] { CreatureDataConstants.Types.Undead, CreatureDataConstants.Types.Ooze }));
            Assert.That(spec.Description, Is.EqualTo("Level 1 Temperate Plains Day, allowing [Ooze, Undead]"));
        }
    }
}
