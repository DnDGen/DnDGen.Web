using CharacterGen.Generators.Domain.Randomizers.Alignments;
using CharacterGen.Generators.Randomizers.Alignments;
using DNDGenSite.App_Start.Factories;
using Ninject;
using NUnit.Framework;

namespace DNDGenSite.Tests.Integration.App_Start.Factories
{
    [TestFixture]
    public class NinjectRuntimeFactoryTests : IntegrationTests
    {
        [Inject]
        public RuntimeFactory NinjectRuntimeFactory { get; set; }

        [Test]
        public void CreateRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<ISetAlignmentRandomizer>();
            Assert.That(randomizer, Is.InstanceOf<IAlignmentRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<ISetAlignmentRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<SetAlignmentRandomizer>());
        }

        [Test]
        public void CreateNamedRandomizer()
        {
            var randomizer = NinjectRuntimeFactory.Create<IAlignmentRandomizer>(AlignmentRandomizerTypeConstants.Any);
            Assert.That(randomizer, Is.InstanceOf<IAlignmentRandomizer>());
            Assert.That(randomizer, Is.InstanceOf<AnyAlignmentRandomizer>());
        }
    }
}
