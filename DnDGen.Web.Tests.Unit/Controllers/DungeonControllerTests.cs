using CharacterGen;
using CharacterGen.Abilities.Feats;
using CharacterGen.Abilities.Skills;
using DnDGen.Web.Controllers;
using DungeonGen;
using EncounterGen.Common;
using Moq;
using NUnit.Framework;
using System;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class DungeonControllerTests
    {
        private DungeonController controller;
        private Mock<IDungeonGenerator> mockDungeonGenerator;
        private Random random;

        [SetUp]
        public void Setup()
        {
            mockDungeonGenerator = new Mock<IDungeonGenerator>();
            controller = new DungeonController(mockDungeonGenerator.Object);
            random = new Random();
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
        public void GenerateFromHallReturnsJsonResult()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromHall(9266, 90210);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateFromHallJsonAllowsGet()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromHall(9266, 90210) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateFromHallJsonReturnsGeneratedAreas()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromHall(9266, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.areas, Is.EqualTo(areas));
        }

        [Test]
        public void GenerateFromHallSortsCharacterFeats()
        {
            var areas = new[] { CreateAreaWithCharacterEncounters(), CreateAreaWithCharacterEncounters() };
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromHall(9266, 90210) as JsonResult;
            dynamic data = result.Data;
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
                        Assert.That(character.Ability.Feats, Is.Not.Empty);
                        Assert.That(character.Ability.Feats, Is.Ordered.By("Name"));
                    }
                }

                Assert.That(area.Contents.Pool.Encounter.Characters, Is.Not.Empty);

                foreach (var character in area.Contents.Pool.Encounter.Characters)
                {
                    Assert.That(character.Ability.Feats, Is.Not.Empty);
                    Assert.That(character.Ability.Feats, Is.Ordered.By("Name"));
                }
            }
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

            character.Ability.Feats = new[]
            {
                new Feat { Name = Guid.NewGuid().ToString() },
                new Feat { Name = Guid.NewGuid().ToString() },
                new Feat { Name = Guid.NewGuid().ToString() }
            };

            character.Ability.Skills[Guid.NewGuid().ToString()] = new Skill { Ranks = random.Next() };
            character.Ability.Skills[Guid.NewGuid().ToString()] = new Skill { Ranks = random.Next() };
            character.Ability.Skills[Guid.NewGuid().ToString()] = new Skill { Ranks = random.Next() };

            return character;
        }

        [Test]
        public void GenerateFromHallSortsCharacterSkills()
        {
            var areas = new[] { CreateAreaWithCharacterEncounters(), CreateAreaWithCharacterEncounters() };
            mockDungeonGenerator.Setup(g => g.GenerateFromHall(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromHall(9266, 90210) as JsonResult;
            dynamic data = result.Data;
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
                        Assert.That(character.Ability.Skills, Is.Not.Empty);
                        Assert.That(character.Ability.Skills, Is.Ordered.By("Key"));
                    }
                }

                Assert.That(area.Contents.Pool.Encounter.Characters, Is.Not.Empty);

                foreach (var character in area.Contents.Pool.Encounter.Characters)
                {
                    Assert.That(character.Ability.Skills, Is.Not.Empty);
                    Assert.That(character.Ability.Skills, Is.Ordered.By("Key"));
                }
            }
        }

        [Test]
        public void GenerateFromDoorReturnsJsonResult()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromDoor(9266, 90210);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateFromDoorJsonAllowsGet()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromDoor(9266, 90210) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateFromDoorJsonReturnsGeneratedAreas()
        {
            var areas = Enumerable.Empty<Area>();
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromDoor(9266, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.areas, Is.EqualTo(areas));
        }

        [Test]
        public void GenerateFromDoorSortsCharacterFeats()
        {
            var areas = new[] { CreateAreaWithCharacterEncounters(), CreateAreaWithCharacterEncounters() };
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromDoor(9266, 90210) as JsonResult;
            dynamic data = result.Data;
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
                        Assert.That(character.Ability.Feats, Is.Not.Empty);
                        Assert.That(character.Ability.Feats, Is.Ordered.By("Name"));
                    }
                }

                Assert.That(area.Contents.Pool.Encounter.Characters, Is.Not.Empty);

                foreach (var character in area.Contents.Pool.Encounter.Characters)
                {
                    Assert.That(character.Ability.Feats, Is.Not.Empty);
                    Assert.That(character.Ability.Feats, Is.Ordered.By("Name"));
                }
            }
        }

        [Test]
        public void GenerateFromDoorSortsCharacterSkills()
        {
            var areas = new[] { CreateAreaWithCharacterEncounters(), CreateAreaWithCharacterEncounters() };
            mockDungeonGenerator.Setup(g => g.GenerateFromDoor(9266, 90210)).Returns(areas);

            var result = controller.GenerateFromDoor(9266, 90210) as JsonResult;
            dynamic data = result.Data;
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
                        Assert.That(character.Ability.Skills, Is.Not.Empty);
                        Assert.That(character.Ability.Skills, Is.Ordered.By("Key"));
                    }
                }

                Assert.That(area.Contents.Pool.Encounter.Characters, Is.Not.Empty);

                foreach (var character in area.Contents.Pool.Encounter.Characters)
                {
                    Assert.That(character.Ability.Skills, Is.Not.Empty);
                    Assert.That(character.Ability.Skills, Is.Ordered.By("Key"));
                }
            }
        }
    }
}
