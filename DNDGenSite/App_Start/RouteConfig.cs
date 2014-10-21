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
                defaults: new { controller = "View", action = "Home" }
            );
        }
    }
}