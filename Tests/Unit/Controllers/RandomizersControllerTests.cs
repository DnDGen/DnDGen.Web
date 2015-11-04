using CharacterGen.Generators.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.CharacterClasses;
using CharacterGen.Generators.Randomizers.Races;
using CharacterGen.Generators.Verifiers;
using DNDGenSite.Controllers;
using DNDGenSite.Repositories;
using Moq;
using NUnit.Framework;
using System;
using System.Web.Mvc;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class RandomizersControllerTests
    {
        private RandomizersController controller;
        private Mock<IRandomizerVerifier> mockRandomizerVerifier;
        private Mock<IRandomizerRepository> mockRandomizerRepository;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockRandomizerVerifier = new Mock<IRandomizerVerifier>();
            controller = new RandomizersController(mockRandomizerRepository.Object, mockRandomizerVerifier.Object);
        }

        [Test]
        public void VerifyHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Verify");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void VerifyReturnsJsonResult()
        {
            var result = controller.Verify("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "set alignment", "set class name", 9266, "set base race", true, "set metarace");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void VerifyJsonResultAllowsGet()
        {
            var result = controller.Verify("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "set alignment", "set class name", 9266, "set base race", true, "set metarace") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void VerifyReturnsPositiveVerification()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", "set alignment")).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", "set class name")).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 9266)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", "set base race")).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", true, "set metarace")).Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier.Setup(g => g.VerifyCompatibility(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object))
                .Returns(true);

            var result = controller.Verify("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "set alignment", "set class name", 9266, "set base race", true, "set metarace") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.compatible, Is.True);
        }

        [Test]
        public void VerifyReturnsNegativeVerification()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", "set alignment")).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", "set class name")).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 9266)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", "set base race")).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", true, "set metarace")).Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier.Setup(g => g.VerifyCompatibility(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object))
                .Returns(false);

            var result = controller.Verify("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type", "set alignment", "set class name", 9266, "set base race", true, "set metarace") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.compatible, Is.False);
        }

        [Test]
        public void DoNotHaveToPassInOptionalParameters()
        {
            var mockAlignmentRandomizer = new Mock<IAlignmentRandomizer>();
            var mockClassNameRandomizer = new Mock<IClassNameRandomizer>();
            var mockLevelRandomizer = new Mock<ILevelRandomizer>();
            var mockBaseRaceRandomizer = new Mock<RaceRandomizer>();
            var mockMetaraceRandomizer = new Mock<IForcableMetaraceRandomizer>();

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", String.Empty)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", String.Empty)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", String.Empty)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, String.Empty)).Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier.Setup(g => g.VerifyCompatibility(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object))
                .Returns(true);

            var result = controller.Verify("alignment randomizer type", "class name randomizer type", "level randomizer type", "base race randomizer type", "metarace randomizer type") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.compatible, Is.True);
        }
    }
}
