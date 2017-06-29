using EventGen;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace DnDGen.Web.Controllers
{
    public class EventController : Controller
    {
        private readonly GenEventQueue eventQueue;
        private const int eventCount = 10;

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
        public ActionResult Events(Guid clientId)
        {
            var events = new List<GenEvent>();

            while (HasEventsToGet(clientId) && events.Count < eventCount)
            {
                try
                {
                    var genEvent = eventQueue.Dequeue(clientId);
                    events.Add(genEvent);
                }
                catch
                {

                }
            }

            //INFO: Want to get rid of extra events, so we don't get caught in a backlog on future requests
            if (events.Count == eventCount)
                Clear(clientId);

            return Json(new { events = events }, JsonRequestBehavior.AllowGet);
        }

        private bool HasEventsToGet(Guid clientId)
        {
            try
            {
                return eventQueue.ContainsEvents(clientId);
            }
            catch
            {
                return false;
            }
        }

        [HttpPost]
        public void Clear(Guid clientId)
        {
            try
            {
                eventQueue.DequeueAll(clientId);
            }
            catch
            {

            }
        }
    }
}