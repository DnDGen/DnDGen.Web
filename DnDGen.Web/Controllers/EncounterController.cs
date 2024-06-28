using DnDGen.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class EncounterController : Controller
    {
        [Route("Encounter")]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new EncounterViewModel();
            return View(model);
        }
    }
}