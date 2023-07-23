using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class RollController : Controller
    {
        [Route("Roll")]
        [HttpGet]
        public ActionResult Index()
        {
            //TODO: Create a view model detailing the limits for rolls, 1 - 10K
            //Can't actually do it until the web is using the current RollGen package
            return View();
        }
    }
}