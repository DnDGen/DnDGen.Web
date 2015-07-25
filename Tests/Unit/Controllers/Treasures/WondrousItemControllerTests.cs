using DNDGenSite.Controllers.Treasures;
using Moq;
using NUnit.Framework;
using System.Web.Mvc;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;

namespace DNDGenSite.Tests.Unit.Controllers.Treasures
{
    [TestFixture]
    public class WondrousItemControllerTests
    {
        private WondrousItemController controller;
        private Mock<IMagicalItemGenerator> mockWondrousItemGenerator;
        private Item wondrousItem;

        [SetUp]
        public void Setup()
        {
            mockWondrousItemGenerator = new Mock<IMagicalItemGenerator>();
            controller = new WondrousItemController(mockWondrousItemGenerator.Object);

            wondrousItem = new Item { ItemType = ItemTypeConstants.WondrousItem };
            mockWondrousItemGenerator.Setup(g => g.GenerateAtPower("power")).Returns(wondrousItem);
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
        public void GenerateReturnsWondrousItemFromGenerator()
        {
            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(wondrousItem));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void ItemTypeMustBeWondrousItem()
        {
            var otherItem = new Item { ItemType = "other" };
            mockWondrousItemGenerator.SetupSequence(g => g.GenerateAtPower("power"))
                .Returns(otherItem)
                .Returns(wondrousItem);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(wondrousItem));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}