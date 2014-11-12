using System.Web.Mvc;
using DNDGenSite.Controllers.Equipment;
using EquipmentGen.Common.Items;
using EquipmentGen.Generators.Interfaces.Items.Magical;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers.Equipment
{
    [TestFixture]
    public class WandControllerTests
    {
        private WandController controller;
        private Mock<IMagicalItemGenerator> mockWandGenerator;
        private Item wand;

        [SetUp]
        public void Setup()
        {
            mockWandGenerator = new Mock<IMagicalItemGenerator>();
            controller = new WandController(mockWandGenerator.Object);

            wand = new Item { ItemType = ItemTypeConstants.Wand };
            mockWandGenerator.Setup(g => g.GenerateAtPower("power")).Returns(wand);
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
            var result = controller.Generate("power");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var result = controller.Generate("power") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsWandFromGenerator()
        {
            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(wand));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void ItemTypeMustBeWand()
        {
            var otherItem = new Item { ItemType = "other" };
            mockWandGenerator.SetupSequence(g => g.GenerateAtPower("power"))
                .Returns(otherItem)
                .Returns(wand);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(wand));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}