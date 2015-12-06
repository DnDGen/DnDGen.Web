using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class ErrorController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
    }
}