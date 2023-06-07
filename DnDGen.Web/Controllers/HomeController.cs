using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
    }
}