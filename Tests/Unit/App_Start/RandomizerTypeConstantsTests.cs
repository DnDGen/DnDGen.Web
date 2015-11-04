using DNDGenSite.App_Start.Factories;
using NUnit.Framework;
using System;

namespace DNDGenSite.Tests.Unit.App_Start
{
    [TestFixture]
    public class RandomizerTypeConstantsTests
    {
        [TestCase(RandomizerTypeConstants.Set, "Set")]
        public void Constant(String constant, String value)
        {
            Assert.That(constant, Is.EqualTo(value));
        }
    }
}
