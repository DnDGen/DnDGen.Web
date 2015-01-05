using System;
using System.Linq;
using System.Web.Mvc;
using DNDGenSite.Controllers;
using DNDGenSite.Models;
using EquipmentGen.Common.Items;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class ViewControllerTests
    {
        private ViewController controller;

        [SetUp]
        public void Setup()
        {
            controller = new ViewController();
        }

        [TestCase("Home")]
        [TestCase("Dice")]
        [TestCase("Equipment")]
        [TestCase("Character")]
        [TestCase("Dungeon")]
        public void ActionHandlesGetVerb(String methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void HomeReturnsView()
        {
            var result = controller.Home();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void DiceReturnsView()
        {
            var result = controller.Dice();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void EquipmentReturnsView()
        {
            var result = controller.Equipment();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void EquipmentViewContainsModel()
        {
            var result = controller.Equipment() as ViewResult;
            Assert.That(result.Model, Is.InstanceOf<EquipmentModel>());
        }

        [Test]
        public void EquipmentViewHasMaxLevel()
        {
            var result = controller.Equipment() as ViewResult;
            var model = result.Model as EquipmentModel;

            Assert.That(model.MaxTreasureLevel, Is.EqualTo(20));
        }

        [Test]
        public void EquipmentViewHasMundaneItemTypes()
        {
            var result = controller.Equipment() as ViewResult;
            var model = result.Model as EquipmentModel;

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
        public void EquipmentViewHasPoweredItemTypes(String itemType, params String[] powers)
        {
            var result = controller.Equipment() as ViewResult;
            var model = result.Model as EquipmentModel;

            Assert.That(model.PoweredItemTypes, Contains.Item(itemType));

            var index = model.PoweredItemTypes.ToList().IndexOf(itemType);
            var itemPowers = model.ItemPowers.ElementAt(index);

            foreach (var power in powers)
                Assert.That(itemPowers, Contains.Item(power));

            var extraPowers = itemPowers.Except(powers);
            Assert.That(extraPowers, Is.Empty);
        }

        [Test]
        public void EquipmentViewHas9PoweredItemTypes()
        {
            var result = controller.Equipment() as ViewResult;
            var model = result.Model as EquipmentModel;
            Assert.That(model.PoweredItemTypes.Count(), Is.EqualTo(9));
        }

        [Test]
        public void EquipmentViewHasTreasureTypes()
        {
            var result = controller.Equipment() as ViewResult;
            var model = result.Model as EquipmentModel;

            Assert.That(model.TreasureTypes, Contains.Item("Treasure"));
            Assert.That(model.TreasureTypes, Contains.Item("Coin"));
            Assert.That(model.TreasureTypes, Contains.Item("Goods"));
            Assert.That(model.TreasureTypes, Contains.Item("Items"));
            Assert.That(model.TreasureTypes.Count(), Is.EqualTo(4));
        }

        [Test]
        public void CharacterReturnsView()
        {
            var result = controller.Character();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void DungeonReturnsView()
        {
            var result = controller.Dungeon();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }
    }
}