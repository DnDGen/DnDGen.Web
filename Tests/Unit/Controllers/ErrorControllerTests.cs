using DNDGenSite.Controllers;
using NUnit.Framework;
using System;
using System.Web.Mvc;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class ErrorControllerTests
    {
        private ErrorController controller;

        [SetUp]
        public void Setup()
        {
            controller = new ErrorController();
        }

        [TestCase("Index")]
        public void ActionHandlesGetVerb(String methodName)
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
    }
}
