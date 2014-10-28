using System;
using System.Web.Mvc;
using D20Dice;

namespace DNDGenSite.Controllers
{
    public class DiceController : Controller
    {
        private IDice dice;

        public DiceController(IDice dice)
        {
            this.dice = dice;
        }

        [HttpGet]
        public JsonResult D2(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d2();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D3(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d3();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D4(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d4();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D6(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d6();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D8(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d8();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D10(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d10();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D12(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d12();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D20(Int32 quantity)
        {
            var roll = dice.Roll(quantity).d20();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult Percentile(Int32 quantity)
        {
            var roll = dice.Roll(quantity).Percentile();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult Custom(Int32 quantity, Int32 die)
        {
            var roll = dice.Roll(quantity).d(die);
            return BuildJsonResult(roll);
        }

        private JsonResult BuildJsonResult(Int32 roll)
        {
            return Json(new { roll = roll }, JsonRequestBehavior.AllowGet);
        }
    }
}