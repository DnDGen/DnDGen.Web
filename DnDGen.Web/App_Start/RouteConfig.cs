using System.Web.Mvc;
using System.Web.Routing;

namespace DnDGen.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}",
                defaults: new { Controller = "Home", Action = "Index" }
            );

            routes.MapRoute(
                name: "StandardRoll",
                url: "Roll/{action}/{quantity}",
                defaults: new { Controller = "Roll", Action = "D20" }
            );

            routes.MapRoute(
                name: "CustomRoll",
                url: "Roll/Custom/{quantity}/{die}",
                defaults: new { Controller = "Roll", Action = "Custom" }
            );

            routes.MapRoute(
                name: "Treasure",
                url: "Treasure/Generate/{level}",
                defaults: new { Controller = "Treasure", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Coin",
                url: "Treasures/Coin/Generate/{level}",
                defaults: new { Controller = "Coin", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Goods",
                url: "Treasures/Goods/Generate/{level}",
                defaults: new { Controller = "Goods", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Items",
                url: "Treasures/Items/Generate/{level}",
                defaults: new { Controller = "Items", Action = "Generate" }
            );

            routes.MapRoute(
                name: "AlchemicalItem",
                url: "Treasures/AlchemicalItem/Generate",
                defaults: new { Controller = "AlchemicalItem", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Tool",
                url: "Treasures/Tool/Generate",
                defaults: new { Controller = "Tool", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Armor",
                url: "Treasures/Armor/Generate/{power}",
                defaults: new { Controller = "Armor", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Potion",
                url: "Treasures/Potion/Generate/{power}",
                defaults: new { Controller = "Potion", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Ring",
                url: "Treasures/Ring/Generate/{power}",
                defaults: new { Controller = "Ring", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Rod",
                url: "Treasures/Rod/Generate/{power}",
                defaults: new { Controller = "Rod", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Scroll",
                url: "Treasures/Scroll/Generate/{power}",
                defaults: new { Controller = "Scroll", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Staff",
                url: "Treasures/Staff/Generate/{power}",
                defaults: new { Controller = "Staff", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Wand",
                url: "Treasures/Wand/Generate/{power}",
                defaults: new { Controller = "Wand", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Weapon",
                url: "Treasures/Weapon/Generate/{power}",
                defaults: new { Controller = "Weapon", Action = "Generate" }
            );

            routes.MapRoute(
                name: "WondrousItem",
                url: "Treasures/WondrousItem/Generate/{power}",
                defaults: new { Controller = "WondrousItem", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Randomizers",
                url: "Characters/Randomizers/{action}",
                defaults: new { Controller = "Randomizers", Action = "Verify" }
            );

            routes.MapRoute(
                name: "Leadership",
                url: "Characters/Leadership/{action}",
                defaults: new { Controller = "Leadership", Action = "Generate" }
            );
        }
    }
}