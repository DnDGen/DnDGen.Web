using DnDGen.Web.App_Start;
using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using EncounterGen.Common;
using EncounterGen.Generators;
using EventGen;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class EncounterControllerTests
    {
        private EncounterController controller;
        private Mock<IEncounterGenerator> mockEncounterGenerator;
        private Mock<IEncounterVerifier> mockEncounterVerifier;
        private List<string> filters;
        private EncounterSpecifications encounterSpecifications;
        private Mock<ClientIDManager> mockClientIdManager;
        private Guid clientId;

        [SetUp]
        public void Setup()
        {
            mockEncounterGenerator = new Mock<IEncounterGenerator>();
            mockEncounterVerifier = new Mock<IEncounterVerifier>();
            mockClientIdManager = new Mock<ClientIDManager>();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IEncounterGenerator>()).Returns(mockEncounterGenerator.Object);
            mockDependencyFactory.Setup(f => f.Get<IEncounterVerifier>()).Returns(mockEncounterVerifier.Object);
            mockDependencyFactory.Setup(f => f.Get<ClientIDManager>()).Returns(mockClientIdManager.Object);

            controller = new EncounterController();

            clientId = Guid.NewGuid();
            filters = new List<string>();
            encounterSpecifications = new EncounterSpecifications();

            encounterSpecifications.CreatureTypeFilters = filters;
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
    }
}
