﻿using DnDGen.Web.Controllers;
using Moq;
using NUnit.Framework;
using RollGen;
using System.Web.Mvc;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class RollControllerTests
    {
        private RollController controller;
        private Mock<Dice> mockDice;
        private Mock<PartialRoll> mockRoll;

        [SetUp]
        public void Setup()
        {
            mockDice = new Mock<Dice>();
            mockRoll = new Mock<PartialRoll>();
            controller = new RollController(mockDice.Object);

            mockDice.Setup(d => d.Roll(It.IsAny<int>())).Returns(mockRoll.Object);
        }

        [TestCase("Index")]
        [TestCase("Roll")]
        [TestCase("RollExpression")]
        [TestCase("Validate")]
        [TestCase("ValidateExpression")]
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
        public void RollReturnsJsonResult()
        {
            mockRoll.Setup(r => r.d(90210).AsSum()).Returns(42);

            var result = controller.Roll(9266, 90210);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void RollJsonResultAllowsGet()
        {
            mockRoll.Setup(r => r.d(90210).AsSum()).Returns(42);

            var result = controller.Roll(9266, 90210) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void RollResultContainsRoll()
        {
            mockRoll.Setup(r => r.d(90210).AsSum()).Returns(42);

            var result = controller.Roll(9266, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void RollExpressionReturnsJsonResult()
        {
            mockDice.Setup(d => d.Roll("expression").AsSum()).Returns(9266);

            var result = controller.RollExpression("expression");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void RollExpressionJsonResultAllowsGet()
        {
            mockDice.Setup(d => d.Roll("expression").AsSum()).Returns(9266);

            var result = controller.RollExpression("expression") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void RollExpressionResultContainsRoll()
        {
            mockDice.Setup(d => d.Roll("expression").AsSum()).Returns(9266);

            var result = controller.RollExpression("expression") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(9266));
        }

        [Test]
        public void ValidateExpressionReturnsJsonResult()
        {
            var result = controller.ValidateExpression("expression");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void ValidateExpressionJsonResultAllowsGet()
        {
            var result = controller.ValidateExpression("expression") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void ValidateExpressionIsValid()
        {
            mockDice.Setup(d => d.ReplaceExpressionWithTotal("expression", false)).Returns("90210");

            var result = controller.ValidateExpression("expression") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.True);
        }

        [Test]
        public void ValidateExpressionIsMoreThanJustARoll()
        {
            mockDice.Setup(d => d.ContainsRoll("expression", false)).Returns(true);
            mockDice.Setup(d => d.ReplaceExpressionWithTotal("expression", false)).Returns("phrase with 90210 roll");

            var result = controller.ValidateExpression("expression") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void ValidateRollIsAValidRoll()
        {
            var result = controller.Validate(9266, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.True);
        }

        [Test]
        public void ValidateRollIsNotValidRollBecauseOfQuantityTooHigh()
        {
            var result = controller.Validate(Limits.Quantity + 1, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void ValidateRollIsNotValidRollBecauseOfQuantityTooLow()
        {
            var result = controller.Validate(0, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }

        [Test, Ignore("Can't go over the die limit, as it is max int")]
        public void ValidateRollIsNotValidRollBecauseOfDieTooHigh()
        {
            var result = controller.Validate(9266, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void ValidateRollIsNotValidRollBecauseOfDieTooLow()
        {
            var result = controller.Validate(9266, 0) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void ValidateRollIsNotValidRollBecauseOfProductTooHigh()
        {
            var result = controller.Validate(2, Limits.Die) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void ValidateRollIsNotValidRollBecauseOfProductTooLow()
        {
            //INFO: This works as too low because it overflows the in and comes back around as negative
            var result = controller.Validate(Limits.Quantity, Limits.Die) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }
    }
}