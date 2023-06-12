using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class HomeController : Controller
    {
        [Route("")]
        [Route("Home")]
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [Route("Error")]
        [HttpGet]
        public ViewResult Error()
        {
            return View();
        }
    }
}