using DnDGen.Web.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    public class ErrorController : Controller
    {
        private readonly ErrorRepository errorRepository;

        public ErrorController(ErrorRepository errorRepository)
        {
            this.errorRepository = errorRepository;
        }

        [HttpGet]
        public ViewResult Index()
        {
            return View();
        }

        [HttpPost]
        public void Report(string error, string cause)
        {
            errorRepository.Report(error, cause);
        }
    }
}