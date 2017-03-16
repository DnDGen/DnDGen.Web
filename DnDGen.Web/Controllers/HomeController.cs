using DnDGen.Web.Repositories;
using EventGen;
using System;
using System.Threading;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class HomeController : Controller
    {
        private ClientIDManager clientIdManager;
        private GenEventQueue eventQueue;
        private TestRepo testRepo;

        public HomeController(ClientIDManager clientIdManager, GenEventQueue eventQueue, TestRepo testRepo)
        {
            this.clientIdManager = clientIdManager;
            this.eventQueue = eventQueue;
            this.testRepo = testRepo;
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Test()
        {
            return View();
        }

        [HttpGet]
        public JsonResult ClientId()
        {
            var id = Guid.NewGuid();
            return Json(new { id = id }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Start(Guid id)
        {
            clientIdManager.SetClientID(id);

            var limit = 20;
            var result = string.Empty;
            while (limit-- > 0)
            {
                result += testRepo.MakeResult();
                Thread.Sleep(500);
            }

            return Json(new { result = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Events(Guid id)
        {
            var events = eventQueue.DequeueAll(id);
            return Json(new { events = events }, JsonRequestBehavior.AllowGet);
        }
    }
}