using DnDGen.EncounterGen.Models;
using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Linq;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class EncounterControllerTests
    {
        private EncounterController controller;

        [SetUp]
        public void Setup()
        {
            controller = new EncounterController();
        }

        [TestCase("Index")]
        public void ActionHandlesGetVerb(string methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void IndexReturnsView()
        {
            var result = controller.Index();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void IndexViewContainsModel()
        {
            var result = controller.Index() as ViewResult;
            Assert.That(result.Model, Is.InstanceOf<EncounterViewModel>());
        }

        [Test]
        public void IndexModelContainsEnvironments()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as EncounterViewModel;
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
        public void IndexModelContainsTemperatures()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as EncounterViewModel;
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Cold));
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Temperate));
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Warm));
            Assert.That(model.Temperatures.Count(), Is.EqualTo(3));
        }

        [Test]
        public void IndexModelContainsTimesOfDay()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as EncounterViewModel;
            Assert.That(model.TimesOfDay, Contains.Item(EnvironmentConstants.TimesOfDay.Day));
            Assert.That(model.TimesOfDay, Contains.Item(EnvironmentConstants.TimesOfDay.Night));
            Assert.That(model.TimesOfDay.Count(), Is.EqualTo(2));
        }

        [Test]
        public void IndexModelContainsCreatureTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as EncounterViewModel;
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
    }
}
