using EventGen;
using System;

namespace DnDGen.Web.Repositories
{
    public class TestRepo
    {
        private ClientIDManager clientIdManager;
        private GenEventQueue eventQueue;

        public TestRepo(ClientIDManager clientIdManager, GenEventQueue eventQueue)
        {
            this.eventQueue = eventQueue;
            this.clientIdManager = clientIdManager;
        }

        public string MakeResult()
        {
            var result = Guid.NewGuid().ToString();

            var id = clientIdManager.GetClientID();
            var testEvent = new GenEvent();
            testEvent.When = DateTime.Now;
            testEvent.Source = $"test of {id}";
            testEvent.Message = $"This is test of {result}";

            eventQueue.Enqueue(testEvent);

            return result;
        }
    }
}