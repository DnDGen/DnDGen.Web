using DnDGen.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class RollController : Controller
    {
        [Route("Roll")]
        [HttpGet]
        public ActionResult Index()
        {
            var model = new RollViewModel();
            return View(model);
        }

        [Route("roll/viewmodel")]
        [HttpGet]
        public RollViewModel ViewModel()
        {
            return new RollViewModel();
        }
    }
}