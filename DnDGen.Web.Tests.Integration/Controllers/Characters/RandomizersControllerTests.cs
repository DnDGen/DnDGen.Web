using CharacterGen.Verifiers;
using DnDGen.Web.Controllers.Characters;
using DnDGen.Web.Models;
using DnDGen.Web.Repositories;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Integration.Controllers.Characters
{
    [TestFixture]
    internal class RandomizersControllerTests : IntegrationTests
    {
        private RandomizersController controller;
        private IRandomizerRepository randomizerRepository;
        private IRandomizerVerifier randomizerVerifier;

        [SetUp]
        public void Setup()
        {
            controller = GetController<RandomizersController>();
            randomizerRepository = GetDependency<IRandomizerRepository>();
            randomizerVerifier = GetDependency<IRandomizerVerifier>();
        }

        [Test]
        public void BUG_DefaultRandomizersAreValid()
        {
            var clientId = Guid.NewGuid();
            var characterSpecifications = new CharacterSpecifications
            {
                AlignmentRandomizerType = "Any",
                //AllowLevelAdjustments = true,
                BaseRaceRandomizerType = "Any Base",
                ClassNameRandomizerType = "Any Player",
                ForceMetarace = false,
                LevelRandomizerType = "Any",
                MetaraceRandomizerType = "Any Meta",
                SetAlignment = "Lawful Good",
                SetBaseRace = "Aasimar",
                SetClassName = "Barbarian",
                SetLevel = 0,
                SetMetarace = "Ghost",
            };

            var result = controller.Verify(clientId, characterSpecifications);
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Value, Is.Not.Null);

            dynamic data = result.Value;
            Assert.That(data.compatible, Is.True);
        }

        [Test]
        public void BUG_RandomizerVerifierValidatesDefaultRandomizers()
        {
            var alignmentRandomizer = randomizerRepository.GetAlignmentRandomizer("Any", "Lawful Good");
            var classNameRandomizer = randomizerRepository.GetClassNameRandomizer("Any Player", "Barbarian");
            var levelRandomizer = randomizerRepository.GetLevelRandomizer("Any", 0);
            var baseRaceRandomizer = randomizerRepository.GetBaseRaceRandomizer("Any Base", "Aasimar");
            var metaraceRandomizer = randomizerRepository.GetMetaraceRandomizer("Any Meta", false, "Ghost");

            var compatible = randomizerVerifier.VerifyCompatibility(alignmentRandomizer, classNameRandomizer, levelRandomizer, baseRaceRandomizer, metaraceRandomizer);
            Assert.That(compatible, Is.True);
        }
    }
}
