using CharacterGen.Randomizers.Alignments;
using CharacterGen.Randomizers.CharacterClasses;
using CharacterGen.Randomizers.Races;
using CharacterGen.Verifiers;
using DnDGen.Web.Controllers.Characters;
using DnDGen.Web.Models;
using DnDGen.Web.Repositories;
using EventGen;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Unit.Controllers.Characters
{
    [TestFixture]
    public class RandomizersControllerTests
    {
        private RandomizersController controller;
        private Mock<IRandomizerVerifier> mockRandomizerVerifier;
        private Mock<IRandomizerRepository> mockRandomizerRepository;
        private Mock<ClientIDManager> mockClientIdManager;
        private Guid clientId;
        private CharacterSpecifications characterSpecifications;

        [SetUp]
        public void Setup()
        {
            mockRandomizerRepository = new Mock<IRandomizerRepository>();
            mockRandomizerVerifier = new Mock<IRandomizerVerifier>();
            mockClientIdManager = new Mock<ClientIDManager>();
            controller = new RandomizersController(mockRandomizerRepository.Object, mockRandomizerVerifier.Object, mockClientIdManager.Object);

            clientId = Guid.NewGuid();
            characterSpecifications = new CharacterSpecifications();
            characterSpecifications.AlignmentRandomizerType = "alignment randomizer type";
            characterSpecifications.ClassNameRandomizerType = "class name randomizer type";
            characterSpecifications.LevelRandomizerType = "level randomizer type";
            characterSpecifications.BaseRaceRandomizerType = "base race randomizer type";
            characterSpecifications.MetaraceRandomizerType = "metarace randomizer type";
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
            var result = controller.Verify(clientId, characterSpecifications);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void VerifySetsClientId()
        {
            var result = controller.Verify(clientId, characterSpecifications) as JsonResult;
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void VerifyReturnsPositiveVerification()
        {
            characterSpecifications.ForceMetarace = true;
            characterSpecifications.SetAlignment = "set alignment";
            characterSpecifications.SetBaseRace = "set base race";
            characterSpecifications.SetClassName = "set class name";
            characterSpecifications.SetLevel = 9266;
            characterSpecifications.SetMetarace = "set metarace";

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

            var result = controller.Verify(clientId, characterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.compatible, Is.True);
        }

        [Test]
        public void VerifyReturnsNegativeVerification()
        {
            characterSpecifications.ForceMetarace = true;
            characterSpecifications.SetAlignment = "set alignment";
            characterSpecifications.SetBaseRace = "set base race";
            characterSpecifications.SetClassName = "set class name";
            characterSpecifications.SetLevel = 9266;
            characterSpecifications.SetMetarace = "set metarace";

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

            var result = controller.Verify(clientId, characterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.compatible, Is.False);
        }

        [Test]
        public void VerifyReturnsNegativeVerificationIfErrorOccurs()
        {
            characterSpecifications.ForceMetarace = true;
            characterSpecifications.SetAlignment = "set alignment";
            characterSpecifications.SetBaseRace = "set base race";
            characterSpecifications.SetClassName = "set class name";
            characterSpecifications.SetLevel = 9266;
            characterSpecifications.SetMetarace = "set metarace";

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
                .Throws<NullReferenceException>();

            var result = controller.Verify(clientId, characterSpecifications) as JsonResult;
            dynamic data = result.Value;
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

            mockRandomizerRepository.Setup(r => r.GetAlignmentRandomizer("alignment randomizer type", null)).Returns(mockAlignmentRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetClassNameRandomizer("class name randomizer type", null)).Returns(mockClassNameRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetLevelRandomizer("level randomizer type", 0)).Returns(mockLevelRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetBaseRaceRandomizer("base race randomizer type", null)).Returns(mockBaseRaceRandomizer.Object);
            mockRandomizerRepository.Setup(r => r.GetMetaraceRandomizer("metarace randomizer type", false, null)).Returns(mockMetaraceRandomizer.Object);

            mockRandomizerVerifier.Setup(g => g.VerifyCompatibility(mockAlignmentRandomizer.Object, mockClassNameRandomizer.Object, mockLevelRandomizer.Object, mockBaseRaceRandomizer.Object, mockMetaraceRandomizer.Object))
                .Returns(true);

            var result = controller.Verify(clientId, characterSpecifications) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.compatible, Is.True);
        }
    }
}
