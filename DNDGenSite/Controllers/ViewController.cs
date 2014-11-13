using System.Web.Mvc;
using DNDGenSite.Models;
using EquipmentGen.Common.Items;

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
            var model = new EquipmentModel();
            model.Major = PowerConstants.Major;
            model.Medium = PowerConstants.Medium;
            model.Minor = PowerConstants.Minor;
            model.Mundane = PowerConstants.Mundane;

            return View(model);
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