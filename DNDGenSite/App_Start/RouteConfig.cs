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
        }
    }
}