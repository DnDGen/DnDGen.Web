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