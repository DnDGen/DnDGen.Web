using DnDGen.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class DungeonController : Controller
    {
        [Route("Dungeon")]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterViewModel();
            return View(model);
        }
    }
}