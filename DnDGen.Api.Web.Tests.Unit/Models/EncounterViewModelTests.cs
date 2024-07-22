using DnDGen.Api.Web.Models;
using DnDGen.EncounterGen.Models;

namespace DnDGen.Api.Web.Tests.Unit.Models
{
    [TestFixture]
    public class EncounterViewModelTests
    {
        private EncounterViewModel model;

        [SetUp]
        public void Setup()
        {
            model = new EncounterViewModel();
        }

        [Test]
        public void ModelContainsEnvironments()
        {
            Assert.That(model.Environments, Is.EquivalentTo(new[]
            {
                EnvironmentConstants.Aquatic,
                EnvironmentConstants.Civilized,
                EnvironmentConstants.Desert,
                EnvironmentConstants.Forest,
                EnvironmentConstants.Hills,
                EnvironmentConstants.Marsh,
                EnvironmentConstants.Mountain,
                EnvironmentConstants.Plains,
                EnvironmentConstants.Underground,
            }));
        }

        [Test]
        public void ModelContainsTemperatures()
        {
            Assert.That(model.Temperatures, Is.EquivalentTo(new[]
            {
                EnvironmentConstants.Temperatures.Cold,
                EnvironmentConstants.Temperatures.Temperate,
                EnvironmentConstants.Temperatures.Warm,
            }));
        }

        [Test]
        public void ModelContainsTimesOfDay()
        {
            Assert.That(model.TimesOfDay, Is.EquivalentTo(new[]
            {
                EnvironmentConstants.TimesOfDay.Day,
                EnvironmentConstants.TimesOfDay.Night,
            }));
        }

        [Test]
        public void ModelContainsCreatureTypes()
        {
            Assert.That(model.CreatureTypes, Is.EquivalentTo(new[]
            {
                CreatureDataConstants.Types.Aberration,
                CreatureDataConstants.Types.Animal,
                CreatureDataConstants.Types.Construct,
                CreatureDataConstants.Types.Dragon,
                CreatureDataConstants.Types.Elemental,
                CreatureDataConstants.Types.Fey,
                CreatureDataConstants.Types.Giant,
                CreatureDataConstants.Types.Humanoid,
                CreatureDataConstants.Types.MagicalBeast,
                CreatureDataConstants.Types.MonstrousHumanoid,
                CreatureDataConstants.Types.Ooze,
                CreatureDataConstants.Types.Outsider,
                CreatureDataConstants.Types.Plant,
                CreatureDataConstants.Types.Undead,
                CreatureDataConstants.Types.Vermin,
            }));
        }

        [Test]
        public void ModelHasDefaults()
        {
            Assert.That(model.Defaults, Is.Not.Null);
            Assert.That(model.Defaults.Temperature, Is.EqualTo(EnvironmentConstants.Temperatures.Temperate));
            Assert.That(model.Defaults.Environment, Is.EqualTo(EnvironmentConstants.Plains));
            Assert.That(model.Defaults.TimeOfDay, Is.EqualTo(EnvironmentConstants.TimesOfDay.Day));
            Assert.That(model.Defaults.Level, Is.EqualTo(1));
            Assert.That(model.Defaults.AllowAquatic, Is.False);
            Assert.That(model.Defaults.AllowUnderground, Is.False);
            Assert.That(model.Defaults.CreatureTypeFilters, Is.Empty);
        }
    }
}
