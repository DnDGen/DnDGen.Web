using System;
using System.Linq;
using System.Web.Mvc;
using DNDGenSite.Controllers;
using EquipmentGen.Common;
using EquipmentGen.Common.Coins;
using EquipmentGen.Common.Goods;
using EquipmentGen.Generators.Interfaces;
using EquipmentGen.Generators.Interfaces.Coins;
using EquipmentGen.Generators.Interfaces.Goods;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class EquipmentControllerTests
    {
        private EquipmentController controller;
        private Mock<ITreasureGenerator> mockTreasureGenerator;
        private Mock<ICoinGenerator> mockCoinGenerator;
        private Mock<IGoodsGenerator> mockGoodsGenerator;

        [SetUp]
        public void Setup()
        {
            mockTreasureGenerator = new Mock<ITreasureGenerator>();
            mockCoinGenerator = new Mock<ICoinGenerator>();
            mockGoodsGenerator = new Mock<IGoodsGenerator>();
            controller = new EquipmentController(mockTreasureGenerator.Object, mockCoinGenerator.Object, mockGoodsGenerator.Object);
        }

        [TestCase("Treasure")]
        [TestCase("Coin")]
        [TestCase("Goods")]
        [TestCase("Items")]
        [TestCase("AlchemicalItem")]
        [TestCase("Armor")]
        [TestCase("Potion")]
        [TestCase("Ring")]
        [TestCase("Rod")]
        [TestCase("Scroll")]
        [TestCase("Staff")]
        [TestCase("Tool")]
        [TestCase("Wand")]
        [TestCase("Weapon")]
        [TestCase("WondrousItem")]
        public void ActionHandlesGetVerb(String methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void TreasureReturnsJsonResult()
        {
            var result = controller.Treasure(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void TreasureJsonResultAllowsGet()
        {
            var result = controller.Treasure(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void TreasureReturnsTreasureAtLevelFromGenerator()
        {
            var treasure = new Treasure();
            mockTreasureGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(treasure);

            var result = controller.Treasure(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.EqualTo(treasure));
        }

        [Test]
        public void CoinReturnsJsonResult()
        {
            var result = controller.Coin(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void CoinJsonResultAllowsGet()
        {
            var result = controller.Coin(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void CoinJsonResultContainsTreasure()
        {
            var result = controller.Coin(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.InstanceOf<Treasure>());
        }

        [Test]
        public void CoinReturnsCoinAtLevelFromGenerator()
        {
            var coin = new Coin();
            mockCoinGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(coin);

            var result = controller.Coin(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure.Coin, Is.EqualTo(coin));
        }

        [Test]
        public void GoodsReturnsJsonResult()
        {
            var result = controller.Goods(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GoodsJsonResultAllowsGet()
        {
            var result = controller.Goods(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GoodsJsonResultContainsTreasure()
        {
            var result = controller.Goods(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.InstanceOf<Treasure>());
        }

        [Test]
        public void GoodsReturnsGoodsAtLevelFromGenerator()
        {
            var goods = Enumerable.Empty<Good>();
            mockGoodsGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(goods);

            var result = controller.Goods(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure.Goods, Is.EqualTo(goods));
        }
    }
}