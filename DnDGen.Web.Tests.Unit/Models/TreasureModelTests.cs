using DnDGen.Web.Models;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Unit.Models
{
    [TestFixture]
    public class TreasureModelTests
    {
        private TreasureViewModel model;

        [SetUp]
        public void Setup()
        {
            model = new TreasureViewModel();
        }

        [Test]
        public void ModelIsInitialized()
        {
            Assert.That(model.MaxTreasureLevel, Is.EqualTo(0));
            Assert.That(model.ItemPowers, Is.Empty);
            Assert.That(model.TreasureTypes, Is.Empty);
        }
    }
}