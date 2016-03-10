using RollGen;
using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class RollController : Controller
    {
        private Dice dice;

        public RollController(Dice dice)
        {
            this.dice = dice;
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult D2(int quantity)
        {
            var roll = dice.Roll(quantity).d2();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D3(int quantity)
        {
            var roll = dice.Roll(quantity).d3();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D4(int quantity)
        {
            var roll = dice.Roll(quantity).d4();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D6(int quantity)
        {
            var roll = dice.Roll(quantity).d6();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D8(int quantity)
        {
            var roll = dice.Roll(quantity).d8();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D10(int quantity)
        {
            var roll = dice.Roll(quantity).d10();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D12(int quantity)
        {
            var roll = dice.Roll(quantity).d12();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D20(int quantity)
        {
            var roll = dice.Roll(quantity).d20();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult D100(int quantity)
        {
            var roll = dice.Roll(quantity).Percentile();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult Custom(int quantity, int die)
        {
            var roll = dice.Roll(quantity).d(die);
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult Expression(string expression)
        {
            var roll = dice.Roll(expression);
            return BuildJsonResult(roll);
        }

        private JsonResult BuildJsonResult(int roll)
        {
            return Json(new { roll = roll }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Validate(string expression)
        {
            var isValid = dice.ContainsRoll(expression);

            if (isValid == false)
                return Json(new { isValid = isValid }, JsonRequestBehavior.AllowGet);

            var replacedExpression = dice.ReplaceExpressionWithTotal(expression);
            var result = 0;
            isValid &= int.TryParse(replacedExpression, out result);

            return Json(new { isValid = isValid }, JsonRequestBehavior.AllowGet);
        }
    }
}