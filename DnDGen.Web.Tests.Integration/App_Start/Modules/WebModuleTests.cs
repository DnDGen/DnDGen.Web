using CharacterGen.Characters;
using CharacterGen.Leaders;
using DnDGen.Web.App_Start;
using DnDGen.Web.Controllers;
using DnDGen.Web.Repositories;
using DnDGen.Web.Repositories.Domain;
using DungeonGen;
using EncounterGen.Generators;
using NUnit.Framework;
using RollGen;
using TreasureGen.Generators;

namespace DnDGen.Web.Tests.Integration.App_Start.Modules
{
    [TestFixture]
    public class WebModuleTests : IoCTests
    {
        [Test]
        public void HomeControllerIsInjected()
        {
            var controller = InjectAndAssertDuration<HomeController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void DependencyFactoryIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<IDependencyFactory>();
            Assert.That(controller, Is.Not.Null.And.InstanceOf<NinjectDependencyFactory>());
        }

        [Test]
        [Ignore("If the dependency factory resolves things, then we might skip this test")]
        public void RollControllerIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<RollController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void TreasureControllerIsInjected()
        {
            var controller = InjectAndAssertDuration<TreasureController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void CharacterControllerIsInjected()
        {
            var controller = InjectAndAssertDuration<CharacterController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void EncounterControllerIsInjected()
        {
            var controller = InjectAndAssertDuration<EncounterController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void DungeonControllerIsInjected()
        {
            var controller = InjectAndAssertDuration<DungeonController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void RandomizerRepositoryIsInjected()
        {
            var repository = InjectAndAssertDuration<IRandomizerRepository>();
            Assert.That(repository, Is.InstanceOf<RandomizerRepository>());
        }

        [Test]
        public void EXTERNAL_DiceInjected()
        {
            var dice = InjectAndAssertDuration<Dice>();
            Assert.That(dice, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_TreasureGeneratorInjected()
        {
            var generator = InjectAndAssertDuration<ITreasureGenerator>();
            Assert.That(generator, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_CharacterGeneratorInjected()
        {
            var generator = InjectAndAssertDuration<ICharacterGenerator>();
            Assert.That(generator, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_LeadershipGeneratorInjected()
        {
            var generator = InjectAndAssertDuration<ILeadershipGenerator>();
            Assert.That(generator, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_EncounterGeneratorInjected()
        {
            var generator = InjectAndAssertDuration<IEncounterGenerator>();
            Assert.That(generator, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_DungeonGeneratorInjected()
        {
            var generator = InjectAndAssertDuration<IDungeonGenerator>();
            Assert.That(generator, Is.Not.Null);
        }
    }
}