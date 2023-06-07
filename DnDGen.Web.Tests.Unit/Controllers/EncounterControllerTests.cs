using CharacterGen.Abilities;
using CharacterGen.Characters;
using CharacterGen.Skills;
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
            controller = new EncounterController(mockEncounterGenerator.Object, mockEncounterVerifier.Object, mockClientIdManager.Object);

            clientId = Guid.NewGuid();
            filters = new List<string>();
            encounterSpecifications = new EncounterSpecifications();

            encounterSpecifications.CreatureTypeFilters = filters;
        }

        [TestCase("Index")]
        [TestCase("Generate")]
        [TestCase("Validate")]
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

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            mockEncounterGenerator.Setup(g => g.Generate(encounterSpecifications)).Returns(encounter);

            var result = controller.Generate(clientId, encounterSpecifications);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateSetsClientId()
        {
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            mockEncounterGenerator.Setup(g => g.Generate(encounterSpecifications)).Returns(encounter);

            var result = controller.Generate(clientId, encounterSpecifications);
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void GenerateJsonReturnsGeneratedEncounter()
        {
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            mockEncounterGenerator.Setup(g => g.Generate(encounterSpecifications)).Returns(encounter);

            var result = controller.Generate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.encounter, Is.EqualTo(encounter));
        }

        [Test]
        public void GenerateSortsCharacterSkills()
        {
            var character = new Character();
            var otherCharacter = new Character();
            var encounter = new Encounter();

            encounter.Characters = new[] { character, otherCharacter };
            mockEncounterGenerator.Setup(g => g.Generate(encounterSpecifications)).Returns(encounter);

            character.Skills = new[]
            {
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            };

            otherCharacter.Skills = new[]
            {
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 2345 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 3456 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 4567 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 5678 },
            };

            var result = controller.Generate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.encounter, Is.EqualTo(encounter));

            var firstCharacter = encounter.Characters.First();
            var lastCharacter = encounter.Characters.Last();

            Assert.That(encounter.Characters.Count(), Is.EqualTo(2));
            Assert.That(firstCharacter, Is.Not.EqualTo(lastCharacter));
            Assert.That(firstCharacter, Is.EqualTo(character));
            Assert.That(firstCharacter.Skills, Is.Ordered.By("Name").Then.By("Focus"));
            Assert.That(lastCharacter, Is.EqualTo(otherCharacter));
            Assert.That(lastCharacter.Skills, Is.Ordered.By("Name").Then.By("Focus"));
        }

        [Test]
        public void GenerateJsonUsesFilters()
        {
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            filters.Add("filter 1");
            filters.Add("filter 2");
            mockEncounterGenerator.Setup(g => g.Generate(encounterSpecifications)).Returns(encounter);

            var result = controller.Generate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.encounter, Is.EqualTo(encounter));
        }

        [Test]
        public void ValidateReturnsJsonResult()
        {
            filters.Add("filter 1");
            filters.Add("filter 2");
            mockEncounterVerifier.Setup(g => g.ValidEncounterExistsAtLevel(encounterSpecifications)).Returns(true);

            var result = controller.Validate(clientId, encounterSpecifications);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void ValidatSetsClientId()
        {
            filters.Add("filter 1");
            filters.Add("filter 2");
            mockEncounterVerifier.Setup(g => g.ValidEncounterExistsAtLevel(encounterSpecifications)).Returns(true);

            var result = controller.Validate(clientId, encounterSpecifications);
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void ValidateJsonReturnsValid()
        {
            filters.Add("filter 1");
            filters.Add("filter 2");
            mockEncounterVerifier.Setup(g => g.ValidEncounterExistsAtLevel(encounterSpecifications)).Returns(true);

            var result = controller.Validate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.isValid, Is.True);
        }

        [Test]
        public void ValidateJsonReturnsInvalid()
        {
            filters.Add("filter 1");
            filters.Add("filter 2");
            mockEncounterVerifier.Setup(g => g.ValidEncounterExistsAtLevel(encounterSpecifications)).Returns(false);

            var result = controller.Validate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void ValidateJsonReturnsInvalidIfErrorOccurs()
        {
            filters.Add("filter 1");
            filters.Add("filter 2");
            mockEncounterVerifier.Setup(g => g.ValidEncounterExistsAtLevel(encounterSpecifications)).Throws<NullReferenceException>();

            var result = controller.Validate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void CanValidateNullFilters()
        {
            encounterSpecifications.CreatureTypeFilters = null;
            mockEncounterVerifier.Setup(g => g.ValidEncounterExistsAtLevel(encounterSpecifications)).Returns(true);

            var result = controller.Validate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.isValid, Is.True);
        }

        [Test]
        public void CanGenerateNullFilters()
        {
            encounterSpecifications.CreatureTypeFilters = null;
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            mockEncounterGenerator.Setup(g => g.Generate(encounterSpecifications)).Returns(encounter);

            var result = controller.Generate(clientId, encounterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.encounter, Is.EqualTo(encounter));
        }
    }
}
