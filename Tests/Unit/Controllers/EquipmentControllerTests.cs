using System;
using System.Web.Mvc;
using DNDGenSite.Controllers;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class EquipmentControllerTests
    {
        private EquipmentController controller;

        [SetUp]
        public void Setup()
        {
            controller = new EquipmentController();
        }

        [TestCase("Treasure")]
        [TestCase("Coin")]
        [TestCase("Goods")]
        [TestCase("Items")]
        [TestCase("Armor")]
        [TestCase("Weapons")]
        [TestCase("Potions")]
        [TestCase("AlchemicalItems")]
        [TestCase("Tools")]
        [TestCase("Rods")]
        [TestCase("Wands")]
        [TestCase("WondrousItems")]
        [TestCase("Staffs")]
        [TestCase("Rings")]
        public void ActionHandlesGetVerb(String methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }
    }
}