using DnDGen.EncounterGen.Models;
using DnDGen.Web.Models;
using NUnit.Framework;
using System.Linq;

namespace DnDGen.Web.Tests.Unit.Models
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
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Aquatic));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Civilized));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Desert));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Forest));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Hills));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Marsh));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Mountain));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Plains));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Underground));
            Assert.That(model.Environments.Count(), Is.EqualTo(9));
        }

        [Test]
        public void ModelContainsTemperatures()
        {
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Cold));
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Temperate));
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Warm));
            Assert.That(model.Temperatures.Count(), Is.EqualTo(3));
        }

        [Test]
        public void ModelContainsTimesOfDay()
        {
            Assert.That(model.TimesOfDay, Contains.Item(EnvironmentConstants.TimesOfDay.Day));
            Assert.That(model.TimesOfDay, Contains.Item(EnvironmentConstants.TimesOfDay.Night));
            Assert.That(model.TimesOfDay.Count(), Is.EqualTo(2));
        }

        [Test]
        public void ModelContainsCreatureTypes()
        {
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Aberration));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Animal));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Construct));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Dragon));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Elemental));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Fey));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Giant));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Humanoid));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.MagicalBeast));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.MonstrousHumanoid));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Ooze));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Outsider));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Plant));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Undead));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureDataConstants.Types.Vermin));
            Assert.That(model.CreatureTypes.Count(), Is.EqualTo(15));
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
