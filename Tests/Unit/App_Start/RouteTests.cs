using NUnit.Framework;
using System.Web.Routing;

namespace DNDGenSite.Tests.Unit.App_Start
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
        [TestCase("StandardRoll", "Roll/{action}/{quantity}", "Roll", "D20")]
        [TestCase("CustomRoll", "Roll/Custom/{quantity}/{die}", "Roll", "Custom")]
        [TestCase("Treasure", "Treasure/Generate/{level}", "Treasure", "Generate")]
        [TestCase("Coin", "Treasures/Coin/Generate/{level}", "Coin", "Generate")]
        [TestCase("Goods", "Treasures/Goods/Generate/{level}", "Goods", "Generate")]
        [TestCase("Items", "Treasures/Items/Generate/{level}", "Items", "Generate")]
        [TestCase("AlchemicalItem", "Treasures/AlchemicalItem/Generate", "AlchemicalItem", "Generate")]
        [TestCase("Tool", "Treasures/Tool/Generate", "Tool", "Generate")]
        [TestCase("Armor", "Treasures/Armor/Generate/{power}", "Armor", "Generate")]
        [TestCase("Potion", "Treasures/Potion/Generate/{power}", "Potion", "Generate")]
        [TestCase("Ring", "Treasures/Ring/Generate/{power}", "Ring", "Generate")]
        [TestCase("Rod", "Treasures/Rod/Generate/{power}", "Rod", "Generate")]
        [TestCase("Scroll", "Treasures/Scroll/Generate/{power}", "Scroll", "Generate")]
        [TestCase("Staff", "Treasures/Staff/Generate/{power}", "Staff", "Generate")]
        [TestCase("Wand", "Treasures/Wand/Generate/{power}", "Wand", "Generate")]
        [TestCase("Weapon", "Treasures/Weapon/Generate/{power}", "Weapon", "Generate")]
        [TestCase("WondrousItem", "Treasures/WondrousItem/Generate/{power}", "WondrousItem", "Generate")]
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
        public void RoutesMapped()
        {
            //INFO: +1 route for the ignored route
            Assert.That(routes.Count, Is.EqualTo(21));
        }
    }
}