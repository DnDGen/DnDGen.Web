using DnDGen.Web.App_Start;
using DnDGen.Web.Controllers;
using DungeonGen;
using EncounterGen.Generators;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Integration.App_Start.Modules
{
    [TestFixture]
    public class WebModuleTests : IoCTests
    {
        [Test]
        public void HomeControllerIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<HomeController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void DependencyFactoryIsInjected()
        {
            var controller = InjectServiceAndAssertDuration<IDependencyFactory>();
            Assert.That(controller, Is.Not.Null.And.InstanceOf<NinjectDependencyFactory>());
        }

        [Test]
        public void RollControllerIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<RollController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void TreasureControllerIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<TreasureController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void CharacterControllerIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<CharacterController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void EncounterControllerIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<EncounterController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void DungeonControllerIsInjected()
        {
            var controller = InjectControllerAndAssertDuration<DungeonController>();
            Assert.That(controller, Is.Not.Null);
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