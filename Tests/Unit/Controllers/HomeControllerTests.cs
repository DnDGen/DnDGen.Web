using DNDGenSite.Controllers;
using NUnit.Framework;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class HomeControllerTests
    {
        private HomeController controller;

        [SetUp]
        public void Setup()
        {
            controller = new HomeController();
        }

        [Test]
        public void HomeHandlesGetVerb()
        {
            Assert.Fail();
        }

        [Test]
        public void HomeReturnsView()
        {
            Assert.Fail();
        }
    }
}