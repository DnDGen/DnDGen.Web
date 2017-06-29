using DnDGen.Web.Controllers;
using EventGen;
using Moq;
using NUnit.Framework;
using System;
using System.Web.Mvc;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    [TestFixture]
    public class EventControllerTests
    {
        private EventController controller;
        private Mock<GenEventQueue> mockEventQueue;

        [SetUp]
        public void Setup()
        {
            mockEventQueue = new Mock<GenEventQueue>();
            controller = new EventController(mockEventQueue.Object);
        }

        [TestCase("ClientId")]
        [TestCase("Events")]
        public void ActionHandlesGetVerb(string methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [TestCase("Clear")]
        public void ActionHandlesPostVerb(string methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpPostAttribute)));
        }

        [Test]
        public void ClientIdReturnsJsonResult()
        {
            var result = controller.ClientId();
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void ClientIdJsonAllowsGet()
        {
            var result = controller.ClientId() as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void ClientIdJsonReturnsClientId()
        {
            var result = controller.ClientId() as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.clientId, Is.Not.Null);
            Assert.That(data.clientId, Is.Not.EqualTo(Guid.Empty));
        }

        [Test]
        public void ClientIdJsonReturnsUniqueClientId()
        {
            var firstResult = controller.ClientId() as JsonResult;
            var secondResult = controller.ClientId() as JsonResult;

            dynamic firstData = firstResult.Data;
            dynamic secondData = secondResult.Data;

            Assert.That(firstData.clientId, Is.Not.Null);
            Assert.That(firstData.clientId, Is.Not.EqualTo(Guid.Empty));

            Assert.That(secondData.clientId, Is.Not.Null);
            Assert.That(secondData.clientId, Is.Not.EqualTo(Guid.Empty));

            Assert.That(firstData.clientId, Is.Not.EqualTo(secondData.clientId));
        }

        [Test]
        public void EventsReturnsJsonResult()
        {
            var clientId = Guid.NewGuid();
            var result = controller.Events(clientId);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void EventsJsonAllowsGet()
        {
            var clientId = Guid.NewGuid();
            var result = controller.Events(clientId) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void EventsJsonReturnsEvents()
        {
            var clientId = Guid.NewGuid();
            var events = new[]
            {
                new GenEvent(),
                new GenEvent(),
            };

            mockEventQueue.SetupSequence(q => q.ContainsEvents(clientId))
                .Returns(true)
                .Returns(true)
                .Returns(false);

            mockEventQueue.SetupSequence(q => q.Dequeue(clientId))
                .Returns(events[0])
                .Returns(events[1]);

            var result = controller.Events(clientId) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.events, Is.EquivalentTo(events));
        }

        [Test]
        public void EventsJsonReturnsCappedEvents()
        {
            var clientId = Guid.NewGuid();

            mockEventQueue.Setup(q => q.ContainsEvents(clientId)).Returns(true);
            mockEventQueue.Setup(q => q.Dequeue(clientId)).Returns(() => new GenEvent());

            var result = controller.Events(clientId) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.events.Count, Is.EqualTo(10));
            mockEventQueue.Verify(q => q.DequeueAll(It.IsAny<Guid>()), Times.Once);
            mockEventQueue.Verify(q => q.DequeueAll(clientId), Times.Once);
            mockEventQueue.Verify(q => q.DequeueAll(), Times.Never);
            mockEventQueue.Verify(q => q.Dequeue(), Times.Never);
            mockEventQueue.Verify(q => q.Dequeue(It.IsAny<Guid>()), Times.Exactly(10));
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<GenEvent>()), Times.Never);
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Test]
        public void EventsJsonReturnsSomeEventsWhenExceptionThrownWhileDequeueing()
        {
            var clientId = Guid.NewGuid();

            mockEventQueue.SetupSequence(q => q.ContainsEvents(clientId))
                .Returns(true)
                .Returns(true)
                .Returns(true)
                .Returns(false);

            mockEventQueue.SetupSequence(q => q.Dequeue(clientId))
                .Returns(new GenEvent())
                .Throws<InvalidOperationException>()
                .Returns(new GenEvent());

            var result = controller.Events(clientId) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.events, Is.Not.Null);
            Assert.That(data.events, Is.Not.Empty);
            Assert.That(data.events.Count, Is.EqualTo(2));
        }

        [Test]
        public void EventsJsonReturnsNoEventsWhenExceptionThrown()
        {
            var clientId = Guid.NewGuid();

            mockEventQueue.SetupSequence(q => q.ContainsEvents(clientId))
                .Returns(true)
                .Returns(true)
                .Returns(true)
                .Returns(false);

            mockEventQueue.Setup(q => q.Dequeue(clientId)).Throws<InvalidOperationException>();

            var result = controller.Events(clientId) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.events, Is.Not.Null);
            Assert.That(data.events, Is.Empty);
        }

        [Test]
        public void EventsJsonReturnsNoEventsWhenExceptionThrownWhileCheckingIfEvents()
        {
            var clientId = Guid.NewGuid();

            mockEventQueue.SetupSequence(q => q.ContainsEvents(clientId))
                .Returns(true)
                .Throws<InvalidOperationException>()
                .Returns(true)
                .Returns(false);

            mockEventQueue.Setup(q => q.Dequeue(clientId)).Returns(() => new GenEvent());

            var result = controller.Events(clientId) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.events, Is.Not.Null);
            Assert.That(data.events, Is.Not.Empty);
            Assert.That(data.events.Count, Is.EqualTo(1));
        }

        [Test]
        public void ClearRemovesAllEventsForClientId()
        {
            var clientId = Guid.NewGuid();
            var events = new[]
            {
                new GenEvent(),
                new GenEvent(),
            };

            mockEventQueue.Setup(q => q.DequeueAll(clientId)).Returns(events);

            controller.Clear(clientId);
            mockEventQueue.Verify(q => q.DequeueAll(It.IsAny<Guid>()), Times.Once);
            mockEventQueue.Verify(q => q.DequeueAll(clientId), Times.Once);
            mockEventQueue.Verify(q => q.DequeueAll(), Times.Never);
            mockEventQueue.Verify(q => q.Dequeue(), Times.Never);
            mockEventQueue.Verify(q => q.Dequeue(It.IsAny<Guid>()), Times.Never);
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<GenEvent>()), Times.Never);
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Test]
        public void ClearDoesNotThrowExceptions()
        {
            var clientId = Guid.NewGuid();
            mockEventQueue.Setup(q => q.DequeueAll(clientId)).Throws<InvalidOperationException>();

            controller.Clear(clientId);
            mockEventQueue.Verify(q => q.DequeueAll(It.IsAny<Guid>()), Times.Once);
            mockEventQueue.Verify(q => q.DequeueAll(clientId), Times.Once);
            mockEventQueue.Verify(q => q.DequeueAll(), Times.Never);
            mockEventQueue.Verify(q => q.Dequeue(), Times.Never);
            mockEventQueue.Verify(q => q.Dequeue(It.IsAny<Guid>()), Times.Never);
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<GenEvent>()), Times.Never);
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }
    }
}
