using DnDGen.Web.Controllers;
using NUnit.Framework;

namespace DnDGen.Web.Tests.Integration.Controllers
{
    [TestFixture]
    internal class RollControllerTests : IntegrationTests
    {
        private RollController controller;

        [SetUp]
        public void Setup()
        {
            controller = GetController<RollController>();
        }

        [TestCase("16500001d1", false)]
        [TestCase("1d2200000000", false)]
        [TestCase("2d2100000000", false)]
        [TestCase("d20", true)]
        public void BUG_ExpressionValidatesWithoutError(string expression, bool valid)
        {
            var result = controller.ValidateExpression(expression);
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Value, Is.Not.Null);

            dynamic data = result.Value;
            Assert.That(data.isValid, Is.EqualTo(valid));
        }
    }
}
