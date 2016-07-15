using DnDGen.Web.Controllers.Treasures;
using Moq;
using NUnit.Framework;
using System.Web.Mvc;
using TreasureGen.Items;
using TreasureGen.Items.Magical;
using TreasureGen.Items.Mundane;

namespace DnDGen.Web.Tests.Unit.Controllers.Treasures
{
    [TestFixture]
    public class ArmorControllerTests
    {
        private ArmorController controller;
        private Mock<MagicalItemGenerator> mockMagicalArmorGenerator;
        private Mock<MundaneItemGenerator> mockMundaneArmorGenerator;

        [SetUp]
        public void Setup()
        {
            mockMagicalArmorGenerator = new Mock<MagicalItemGenerator>();
            mockMundaneArmorGenerator = new Mock<MundaneItemGenerator>();
            controller = new ArmorController(mockMagicalArmorGenerator.Object, mockMundaneArmorGenerator.Object);
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
        public void GenerateReturnsMundaneArmorFromGenerator()
        {
            var item = new Item { ItemType = ItemTypeConstants.Armor };
            mockMundaneArmorGenerator.Setup(g => g.Generate()).Returns(item);

            var result = controller.Generate(PowerConstants.Mundane) as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void GenerateReturnsMagicalArmorFromGenerator()
        {
            var item = new Item { ItemType = ItemTypeConstants.Armor };
            mockMagicalArmorGenerator.Setup(g => g.GenerateAtPower("power")).Returns(item);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void ItemTypeMustBeArmor()
        {
            var item = new Item { ItemType = ItemTypeConstants.Armor };
            var otherItem = new Item { ItemType = "other" };
            mockMagicalArmorGenerator.SetupSequence(g => g.GenerateAtPower("power"))
                .Returns(otherItem)
                .Returns(item);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}