using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class DungeonController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
    }
}