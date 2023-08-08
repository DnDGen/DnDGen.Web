using DnDGen.Web.Controllers;
using DnDGen.Web.Models.Treasures;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

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
    }
}