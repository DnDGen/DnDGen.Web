using System.Web.Mvc;
using DNDGenSite.Controllers.Treasures;
using EquipmentGen.Common.Items;
using EquipmentGen.Generators.Interfaces.Items.Mundane;
using Moq;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers.Treasures
{
    [TestFixture]
    public class ToolControllerTests
    {
        private ToolController controller;
        private Mock<IMundaneItemGenerator> mockToolGenerator;

        [SetUp]
        public void Setup()
        {
            mockToolGenerator = new Mock<IMundaneItemGenerator>();
            controller = new ToolController(mockToolGenerator.Object);
        }

        [Test]
        public void GenerateHandlesGetVerb()
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, "Generate");
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var result = controller.Generate();
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var result = controller.Generate() as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsToolFromGenerator()
        {
            var item = new Item();
            mockToolGenerator.Setup(g => g.Generate()).Returns(item);

            var result = controller.Generate() as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(item));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}