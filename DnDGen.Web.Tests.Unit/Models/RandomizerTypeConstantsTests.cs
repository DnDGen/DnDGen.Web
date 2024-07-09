using DnDGen.Web.Models;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Unit.Models
{
    [TestFixture]
    public class RandomizerTypeConstantsTests
    {
        [TestCase(RandomizerTypeConstants.Set, "Set")]
        public void Constant(string constant, string value)
        {
            Assert.That(constant, Is.EqualTo(value));
        }
    }
}
