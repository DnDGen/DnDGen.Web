using DnDGen.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class CharacterController : Controller
    {
        [Route("Character")]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new CharacterViewModel();
            return View(model);
        }
    }
}