using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.CharacterGen.Generators.Characters;
using DnDGen.CharacterGen.Leaders;
using DnDGen.CharacterGen.Verifiers;

namespace DnDGen.Api.CharacterGen.Tests.Integration
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
        public void EXTERNAL_CharacterGeneratorInjected()
        {
            var dice = InjectDependencyAndAssertDuration<ICharacterGenerator>();
            Assert.That(dice, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_LeadershipGeneratorInjected()
        {
            var dice = InjectDependencyAndAssertDuration<ILeadershipGenerator>();
            Assert.That(dice, Is.Not.Null);
        }

        [Test]
        public void EXTERNAL_RandomizerVerifierInjected()
        {
            var dice = InjectDependencyAndAssertDuration<IRandomizerVerifier>();
            Assert.That(dice, Is.Not.Null);
        }
    }
}
