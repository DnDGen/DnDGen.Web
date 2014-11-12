using System.Linq;
using System.Web.Mvc;
using DNDGenSite.Controllers.Equipment;
using EquipmentGen.Common;
using EquipmentGen.Common.Goods;
using EquipmentGen.Generators.Interfaces.Goods;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers.Equipment
{
    [TestFixture]
    public class GoodsControllerTests
    {
        private GoodsController controller;
        private Mock<IGoodsGenerator> mockGoodsGenerator;

        [SetUp]
        public void Setup()
        {
            mockGoodsGenerator = new Mock<IGoodsGenerator>();
            controller = new GoodsController(mockGoodsGenerator.Object);
        }

        [Test]
        public void GenerateHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Generate");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void GoodsReturnsJsonResult()
        {
            var result = controller.Generate(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GoodsJsonResultAllowsGet()
        {
            var result = controller.Generate(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GoodsJsonResultContainsTreasure()
        {
            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.InstanceOf<Treasure>());
        }

        [Test]
        public void GoodsReturnsGoodsAtLevelFromGenerator()
        {
            var goods = Enumerable.Empty<Good>();
            mockGoodsGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(goods);

            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure.Goods, Is.EqualTo(goods));
        }
    }
}