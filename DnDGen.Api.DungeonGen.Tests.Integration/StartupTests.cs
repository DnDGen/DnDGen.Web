using DnDGen.Api.DungeonGen.Dependencies;
using DnDGen.DungeonGen.Generators;
using DnDGen.EncounterGen.Generators;

namespace DnDGen.Api.DungeonGen.Tests.Integration
{
    public class StartupTests : IoCTests
    {
        [Test]
        public void DependencyFactoryIsInjected()
        {
            var factory = InjectServiceAndAssertDuration<IDependencyFactory>();
            Assert.That(factory, Is.Not.Null.And.InstanceOf<NinjectDependencyFactory>());
        }

        [Test]
        public void EXTERNAL_DungeonGeneratorInjected()
        {
            var generator = InjectDependencyAndAssertDuration<IDungeonGenerator>();
            Assert.That(generator, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_EncounterVerifierInjected()
        {
            var verifier = InjectDependencyAndAssertDuration<IEncounterVerifier>();
            Assert.That(verifier, Is.Not.Null);
        }
    }
}
