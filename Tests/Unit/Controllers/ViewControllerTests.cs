using System;
using System.Web.Mvc;
using DNDGenSite.Controllers;
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