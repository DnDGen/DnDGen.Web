using DnDGen.Core.Generators;
using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using EventGen;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Linq;
using TreasureGen;
using TreasureGen.Coins;
using TreasureGen.Generators;
using TreasureGen.Goods;
using TreasureGen.Items;
using TreasureGen.Items.Magical;
using TreasureGen.Items.Mundane;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class TreasureControllerTests
    {
        private TreasureController controller;
        private Mock<ITreasureGenerator> mockTreasureGenerator;
        private Mock<JustInTimeFactory> mockJustInTimeFactory;
        private Mock<ICoinGenerator> mockCoinGenerator;
        private Mock<IGoodsGenerator> mockGoodsGenerator;
        private Mock<IItemsGenerator> mockItemsGenerator;
        private Mock<MagicalItemGenerator> mockMagicalGenerator;
        private Mock<ClientIDManager> mockClientIdManager;
        private Guid clientId;

        [SetUp]
        public void Setup()
        {
            mockTreasureGenerator = new Mock<ITreasureGenerator>();
            mockJustInTimeFactory = new Mock<JustInTimeFactory>();
            mockCoinGenerator = new Mock<ICoinGenerator>();
            mockGoodsGenerator = new Mock<IGoodsGenerator>();
            mockItemsGenerator = new Mock<IItemsGenerator>();
            mockClientIdManager = new Mock<ClientIDManager>();
            controller = new TreasureController(mockTreasureGenerator.Object,
                mockJustInTimeFactory.Object,
                mockCoinGenerator.Object,
                mockGoodsGenerator.Object,
                mockItemsGenerator.Object,
                mockClientIdManager.Object);

            clientId = Guid.NewGuid();
            mockMagicalGenerator = new Mock<MagicalItemGenerator>();
            mockJustInTimeFactory.Setup(f => f.Build<MagicalItemGenerator>("item type")).Returns(mockMagicalGenerator.Object);
        }

        [TestCase("Index")]
        [TestCase("Generate")]
        [TestCase("GenerateItem")]
        public void ActionHandlesGetVerb(string action)
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
            Assert.That(result.Model, Is.InstanceOf<TreasureViewModel>());
        }

        [Test]
        public void IndexHasMaxLevel()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureViewModel;

            Assert.That(model.MaxTreasureLevel, Is.EqualTo(30));
        }

        [TestCase(ItemTypeConstants.AlchemicalItem,
            PowerConstants.Mundane)]
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
        [TestCase(ItemTypeConstants.Tool,
            PowerConstants.Mundane)]
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
        public void IndexHasItemPowers(string itemType, params string[] powers)
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureViewModel;

            Assert.That(model.ItemPowers.Keys, Contains.Item(itemType));
            Assert.That(model.ItemPowers[itemType], Is.EquivalentTo(powers));
        }

        [Test]
        public void IndexHasAllItemTypesInItemPowers()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureViewModel;
            Assert.That(model.ItemPowers.Count, Is.EqualTo(11));
        }

        [Test]
        public void IndexHasTreasureTypes()
        {
            var result = controller.Index() as ViewResult;
            var model = result.Model as TreasureViewModel;

            Assert.That(model.TreasureTypes, Contains.Item("Treasure"));
            Assert.That(model.TreasureTypes, Contains.Item("Coin"));
            Assert.That(model.TreasureTypes, Contains.Item("Goods"));
            Assert.That(model.TreasureTypes, Contains.Item("Items"));
            Assert.That(model.TreasureTypes.Count(), Is.EqualTo(4));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var result = controller.Generate(clientId, "treasure type", 9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateSetsClientId()
        {
            var result = controller.Generate(clientId, "treasure type", 9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void GenerateReturnsTreasureAtLevelFromGenerator()
        {
            var treasure = new Treasure();
            mockTreasureGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(treasure);

            var result = controller.Generate(clientId, "Treasure", 9266) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.treasure, Is.EqualTo(treasure));
        }

        [Test]
        public void GenerateReturnsCoinAtLevelFromGenerator()
        {
            var coin = new Coin();
            mockCoinGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(coin);

            var result = controller.Generate(clientId, "Coin", 9266) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.treasure.Coin, Is.EqualTo(coin));
        }

        [Test]
        public void GenerateReturnsGoodsAtLevelFromGenerator()
        {
            var goods = new[] { new Good(), new Good() };
            mockGoodsGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(goods);

            var result = controller.Generate(clientId, "Goods", 9266) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.treasure.Goods, Is.EqualTo(goods));
        }

        [Test]
        public void GenerateReturnsItemsAtLevelFromGenerator()
        {
            var items = new[] { new Item(), new Item() };
            mockItemsGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(items);

            var result = controller.Generate(clientId, "Items", 9266) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.treasure.Items, Is.EqualTo(items));
        }

        [Test]
        public void GenerateItemReturnsJsonResult()
        {
            var result = controller.GenerateItem(clientId, "item type", "power");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateItemSetsClientId()
        {
            var result = controller.GenerateItem(clientId, "item type", "power");
            Assert.That(result, Is.InstanceOf<JsonResult>());

            mockClientIdManager.Verify(m => m.SetClientID(It.IsAny<Guid>()), Times.Once);
            mockClientIdManager.Verify(m => m.SetClientID(clientId), Times.Once);
        }

        [Test]
        public void GenerateItemReturnsMundaneItemFromGenerator()
        {
            var mockMundaneGenerator = new Mock<MundaneItemGenerator>();
            mockJustInTimeFactory.Setup(f => f.Build<MundaneItemGenerator>("item type")).Returns(mockMundaneGenerator.Object);

            var item = new Item();
            mockMundaneGenerator.Setup(g => g.Generate()).Returns(item);

            var result = controller.GenerateItem(clientId, "item type", PowerConstants.Mundane) as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void GenerateItemReturnsMagicalItemFromGenerator()
        {
            var item = new Item();
            mockMagicalGenerator.Setup(g => g.GenerateFrom("power")).Returns(item);

            var result = controller.GenerateItem(clientId, "item type", "power") as JsonResult;
            dynamic data = result.Value;
            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}