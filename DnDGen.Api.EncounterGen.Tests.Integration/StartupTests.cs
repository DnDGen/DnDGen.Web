using DnDGen.Api.EncounterGen.Dependencies;
using DnDGen.EncounterGen.Generators;

namespace DnDGen.Api.EncounterGen.Tests.Integration
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
        public void EXTERNAL_EncounterGeneratorInjected()
        {
            var dice = InjectDependencyAndAssertDuration<IEncounterGenerator>();
            Assert.That(dice, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_EncounterVerifierInjected()
        {
            var dice = InjectDependencyAndAssertDuration<IEncounterVerifier>();
            Assert.That(dice, Is.Not.Null);
        }
    }
}
