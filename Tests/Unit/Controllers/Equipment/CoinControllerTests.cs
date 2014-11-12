﻿using System.Web.Mvc;
using DNDGenSite.Controllers.Equipment;
using EquipmentGen.Common;
using EquipmentGen.Common.Coins;
using EquipmentGen.Generators.Interfaces.Coins;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers.Equipment
{
    [TestFixture]
    public class CoinControllerTests
    {
        private CoinController controller;
        private Mock<ICoinGenerator> mockCoinGenerator;

        [SetUp]
        public void Setup()
        {
            mockCoinGenerator = new Mock<ICoinGenerator>();
            controller = new CoinController(mockCoinGenerator.Object);
        }

        [Test]
        public void GenerateHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Generate");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void CoinReturnsJsonResult()
        {
            var result = controller.Generate(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void CoinJsonResultAllowsGet()
        {
            var result = controller.Generate(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void CoinJsonResultContainsTreasure()
        {
            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.InstanceOf<Treasure>());
        }

        [Test]
        public void CoinReturnsCoinAtLevelFromGenerator()
        {
            var coin = new Coin();
            mockCoinGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(coin);

            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure.Coin, Is.EqualTo(coin));
        }
    }
}