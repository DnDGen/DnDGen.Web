using System.Linq;
using System.Web.Mvc;
using DNDGenSite.Controllers.Treasures;
using EquipmentGen.Common;
using EquipmentGen.Common.Items;
using EquipmentGen.Generators.Interfaces.Items;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers.Treasures
{
    [TestFixture]
    public class ItemsControllerTests
    {
        private ItemsController controller;
        private Mock<IItemsGenerator> mockItemsGenerator;

        [SetUp]
        public void Setup()
        {
            mockItemsGenerator = new Mock<IItemsGenerator>();
            controller = new ItemsController(mockItemsGenerator.Object);
        }

        [Test]
        public void GenerateHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Generate");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void ItemsReturnsJsonResult()
        {
            var result = controller.Generate(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void ItemsJsonResultAllowsGet()
        {
            var result = controller.Generate(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void ItemsJsonResultContainsTreasure()
        {
            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.InstanceOf<Treasure>());
        }

        [Test]
        public void ItemsReturnsGoodsAtLevelFromGenerator()
        {
            var items = Enumerable.Empty<Item>();
            mockItemsGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(items);

            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure.Goods, Is.EqualTo(items));
        }
    }
}