﻿using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class RollControllerTests
    {
        private RollController controller;

        [SetUp]
        public void Setup()
        {
            controller = new RollController();
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

        [Test]
        public void IndexContainsModel()
        {
            var result = controller.Index() as ViewResult;
            Assert.That(result.Model, Is.InstanceOf<RollViewModel>());
        }
    }
}