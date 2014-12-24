using System.Web.Mvc;
using System.Web.Routing;

namespace DNDGenSite
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{action}",
                defaults: new { Controller = "View", Action = "Home" }
            );

            routes.MapRoute(
                name: "Views",
                url: "View/{action}",
                defaults: new { Controller = "View", Action = "Home" }
            );

            routes.MapRoute(
                name: "Dice",
                url: "Dice/{action}/{quantity}",
                defaults: new { Controller = "Dice" }
            );

            routes.MapRoute(
                name: "CustomDice",
                url: "Dice/Custom/{quantity}/{die}",
                defaults: new { Controller = "Dice", Action = "Custom" }
            );

            routes.MapRoute(
                name: "Treasure",
                url: "Equipment/Treasure/Generate/{level}",
                defaults: new { Controller = "Treasure", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Coin",
                url: "Equipment/Coin/Generate/{level}",
                defaults: new { Controller = "Coin", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Goods",
                url: "Equipment/Goods/Generate/{level}",
                defaults: new { Controller = "Goods", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Items",
                url: "Equipment/Items/Generate/{level}",
                defaults: new { Controller = "Items", Action = "Generate" }
            );

            routes.MapRoute(
                name: "AlchemicalItem",
                url: "Equipment/AlchemicalItem/Generate",
                defaults: new { Controller = "AlchemicalItem", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Tool",
                url: "Equipment/Tool/Generate",
                defaults: new { Controller = "Tool", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Armor",
                url: "Equipment/Armor/Generate/{power}",
                defaults: new { Controller = "Armor", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Potion",
                url: "Equipment/Potion/Generate/{power}",
                defaults: new { Controller = "Potion", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Ring",
                url: "Equipment/Ring/Generate/{power}",
                defaults: new { Controller = "Ring", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Rod",
                url: "Equipment/Rod/Generate/{power}",
                defaults: new { Controller = "Rod", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Scroll",
                url: "Equipment/Scroll/Generate/{power}",
                defaults: new { Controller = "Scroll", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Staff",
                url: "Equipment/Staff/Generate/{power}",
                defaults: new { Controller = "Staff", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Wand",
                url: "Equipment/Wand/Generate/{power}",
                defaults: new { Controller = "Wand", Action = "Generate" }
            );

            routes.MapRoute(
                name: "Weapon",
                url: "Equipment/Weapon/Generate/{power}",
                defaults: new { Controller = "Weapon", Action = "Generate" }
            );

            routes.MapRoute(
                name: "WondrousItem",
                url: "Equipment/WondrousItem/Generate/{power}",
                defaults: new { Controller = "WondrousItem", Action = "Generate" }
            );
        }
    }
}