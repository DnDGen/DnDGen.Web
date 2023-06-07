using EventGen;
using System;
using Microsoft.AspNetCore.Mvc;

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

            return Json(new { clientId = clientId });
        }

        [HttpGet]
        public ActionResult All(Guid clientId)
        {
            var events = eventQueue.DequeueAll(clientId);

            return Json(new { events = events });
        }

        [HttpPost]
        public void Clear(Guid clientId)
        {
            eventQueue.Clear(clientId);
        }
    }
}