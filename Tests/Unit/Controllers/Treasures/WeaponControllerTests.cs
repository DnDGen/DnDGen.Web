using DNDGenSite.Controllers.Treasures;
using Moq;
using NUnit.Framework;
using System.Web.Mvc;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;
using TreasureGen.Generators.Items.Mundane;

namespace DNDGenSite.Tests.Unit.Controllers.Treasures
{
    [TestFixture]
    public class WeaponControllerTests
    {
        private WeaponController controller;
        private Mock<IMagicalItemGenerator> mockMagicalWeaponGenerator;
        private Mock<IMundaneItemGenerator> mockMundaneWeaponGenerator;

        [SetUp]
        public void Setup()
        {
            mockMagicalWeaponGenerator = new Mock<IMagicalItemGenerator>();
            mockMundaneWeaponGenerator = new Mock<IMundaneItemGenerator>();
            controller = new WeaponController(mockMagicalWeaponGenerator.Object, mockMundaneWeaponGenerator.Object);
        }

        [Test]
        public void GenerateHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Generate");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var result = controller.Generate(PowerConstants.Mundane);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var result = controller.Generate(PowerConstants.Mundane) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsMundaneWeaponFromGenerator()
        {
            var item = new Item { ItemType = ItemTypeConstants.Weapon };
            mockMundaneWeaponGenerator.Setup(g => g.Generate()).Returns(item);

            var result = controller.Generate(PowerConstants.Mundane) as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void GenerateReturnsMagicalWeaponFromGenerator()
        {
            var item = new Item { ItemType = ItemTypeConstants.Weapon };
            mockMagicalWeaponGenerator.Setup(g => g.GenerateAtPower("power")).Returns(item);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void ItemTypeMustBeWeapon()
        {
            var item = new Item { ItemType = ItemTypeConstants.Weapon };
            var otherItem = new Item { ItemType = "other" };
            mockMagicalWeaponGenerator.SetupSequence(g => g.GenerateAtPower("power"))
                .Returns(otherItem)
                .Returns(item);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}