using System.Web.Mvc;
using DNDGenSite.Controllers.Equipment;
using EquipmentGen.Common;
using EquipmentGen.Generators.Interfaces;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers.Equipment
{
    [TestFixture]
    public class TreasureControllerTests
    {
        private TreasureController controller;
        private Mock<ITreasureGenerator> mockTreasureGenerator;

        [SetUp]
        public void Setup()
        {
            mockTreasureGenerator = new Mock<ITreasureGenerator>();
            controller = new TreasureController(mockTreasureGenerator.Object);
        }

        [Test]
        public void GenerateHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Generate");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void TreasureReturnsJsonResult()
        {
            var result = controller.Generate(9266);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void TreasureJsonResultAllowsGet()
        {
            var result = controller.Generate(9266) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void TreasureReturnsTreasureAtLevelFromGenerator()
        {
            var treasure = new Treasure();
            mockTreasureGenerator.Setup(g => g.GenerateAtLevel(9266)).Returns(treasure);

            var result = controller.Generate(9266) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.treasure, Is.EqualTo(treasure));
        }
    }
}