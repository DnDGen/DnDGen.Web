﻿using DnDGen.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Unit.Controllers
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
    }
}
