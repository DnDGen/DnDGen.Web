using DnDGen.Api.CharacterGen.Models;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Models
{
    [TestFixture]
    internal class RandomizerTypeConstantsTests
    {
        [TestCase(RandomizerTypeConstants.Set, "Set")]
        public void RandomizerTypeConstant_HasCorrectValue(string constant, string value)
        {
            Assert.That(constant, Is.EqualTo(value));
        }
    }
}
