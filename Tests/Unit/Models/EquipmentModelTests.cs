using DNDGenSite.Models;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Models
{
    [TestFixture]
    public class EquipmentModelTests
    {
        private EquipmentModel model;

        [SetUp]
        public void Setup()
        {
            model = new EquipmentModel();
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