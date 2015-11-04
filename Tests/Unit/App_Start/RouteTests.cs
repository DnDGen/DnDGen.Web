using NUnit.Framework;
using System;
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

        [TestCase("Default", "{action}", "View", "Home")]
        [TestCase("Roll", "Roll/{action}/{quantity}", "Roll", null)]
        [TestCase("CustomRoll", "Roll/Custom/{quantity}/{die}", "Roll", "Custom")]
        [TestCase("Treasure", "Treasures/Treasure/Generate/{level}", "Treasure", "Generate")]
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
        [TestCase("Character", "Character/Generate", "Character", "Generate")]
        [TestCase("Randomizers", "Randomizers/Verify", "Randomizers", "Verify")]
        public void RouteIsMapped(String name, String url, String controller, String action)
        {
            Assert.That(routes[name], Is.InstanceOf<Route>());

            var route = routes[name] as Route;
            Assert.That(route.Url, Is.EqualTo(url));
            Assert.That(route.Defaults["Controller"], Is.EqualTo(controller));
            Assert.That(route.Defaults["Action"], Is.EqualTo(action));
        }
    }
}