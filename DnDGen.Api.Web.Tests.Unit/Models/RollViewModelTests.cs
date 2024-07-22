using DnDGen.Api.Web.Models;
using DnDGen.RollGen;

namespace DnDGen.Api.Web.Tests.Unit.Models
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
