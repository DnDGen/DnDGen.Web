﻿using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Linq;
using TreasureGen.Items;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class TreasureControllerTests
    {
        private TreasureController controller;

        [SetUp]
        public void Setup()
        {
            controller = new TreasureController();
        }

        [TestCase("Index")]
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
    }
}