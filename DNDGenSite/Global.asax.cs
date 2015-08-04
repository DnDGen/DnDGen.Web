using DNDGenSite.Repositories;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace DNDGenSite
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
            var task = errorRepository.Report(exception.Message, exception.StackTrace);

            var httpContext = HttpContext.Current;
            if (httpContext == null)
                return;

            var mvcHandler = httpContext.CurrentHandler as MvcHandler;
            var requestContext = mvcHandler.RequestContext;

            if (requestContext.HttpContext.Request.IsAjaxRequest() == false)
                httpContext.Response.Redirect("~/Error");

            httpContext.Response.Clear();
            var controllerName = requestContext.RouteData.GetRequiredString("controller");
            var factory = ControllerBuilder.Current.GetControllerFactory();
            var controller = factory.CreateController(requestContext, controllerName);
            var controllerContext = new ControllerContext(requestContext, (ControllerBase)controller);

            var jsonResult = new JsonResult();
            jsonResult.Data = new { success = false, serverError = "500" };
            jsonResult.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            jsonResult.ExecuteResult(controllerContext);
            httpContext.Response.End();
        }
    }
}
