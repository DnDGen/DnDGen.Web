using DNDGenSite.Repositories;
using System;
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
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public void Report(String error, String cause)
        {
            errorRepository.Report(error, cause);
        }
    }
}