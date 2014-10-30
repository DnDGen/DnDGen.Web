using System;
using System.Web.Mvc;
using D20Dice;
using DNDGenSite.Controllers;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class DiceControllerTests
    {
        private DiceController controller;
        private Mock<IDice> mockDice;
        private Mock<IPartialRoll> mockRoll;

        [SetUp]
        public void Setup()
        {
            mockDice = new Mock<IDice>();
            mockRoll = new Mock<IPartialRoll>();
            controller = new DiceController(mockDice.Object);

            mockDice.Setup(d => d.Roll(It.IsAny<Int32>())).Returns(mockRoll.Object);
        }

        [TestCase("D2")]
        [TestCase("D3")]
        [TestCase("D4")]
        [TestCase("D6")]
        [TestCase("D8")]
        [TestCase("D10")]
        [TestCase("D12")]
        [TestCase("D20")]
        [TestCase("Percentile")]
        [TestCase("Custom")]
        public void ActionHandlesGetVerb(String methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void D2ReturnsJsonResult()
        {
            var result = controller.D2(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D2JsonResultAllowsGet()
        {
            var result = controller.D2(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D2RollsQuantityTimes()
        {
            var result = controller.D2(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D2ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d2()).Returns(42);

            var result = controller.D2(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void D3ReturnsJsonResult()
        {
            var result = controller.D3(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D3JsonResultAllowsGet()
        {
            var result = controller.D3(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D3RollsQuantityTimes()
        {
            var result = controller.D3(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D3ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d3()).Returns(42);

            var result = controller.D3(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void D4ReturnsJsonResult()
        {
            var result = controller.D4(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D4JsonResultAllowsGet()
        {
            var result = controller.D4(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D4RollsQuantityTimes()
        {
            var result = controller.D4(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D4ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d4()).Returns(42);

            var result = controller.D4(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void D6ReturnsJsonResult()
        {
            var result = controller.D6(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D6JsonResultAllowsGet()
        {
            var result = controller.D6(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D6RollsQuantityTimes()
        {
            var result = controller.D6(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D6ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d6()).Returns(42);

            var result = controller.D6(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void D8ReturnsJsonResult()
        {
            var result = controller.D8(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D8JsonResultAllowsGet()
        {
            var result = controller.D8(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D8RollsQuantityTimes()
        {
            var result = controller.D8(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D8ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d8()).Returns(42);

            var result = controller.D8(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void D10ReturnsJsonResult()
        {
            var result = controller.D10(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D10JsonResultAllowsGet()
        {
            var result = controller.D10(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D10RollsQuantityTimes()
        {
            var result = controller.D10(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D10ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d10()).Returns(42);

            var result = controller.D10(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void D12ReturnsJsonResult()
        {
            var result = controller.D12(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D12JsonResultAllowsGet()
        {
            var result = controller.D12(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D12RollsQuantityTimes()
        {
            var result = controller.D12(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D12ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d12()).Returns(42);

            var result = controller.D12(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void D20ReturnsJsonResult()
        {
            var result = controller.D20(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void D20JsonResultAllowsGet()
        {
            var result = controller.D20(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void D20RollsQuantityTimes()
        {
            var result = controller.D20(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D20ResultContainsRoll()
        {
            mockRoll.Setup(r => r.d20()).Returns(42);

            var result = controller.D20(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void PercentileReturnsJsonResult()
        {
            var result = controller.Percentile(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void PercentileJsonResultAllowsGet()
        {
            var result = controller.Percentile(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void PercentileRollsQuantityTimes()
        {
            var result = controller.Percentile(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void PercentileResultContainsRoll()
        {
            mockRoll.Setup(r => r.Percentile()).Returns(42);

            var result = controller.Percentile(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void CustomReturnsJsonResult()
        {
            var result = controller.Custom(9266, 90210);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void CustomJsonResultAllowsGet()
        {
            var result = controller.Custom(9266, 90210) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void CustomRollsQuantityTimes()
        {
            var result = controller.Custom(9266, 90210);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void CustomResultContainsRoll()
        {
            mockRoll.Setup(r => r.d(90210)).Returns(42);

            var result = controller.Custom(9266, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }
    }
}