using NUnit.Framework;
using System.Web.Routing;

namespace DnDGen.Web.Tests.Unit.App_Start
{
    [TestFixture]
    public class RouteTests
    {
        private RouteCollection routes;

        [SetUp]
        public void Setup()
        {
            routes = new RouteCollection();
            RouteConfig.RegisterRoutes(routes);
        }

        [TestCase("Default", "{controller}/{action}", "Home", "Index")]
        [TestCase("Randomizers", "Characters/Randomizers/{action}", "Randomizers", "Verify")]
        [TestCase("Leadership", "Characters/Leadership/{action}", "Leadership", "Generate")]
        public void RouteIsMapped(string name, string url, string controller, string action)
        {
            Assert.That(routes[name], Is.InstanceOf<Route>());

            var route = routes[name] as Route;
            Assert.That(route.Url, Is.EqualTo(url));
            Assert.That(route.Defaults["Controller"], Is.EqualTo(controller));
            Assert.That(route.Defaults["Action"], Is.EqualTo(action));
        }

        [Test]
        public void AllRoutesMapped()
        {
            //INFO: +1 route for the ignored route
            Assert.That(routes.Count, Is.EqualTo(4));
        }
    }
}