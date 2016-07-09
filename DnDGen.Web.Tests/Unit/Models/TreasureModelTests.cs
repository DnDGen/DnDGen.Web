using DnDGen.Web.Models;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Unit.Models
{
    [TestFixture]
    public class TreasureModelTests
    {
        private TreasureModel model;

        [SetUp]
        public void Setup()
        {
            model = new TreasureModel();
        }

        [Test]
        public void ModelIsInitialized()
        {
            Assert.That(model.MaxTreasureLevel, Is.EqualTo(0));
            Assert.That(model.MundaneItemTypes, Is.Empty);
            Assert.That(model.PoweredItemTypes, Is.Empty);
            Assert.That(model.TreasureTypes, Is.Empty);
        }
    }
}