using DnDGen.Web.Controllers;
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
        [TestCase("D2")]
        [TestCase("D3")]
        [TestCase("D4")]
        [TestCase("D6")]
        [TestCase("D8")]
        [TestCase("D10")]
        [TestCase("D12")]
        [TestCase("D20")]
        [TestCase("D100")]
        [TestCase("Custom")]
        [TestCase("Expression")]
        [TestCase("Validate")]
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
            controller.D2(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D2ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(2)).Returns(new[] { 42 });

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
            controller.D3(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D3ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(3)).Returns(new[] { 42 });

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
            controller.D4(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D4ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(4)).Returns(new[] { 42 });

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
            controller.D6(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D6ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(6)).Returns(new[] { 42 });

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
            controller.D8(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D8ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(8)).Returns(new[] { 42 });

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
            controller.D10(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D10ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(10)).Returns(new[] { 42 });

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
            controller.D12(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D12ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(12)).Returns(new[] { 42 });

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
            controller.D20(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void D20ResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(20)).Returns(new[] { 42 });

            var result = controller.D20(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void PercentileReturnsJsonResult()
        {
            var result = controller.D100(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void PercentileJsonResultAllowsGet()
        {
            var result = controller.D100(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void PercentileRollsQuantityTimes()
        {
            controller.D100(9266);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void PercentileResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(100)).Returns(new[] { 42 });

            var result = controller.D100(9266) as JsonResult;
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
            controller.Custom(9266, 90210);
            mockDice.Verify(d => d.Roll(9266), Times.Once);
        }

        [Test]
        public void CustomResultContainsRoll()
        {
            mockRoll.Setup(r => r.IndividualRolls(90210)).Returns(new[] { 42 });

            var result = controller.Custom(9266, 90210) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(42));
        }

        [Test]
        public void ExpressionReturnsJsonResult()
        {
            var result = controller.Expression("expression");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void ExpressionJsonResultAllowsGet()
        {
            var result = controller.Expression("expression") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void ExpressionResultContainsRoll()
        {
            mockDice.Setup(d => d.Roll("expression")).Returns(9266);

            var result = controller.Expression("expression") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.roll, Is.EqualTo(9266));
        }

        [Test]
        public void ValidateReturnsJsonResult()
        {
            var result = controller.Validate("expression");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void ValidateJsonResultAllowsGet()
        {
            var result = controller.Validate("expression") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void VerifyExpressionIsAValidRoll()
        {
            mockDice.Setup(d => d.ContainsRoll("expression")).Returns(true);
            mockDice.Setup(d => d.ReplaceExpressionWithTotal("expression")).Returns("90210");

            var result = controller.Validate("expression") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.True);
        }

        [Test]
        public void VerifyExpressionIsNotValidRoll()
        {
            mockDice.Setup(d => d.ContainsRoll("expression")).Returns(false);
            mockDice.Setup(d => d.ReplaceExpressionWithTotal("expression")).Returns("90210");

            var result = controller.Validate("expression") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }

        [Test]
        public void VerifyExpressionIsMoreThanARoll()
        {
            mockDice.Setup(d => d.ContainsRoll("expression")).Returns(true);
            mockDice.Setup(d => d.ReplaceExpressionWithTotal("expression")).Returns("phrase with 90210 roll");

            var result = controller.Validate("expression") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.isValid, Is.False);
        }
    }
}