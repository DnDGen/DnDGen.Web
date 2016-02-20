using DNDGenSite.Repositories;
using System.Web.Mvc;

namespace DNDGenSite.Controllers
{
    public class ErrorController : Controller
    {
        private ErrorRepository errorRepository;

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