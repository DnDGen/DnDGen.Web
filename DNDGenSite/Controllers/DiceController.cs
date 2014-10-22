using System;
using System.Web.Mvc;
using D20Dice;
using Ninject;

namespace DNDGenSite.Controllers
{
    public class DiceController : Controller
    {
        [Inject]
        public IDice Dice { get; set; }

        [HttpGet]
        public JsonResult D2(Int32 quantity)
        {
            var roll = Dice.Roll(quantity).d2();
            return Json(new { roll = roll }, JsonRequestBehavior.AllowGet);
        }
    }
}