﻿using System.Web.Mvc;
using DNDGenSite.Controllers.Equipment;
using EquipmentGen.Common.Items;
using EquipmentGen.Generators.Interfaces.Items.Magical;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers.Equipment
{
    [TestFixture]
    public class ScrollControllerTests
    {
        private ScrollController controller;
        private Mock<IMagicalItemGenerator> mockScrollGenerator;
        private Item scroll;

        [SetUp]
        public void Setup()
        {
            mockScrollGenerator = new Mock<IMagicalItemGenerator>();
            controller = new ScrollController(mockScrollGenerator.Object);

            scroll = new Item { ItemType = ItemTypeConstants.Scroll };
            mockScrollGenerator.Setup(g => g.GenerateAtPower("power")).Returns(scroll);
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
        public void GenerateReturnsScrollFromGenerator()
        {
            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(scroll));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void ItemTypeMustBeScroll()
        {
            var otherItem = new Item { ItemType = "other" };
            mockScrollGenerator.SetupSequence(g => g.GenerateAtPower("power"))
                .Returns(otherItem)
                .Returns(scroll);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(scroll));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}