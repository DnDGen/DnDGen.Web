using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Unit")]
[assembly: InternalsVisibleTo("DynamicProxyGenAssembly2")]
[assembly: InternalsVisibleTo("DnDGen.Web.Tests.Integration")]
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