using System;
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
        public void EquipmentViewHasPowerConstants()
        {
            var result = controller.Equipment() as ViewResult;
            var model = result.Model as EquipmentModel;

            Assert.That(model.Mundane, Is.EqualTo(PowerConstants.Mundane));
            Assert.That(model.Minor, Is.EqualTo(PowerConstants.Minor));
            Assert.That(model.Medium, Is.EqualTo(PowerConstants.Medium));
            Assert.That(model.Major, Is.EqualTo(PowerConstants.Major));
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