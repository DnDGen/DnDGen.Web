using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using Moq;
using NUnit.Framework;
using System;
using System.Linq;
using System.Web.Mvc;
using TreasureGen.Common;
using TreasureGen.Common.Items;
using TreasureGen.Generators;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class TreasureControllerTests
    {
        private TreasureController controller;
        private Mock<ITreasureGenerator> mockTreasureGenerator;

        [SetUp]
        public void Setup()
        {
            mockTreasureGenerator = new Mock<ITreasureGenerator>();
            controller = new TreasureController(mockTreasureGenerator.Object);
        }

        [TestCase("Index")]
        [TestCase("Generate")]
        public void ActionHandlesGetVerb(String action)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, action);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void IndexReturnsView()
        {
            var result = controller.Index();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void IndexContainsModel()
        {
            var result = controller.Index() as ViewResult;
            Assert.That(result.Model, Is.InstanceOf<TreasureModel>());
        }

        [Test]
        public void IndexHasMaxLevel()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.MaxTreasureLevel, Is.EqualTo(20));
        }

        [Test]
        public void IndexHasMundaneItemTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.MundaneItemTypes, Contains.Item(ItemTypeConstants.AlchemicalItem));
            Assert.That(model.MundaneItemTypes, Contains.Item(ItemTypeConstants.Tool));
            Assert.That(model.MundaneItemTypes.Count(), Is.EqualTo(2));
        }

        [TestCase(ItemTypeConstants.Armor,
            PowerConstants.Mundane,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Potion,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Ring,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Rod,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Scroll,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Staff,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Wand,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.Weapon,
            PowerConstants.Mundane,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        [TestCase(ItemTypeConstants.WondrousItem,
            PowerConstants.Minor,
            PowerConstants.Medium,
            PowerConstants.Major)]
        public void IndexHasPoweredItemTypes(String itemType, params String[] powers)
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.PoweredItemTypes, Contains.Item(itemType));

            var index = model.PoweredItemTypes.ToList().IndexOf(itemType);
            var itemPowers = model.ItemPowers.ElementAt(index);

            foreach (var power in powers)
                Assert.That(itemPowers, Contains.Item(power));

            var extraPowers = itemPowers.Except(powers);
            Assert.That(extraPowers, Is.Empty);
        }

        [Test]
        public void IndexHas9PoweredItemTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureModel;
            Assert.That(model.PoweredItemTypes.Count(), Is.EqualTo(9));
        }

        [Test]
        public void IndexHasTreasureTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureModel;

            Assert.That(model.TreasureTypes, Contains.Item("Treasure"));
            Assert.That(model.TreasureTypes, Contains.Item("Coin"));
            Assert.That(model.TreasureTypes, Contains.Item("Goods"));
            Assert.That(model.TreasureTypes, Contains.Item("Items"));
            Assert.That(model.TreasureTypes.Count(), Is.EqualTo(4));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var result = controller.Generate(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var result = controller.Generate(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsTreasureAtLevelFromGenerator()
        {
            var treasure = new Treasure();
            mockTreasureGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(treasure);

            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.EqualTo(treasure));
        }
    }
}