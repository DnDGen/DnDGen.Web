using CharacterGen.Abilities;
using CharacterGen.Characters;
using CharacterGen.Feats;
using CharacterGen.Skills;
using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using DungeonGen;
using EncounterGen.Common;
using EncounterGen.Generators;
using EventGen;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Linq;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class DungeonControllerTests
    {
        private DungeonController controller;
        private Mock<IDungeonGenerator> mockDungeonGenerator;
        private Random random;
        private EncounterSpecifications environment;
        private Mock<ClientIDManager> mockClientIdManager;
        private Guid clientId;

        [SetUp]
        public void Setup()
        {
            mockDungeonGenerator = new Mock<IDungeonGenerator>();
            mockClientIdManager = new Mock<ClientIDManager>();
            controller = new DungeonController(mockDungeonGenerator.Object, mockClientIdManager.Object);
            random = new Random();
            clientId = Guid.NewGuid();
            environment = new EncounterSpecifications();
        }

        [TestCase("Index")]
        [TestCase("GenerateFromHall")]
        [TestCase("GenerateFromDoor")]
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
        public void IndexModelContainsTempreatures()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as EncounterViewModel;
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Cold));
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Temperate));
            Assert.That(model.Temperatures, Contains.Item(EnvironmentConstants.Temperatures.Warm));
            Assert.That(model.Temperatures.Count(), Is.EqualTo(3));
        }

        [Test]
        public void IndexModelContainsEnvironments()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as EncounterViewModel;
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Aquatic));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Civilized));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Desert));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Underground));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Forest));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Hills));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Marsh));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Mountain));
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Plains));
            Assert.That(model.Environments.Count(), Is.EqualTo(9));
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
        public void GenerateFromHallReturnsJsonResult()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, environment)).Returns(areas);

            var result = controller.GenerateFromHall(clientId, 9266, environment);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateFromHallSetsClientId()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, environment)).Returns(areas);

            var result = controller.GenerateFromHall(clientId, 9266, environment);
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void GenerateFromHallJsonReturnsGeneratedAreas()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, environment)).Returns(areas);

            var result = controller.GenerateFromHall(clientId, 9266, environment) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.areas, Is.EqualTo(areas));
        }

        private Area CreateAreaWithCharacterEncounters()
        {
            var area = new Area();
            area.Contents.Encounters = new[] { CreateEncounterWithCharacters(), CreateEncounterWithCharacters() };
            area.Contents.Pool = new Pool();
            area.Contents.Pool.Encounter = CreateEncounterWithCharacters();

            return area;
        }

        private Encounter CreateEncounterWithCharacters()
        {
            var encounter = new Encounter();
            encounter.Characters = new[] { CreateCharacter(), CreateCharacter() };

            return encounter;
        }

        private Character CreateCharacter()
        {
            var character = new Character();

            character.Feats.Additional = new[]
            {
                new Feat { Name = Guid.NewGuid().ToString() },
                new Feat { Name = Guid.NewGuid().ToString() },
                new Feat { Name = Guid.NewGuid().ToString() }
            };

            character.Skills = new[]
            {
                new Skill("zzzz", new Ability(string.Empty), int.MaxValue) { Ranks = random.Next() },
                new Skill("aaaa", new Ability(string.Empty), int.MaxValue, "ccccc") { Ranks = random.Next() },
                new Skill("aaaa", new Ability(string.Empty), int.MaxValue, "bbbbb") { Ranks = random.Next() },
                new Skill("kkkk", new Ability(string.Empty), int.MaxValue) { Ranks = random.Next() },
            };

            return character;
        }

        [Test]
        public void GenerateFromHallSortsCharacterSkills()
        {
            var areas = new[] { CreateAreaWithCharacterEncounters(), CreateAreaWithCharacterEncounters() };
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, environment)).Returns(areas);

            var result = controller.GenerateFromHall(clientId, 9266, environment) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.areas, Is.EqualTo(areas));
            Assert.That(areas, Is.Not.Empty);

            foreach (var area in areas)
            {
                Assert.That(area.Contents.Encounters, Is.Not.Empty);

                foreach (var encounter in area.Contents.Encounters)
                {
                    Assert.That(encounter.Characters, Is.Not.Empty);

                    foreach (var character in encounter.Characters)
                    {
                        Assert.That(character.Skills, Is.Not.Empty);
                        Assert.That(character.Skills, Is.Ordered.By("Name").Then.By("Focus"));
                    }
                }

                Assert.That(area.Contents.Pool.Encounter.Characters, Is.Not.Empty);

                foreach (var character in area.Contents.Pool.Encounter.Characters)
                {
                    Assert.That(character.Skills, Is.Not.Empty);
                    Assert.That(character.Skills, Is.Ordered.By("Name").Then.By("Focus"));
                }
            }
        }

        [Test]
        public void GenerateFromDoorReturnsJsonResult()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, environment)).Returns(areas);

            var result = controller.GenerateFromDoor(clientId, 9266, environment);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateFromDoorSetsClientId()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, environment)).Returns(areas);

            var result = controller.GenerateFromDoor(clientId, 9266, environment);
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void GenerateFromDoorJsonReturnsGeneratedAreas()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, environment)).Returns(areas);

            var result = controller.GenerateFromDoor(clientId, 9266, environment) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.areas, Is.EqualTo(areas));
        }

        [Test]
        public void GenerateFromDoorSortsCharacterSkills()
        {
            var areas = new[] { CreateAreaWithCharacterEncounters(), CreateAreaWithCharacterEncounters() };
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, environment)).Returns(areas);

            var result = controller.GenerateFromDoor(clientId, 9266, environment) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.areas, Is.EqualTo(areas));
            Assert.That(areas, Is.Not.Empty);

            foreach (var area in areas)
            {
                Assert.That(area.Contents.Encounters, Is.Not.Empty);

                foreach (var encounter in area.Contents.Encounters)
                {
                    Assert.That(encounter.Characters, Is.Not.Empty);

                    foreach (var character in encounter.Characters)
                    {
                        Assert.That(character.Skills, Is.Not.Empty);
                        Assert.That(character.Skills, Is.Ordered.By("Name").Then.By("Focus"));
                    }
                }

                Assert.That(area.Contents.Pool.Encounter.Characters, Is.Not.Empty);

                foreach (var character in area.Contents.Pool.Encounter.Characters)
                {
                    Assert.That(character.Skills, Is.Not.Empty);
                    Assert.That(character.Skills, Is.Ordered.By("Name").Then.By("Focus"));
                }
            }
        }
    }
}
