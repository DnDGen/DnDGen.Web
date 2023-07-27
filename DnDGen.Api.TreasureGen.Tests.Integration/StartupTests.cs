using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.TreasureGen.Generators;

namespace DnDGen.Api.TreasureGen.Tests.Integration
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
        public void EXTERNAL_TreasureGeneratorInjected()
        {
            var dice = InjectDependencyAndAssertDuration<ITreasureGenerator>();
            Assert.That(dice, Is.Not.Null);
        }
    }
}
