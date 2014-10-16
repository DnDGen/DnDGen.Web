using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Home()
        {
            return View();
        }
    }
}