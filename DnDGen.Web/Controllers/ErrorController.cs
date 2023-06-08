using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class ErrorController : Controller
    {
        public ErrorController()
        {
        }

        [HttpGet]
        public ViewResult Index()
        {
            return View();
        }
    }
}