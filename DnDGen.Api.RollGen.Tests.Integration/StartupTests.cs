using DnDGen.Api.RollGen.Dependencies;
using DnDGen.RollGen;

namespace DnDGen.Api.RollGen.Tests.Integration
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
        public void EXTERNAL_DiceInjected()
        {
            var dice = InjectDependencyAndAssertDuration<Dice>();
            Assert.That(dice, Is.Not.Null);
        }
    }
}
