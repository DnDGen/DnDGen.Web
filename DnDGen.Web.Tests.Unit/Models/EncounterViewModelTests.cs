using DnDGen.Web.Models;
using EncounterGen.Common;
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
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Aberration));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Animal));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Construct));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Dragon));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Elemental));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Fey));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Giant));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Humanoid));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.MagicalBeast));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.MonstrousHumanoid));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Ooze));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Outsider));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Plant));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Undead));
            Assert.That(model.CreatureTypes, Contains.Item(CreatureConstants.Types.Vermin));
            Assert.That(model.CreatureTypes.Count(), Is.EqualTo(15));
        }

        [Test]
        public void ModelHasDefaultEncounterSpecifications()
        {
            Assert.That(model.EncounterSpecifications, Is.Not.Null);
            Assert.That(model.EncounterSpecifications.AllowAquatic, Is.False);
            Assert.That(model.EncounterSpecifications.AllowUnderground, Is.False);
            Assert.That(model.EncounterSpecifications.CreatureTypeFilters, Is.Empty);
            Assert.That(model.EncounterSpecifications.Environment, Is.EqualTo(model.Environments.First()));
            Assert.That(model.EncounterSpecifications.Level, Is.EqualTo(1));
            Assert.That(model.EncounterSpecifications.Temperature, Is.EqualTo(model.Temperatures.First()));
            Assert.That(model.EncounterSpecifications.TimeOfDay, Is.EqualTo(model.TimesOfDay.First()));
        }
    }
}
