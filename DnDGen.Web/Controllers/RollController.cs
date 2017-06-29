﻿using RollGen;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class RollController : Controller
    {
        private readonly Dice dice;

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
        public JsonResult Roll(int quantity, int die)
        {
            var roll = dice.Roll(quantity).d(die).AsSum();
            return BuildJsonResult(roll);
        }

        [HttpGet]
        public JsonResult RollExpression(string expression)
        {
            var roll = dice.Roll(expression).AsSum();
            return BuildJsonResult(roll);
        }

        private JsonResult BuildJsonResult(int roll)
        {
            return Json(new { roll = roll }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ValidateExpression(string expression)
        {
            var replacedExpression = dice.ReplaceExpressionWithTotal(expression);
            var result = 0;
            var isValid = int.TryParse(replacedExpression, out result);

            return Json(new { isValid = isValid }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Validate(int quantity, int die)
        {
            var isValid = quantity > 0
                && die > 0
                && quantity * die > 0
                && quantity <= Limits.Quantity
                && die <= Limits.Die
                && quantity * die <= Limits.ProductOfQuantityAndDie;

            return Json(new { isValid = isValid }, JsonRequestBehavior.AllowGet);
        }
    }
}