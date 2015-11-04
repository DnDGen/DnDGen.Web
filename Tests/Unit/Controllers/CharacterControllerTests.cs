using CharacterGen.Common;
using CharacterGen.Generators;
using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Randomizers.Stats;
using DNDGenSite.Controllers;
using DNDGenSite.Repositories;
using Moq;
using NUnit.Framework;
using System;
using System.Web.Mvc;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class CharacterControllerTests
    {
        private CharacterController controller;
        private Mock<ICharacterGenerator> mockCharacterGenerator;
        private Mock<IRandomizerRepository> mockRandomizerRepository;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockCharacterGenerator = new Mock<ICharacterGenerator>();
            controller = new CharacterController(mockRandomizerRepository.Object, mockCharacterGenerator.Object);
        }

        [Test]
        public void GenerateHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Generate");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type", "set alignment", "set class name", 9266, "set base race", true, "set metarace", 90210, 42, 600, 1337, 12345, 23456);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type", "set alignment", "set class name", 9266, "set base race", true, "set metarace", 90210, 42, 600, 1337, 12345, 23456) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsCharacterFromGenerator()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", "set alignment")).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", "set class name")).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 9266)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", "set base race")).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", true, "set metarace")).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 90210, 42, 600, 1337, 12345, 23456)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type", "set alignment", "set class name", 9266, "set base race", true, "set metarace", 90210, 42, 600, 1337, 12345, 23456) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.character, Is.EqualTo(character));
        }

        [Test]
        public void DoNotHaveToPassInOptionalParameters()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();
            var mockStatsRandomizer = new Mock<IStatsRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", String.Empty)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", String.Empty)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", String.Empty)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, String.Empty)).Returns(mockMetaraceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetStatsRandomizer("stat randomizer type", 0, 0, 0, 0, 0, 0)).Returns(mockStatsRandomizer.Object);

            var character = new Character();
            mockCharacterGenerator.Setup(g => g.GenerateWith(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object, mockStatsRandomizer.Object))
                .Returns(character);

            var result = controller.Generate("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "stat randomizer type") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.character, Is.EqualTo(character));
        }
    }
}
