using DnDGen.RollGen;
using DnDGen.Web.Models;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Unit.Models
{
    internal class RollViewModelTests
    {
        [Test]
        public void Model_HasLimits()
        {
            var model = new RollViewModel();
            Assert.That(model.QuantityLimit_Lower, Is.EqualTo(1));
            Assert.That(model.QuantityLimit_Upper, Is.EqualTo(10_000).And.EqualTo(Limits.Quantity));
            Assert.That(model.DieLimit_Lower, Is.EqualTo(1));
            Assert.That(model.DieLimit_Upper, Is.EqualTo(10_000).And.EqualTo(Limits.Die));
        }
    }
}
