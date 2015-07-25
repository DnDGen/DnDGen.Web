using DNDGenSite.Controllers.Treasures;
using Moq;
using NUnit.Framework;
using System.Web.Mvc;
using TreasureGen.Common.Items;
using TreasureGen.Generators.Items.Magical;

namespace DNDGenSite.Tests.Unit.Controllers.Treasures
{
    [TestFixture]
    public class RodControllerTests
    {
        private RodController controller;
        private Mock<IMagicalItemGenerator> mockRodGenerator;
        private Item rod;

        [SetUp]
        public void Setup()
        {
            mockRodGenerator = new Mock<IMagicalItemGenerator>();
            controller = new RodController(mockRodGenerator.Object);

            rod = new Item { ItemType = ItemTypeConstants.Rod };
            mockRodGenerator.Setup(g => g.GenerateAtPower("power")).Returns(rod);
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
            var result = controller.Generate("power");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var result = controller.Generate("power") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsRodFromGenerator()
        {
            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(rod));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }

        [Test]
        public void ItemTypeMustBeRod()
        {
            var otherItem = new Item { ItemType = "other" };
            mockRodGenerator.SetupSequence(g => g.GenerateAtPower("power"))
                .Returns(otherItem)
                .Returns(rod);

            var result = controller.Generate("power") as JsonResult;
            dynamic data = result.Data;

            Assert.That(data.treasure.Items[0], Is.EqualTo(rod));
            Assert.That(data.treasure.Items.Length, Is.EqualTo(1));
        }
    }
}