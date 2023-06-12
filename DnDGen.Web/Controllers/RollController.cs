using DnDGen.Web.App_Start;
using Microsoft.AspNetCore.Mvc;
using RollGen;

namespace DnDGen.Web.Controllers
{
    public class RollController : Controller
    {
        private readonly Dice dice;

        public RollController(IDependencyFactory dependencyFactory)
        {
            dice = dependencyFactory.Get<Dice>();
        }

        [Route("Roll")]
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [Route("Roll/Roll")]
        [HttpGet]
        public JsonResult Roll(int quantity, int die)
        {
            var roll = dice.Roll(quantity).d(die).AsSum();
            return BuildJsonResult(roll);
        }

        [Route("Roll/RollExpression")]
        [HttpGet]
        public JsonResult RollExpression(string expression)
        {
            var roll = dice.Roll(expression).AsSum();
            return BuildJsonResult(roll);
        }

        private JsonResult BuildJsonResult(int roll)
        {
            return BuildJsonResult(new { roll = roll });
        }

        private JsonResult BuildJsonResult(object data)
        {
            return Json(data);
        }

        [Route("Roll/ValidateExpression")]
        [HttpGet]
        public JsonResult ValidateExpression(string expression)
        {
            var replacedExpression = dice.ReplaceExpressionWithTotal(expression);
            var result = 0;
            var isValid = int.TryParse(replacedExpression, out result);

            return BuildJsonResult(isValid);
        }

        private JsonResult BuildJsonResult(bool isValid)
        {
            return BuildJsonResult(new { isValid = isValid });
        }

        [Route("Roll/Validate")]
        [HttpGet]
        public JsonResult Validate(int quantity, int die)
        {
            var isValid = quantity > 0
                && die > 0
                && quantity * die > 0
                && quantity <= Limits.Quantity
                && die <= Limits.Die
                && quantity * die <= Limits.ProductOfQuantityAndDie;

            return BuildJsonResult(isValid);
        }
    }
}