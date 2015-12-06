using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class EncounterController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
    }
}