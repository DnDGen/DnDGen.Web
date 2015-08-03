using DNDGenSite.Controllers;
using DNDGenSite.Controllers.Treasures;
using NUnit.Framework;

namespace DNDGenSite.Tests.Integration.App_Start
{
    [TestFixture]
    public class WebModuleTests : IntegrationTests
    {
        [Test]
        public void ViewControllerIsInjected()
        {
            var controller = GetNewInstanceOf<ViewController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void DiceControllerIsInjected()
        {
            var controller = GetNewInstanceOf<DiceController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void TreasureControllerIsInjected()
        {
            var controller = GetNewInstanceOf<TreasureController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void CoinControllerIsInjected()
        {
            var controller = GetNewInstanceOf<CoinController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void GoodsControllerIsInjected()
        {
            var controller = GetNewInstanceOf<GoodsController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void ItemsControllerIsInjected()
        {
            var controller = GetNewInstanceOf<ItemsController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void AlchemicalItemControllerIsInjected()
        {
            var controller = GetNewInstanceOf<AlchemicalItemController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void ToolControllerIsInjected()
        {
            var controller = GetNewInstanceOf<ToolController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void ArmorControllerIsInjected()
        {
            var controller = GetNewInstanceOf<ArmorController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void PotionControllerIsInjected()
        {
            var controller = GetNewInstanceOf<PotionController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void RingControllerIsInjected()
        {
            var controller = GetNewInstanceOf<RingController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void RodControllerIsInjected()
        {
            var controller = GetNewInstanceOf<RodController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void ScrollControllerIsInjected()
        {
            var controller = GetNewInstanceOf<ScrollController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void StaffControllerIsInjected()
        {
            var controller = GetNewInstanceOf<StaffController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void WandControllerIsInjected()
        {
            var controller = GetNewInstanceOf<WandController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void WeaponControllerIsInjected()
        {
            var controller = GetNewInstanceOf<WeaponController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void WondrousItemControllerIsInjected()
        {
            var controller = GetNewInstanceOf<WondrousItemController>();
            Assert.That(controller, Is.Not.Null);
        }
    }
}