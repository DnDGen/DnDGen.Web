using DnDGen.Web.New.IoC;
using EventGen;
using Microsoft.AspNetCore.Mvc;

namespace DnDGen.Web.Controllers
{
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly GenEventQueue eventQueue;

        public EventController(IDependencyFactory dependencyFactory)
        {
            eventQueue = dependencyFactory.Get<GenEventQueue>();
        }

        [Route("event/clientId")]
        [HttpGet]
        public Guid ClientId()
        {
            var clientId = Guid.NewGuid();

            return clientId;
        }

        [Route("event/all")]
        [HttpGet]
        public IEnumerable<GenEvent> All(Guid clientId)
        {
            var events = eventQueue.DequeueAll(clientId);

            return events;
        }

        [Route("event/clear")]
        [HttpPost]
        public void Clear(Guid clientId)
        {
            eventQueue.Clear(clientId);
        }
    }
}