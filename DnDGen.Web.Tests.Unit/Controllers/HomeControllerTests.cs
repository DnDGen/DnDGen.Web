using DnDGen.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class HomeControllerTests
    {
        private HomeController controller;

        [SetUp]
        public void Setup()
        {
            controller = new HomeController();
        }

        [TestCase("Index")]
        [TestCase("Error")]
        public void ActionHandlesGetVerb(string methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void IndexReturnsView()
        {
            var result = controller.Index();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void ErrorReturnsView()
        {
            var result = controller.Error();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }
    }
}
