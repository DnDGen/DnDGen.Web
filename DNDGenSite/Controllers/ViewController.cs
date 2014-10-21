using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class ViewController : Controller
    {
        [HttpGet]
        public ActionResult Home()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Dice()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Equipment()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Character()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Dungeon()
        {
            return View();
        }
    }
}