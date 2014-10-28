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
        }
    }
}