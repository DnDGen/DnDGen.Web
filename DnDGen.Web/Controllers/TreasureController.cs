using DnDGen.Web.Models.Treasures;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class TreasureController : Controller
    {
        [Route("Treasure")]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new TreasureViewModel();
            return View(model);
        }
    }
}