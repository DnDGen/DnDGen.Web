using CharacterGen.Common;
using CharacterGen.Common.Abilities.Feats;
using CharacterGen.Common.Abilities.Skills;
using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using EncounterGen.Common;
using EncounterGen.Generators;
using Moq;
using NUnit.Framework;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class EncounterControllerTests
    {
        private EncounterController controller;
        private Mock<IEncounterGenerator> mockEncounterGenerator;

        [SetUp]
        public void Setup()
        {
            mockEncounterGenerator = new Mock<IEncounterGenerator>();
            controller = new EncounterController(mockEncounterGenerator.Object);
        }

        [TestCase("Index")]
        [TestCase("Generate")]
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
            Assert.That(result.Model, Is.InstanceOf<EncounterModel>());
        }

        [Test]
        public void IndexModelOnlyContainsDungeonEnvironment()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as EncounterModel;
            Assert.That(model.Environments, Contains.Item(EnvironmentConstants.Dungeon));
            Assert.That(model.Environments.Count(), Is.EqualTo(1));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            mockEncounterGenerator.Setup(g => g.Generate("environment", 9266)).Returns(encounter);

            var result = controller.Generate("environment", 9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonAllowsGet()
        {
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            mockEncounterGenerator.Setup(g => g.Generate("environment", 9266)).Returns(encounter);

            var result = controller.Generate("environment", 9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateJsonReturnsGeneratedEncounter()
        {
            var encounter = new Encounter();
            encounter.Characters = Enumerable.Empty<Character>();
            mockEncounterGenerator.Setup(g => g.Generate("environment", 9266)).Returns(encounter);

            var result = controller.Generate("environment", 9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.encounter, Is.EqualTo(encounter));
        }

        [Test]
        public void GenerateSortsCharacterFeats()
        {
            var character = new Character();
            var otherCharacter = new Character();
            var encounter = new Encounter();

            encounter.Characters = new[] { character, otherCharacter };
            mockEncounterGenerator.Setup(g => g.Generate("environment", 9266)).Returns(encounter);

            character.Ability.Feats = new[]
            {
                new Feat { Name = "zzzz" },
                new Feat { Name = "aaa" },
                new Feat { Name = "kkkk" }
            };

            otherCharacter.Ability.Feats = new[]
            {
                new Feat { Name = "a" },
                new Feat { Name = "aa" },
                new Feat { Name = "a" }
            };

            var result = controller.Generate("environment", 9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.encounter, Is.EqualTo(encounter));

            var firstCharacter = encounter.Characters.First();
            var lastCharacter = encounter.Characters.Last();

            Assert.That(encounter.Characters.Count(), Is.EqualTo(2));
            Assert.That(firstCharacter, Is.Not.EqualTo(lastCharacter));
            Assert.That(firstCharacter, Is.EqualTo(character));
            Assert.That(firstCharacter.Ability.Feats, Is.Ordered.By("Name"));
            Assert.That(lastCharacter, Is.EqualTo(otherCharacter));
            Assert.That(lastCharacter.Ability.Feats, Is.Ordered.By("Name"));
        }

        [Test]
        public void GenerateSortsCharacterSkills()
        {
            var character = new Character();
            var otherCharacter = new Character();
            var encounter = new Encounter();

            encounter.Characters = new[] { character, otherCharacter };
            mockEncounterGenerator.Setup(g => g.Generate("environment", 9266)).Returns(encounter);

            character.Ability.Skills["zzzz"] = new Skill { Ranks = 42 };
            character.Ability.Skills["aaaa"] = new Skill { Ranks = 600 };
            character.Ability.Skills["kkkk"] = new Skill { Ranks = 1337 };

            otherCharacter.Ability.Skills["a"] = new Skill { Ranks = 1234 };
            otherCharacter.Ability.Skills["b"] = new Skill { Ranks = 2345 };
            otherCharacter.Ability.Skills["aa"] = new Skill { Ranks = 3456 };

            var result = controller.Generate("environment", 9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.encounter, Is.EqualTo(encounter));

            var firstCharacter = encounter.Characters.First();
            var lastCharacter = encounter.Characters.Last();

            Assert.That(encounter.Characters.Count(), Is.EqualTo(2));
            Assert.That(firstCharacter, Is.Not.EqualTo(lastCharacter));
            Assert.That(firstCharacter, Is.EqualTo(character));
            Assert.That(firstCharacter.Ability.Skills, Is.Ordered.By("Key"));
            Assert.That(lastCharacter, Is.EqualTo(otherCharacter));
            Assert.That(lastCharacter.Ability.Skills, Is.Ordered.By("Key"));

            Assert.That(firstCharacter.Ability.Skills["aaaa"].Ranks, Is.EqualTo(600));
            Assert.That(firstCharacter.Ability.Skills["kkkk"].Ranks, Is.EqualTo(1337));
            Assert.That(firstCharacter.Ability.Skills["zzzz"].Ranks, Is.EqualTo(42));
            Assert.That(lastCharacter.Ability.Skills["a"].Ranks, Is.EqualTo(1234));
            Assert.That(lastCharacter.Ability.Skills["aa"].Ranks, Is.EqualTo(3456));
            Assert.That(lastCharacter.Ability.Skills["b"].Ranks, Is.EqualTo(2345));
        }
    }
}
