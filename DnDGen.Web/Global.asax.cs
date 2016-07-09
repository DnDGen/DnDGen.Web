using DnDGen.Web.Repositories;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace DnDGen.Web
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        protected void Application_Error()
        {
            var exception = Server.GetLastError();
            if (exception == null)
                return;

            var errorRepository = DependencyResolver.Current.GetService<ErrorRepository>();
            errorRepository.Report(exception.Message, exception.StackTrace);

            var httpContext = HttpContext.Current;
            if (httpContext == null)
                return;

            var isMvcPage = httpContext.CurrentHandler is MvcHandler;
            if (isMvcPage == false)
            {
                httpContext.Response.Redirect("~/Error");
                return;
            }

            var mvcHandler = httpContext.CurrentHandler as MvcHandler;

            if (mvcHandler.RequestContext.HttpContext.Request.IsAjaxRequest())
                throw exception;

            httpContext.Response.Redirect("~/Error");
        }
    }
}
