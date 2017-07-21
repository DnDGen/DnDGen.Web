using EventGen;
using System;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class EventController : Controller
    {
        private readonly GenEventQueue eventQueue;

        public EventController(GenEventQueue eventQueue)
        {
            this.eventQueue = eventQueue;
        }

        [HttpGet]
        public ActionResult ClientId()
        {
            var clientId = Guid.NewGuid().ToString();

            return Json(new { clientId = clientId }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult All(Guid clientId)
        {
            var events = eventQueue.DequeueAll(clientId);

            return Json(new { events = events }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void Clear(Guid clientId)
        {
            eventQueue.Clear(clientId);
        }
    }
}