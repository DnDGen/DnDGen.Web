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
        [TestCase("All")]
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
        public void AllReturnsJsonResult()
        {
            var clientId = Guid.NewGuid();
            var result = controller.All(clientId);
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void AllJsonAllowsGet()
        {
            var clientId = Guid.NewGuid();
            var result = controller.All(clientId) as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void AllJsonReturnsEvents()
        {
            var clientId = Guid.NewGuid();
            var events = new[]
            {
                new GenEvent(),
                new GenEvent(),
            };

            mockEventQueue.Setup(q => q.DequeueAll(clientId)).Returns(events);

            var result = controller.All(clientId) as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.events, Is.EquivalentTo(events));
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
            mockEventQueue.Verify(q => q.Clear(It.IsAny<Guid>()), Times.Once);
            mockEventQueue.Verify(q => q.ClearCurrentThread(), Times.Never);
            mockEventQueue.Verify(q => q.DequeueAll(It.IsAny<Guid>()), Times.Never);
            mockEventQueue.Verify(q => q.DequeueAll(clientId), Times.Never);
            mockEventQueue.Verify(q => q.DequeueAllForCurrentThread(), Times.Never);
            mockEventQueue.Verify(q => q.DequeueForCurrentThread(), Times.Never);
            mockEventQueue.Verify(q => q.Dequeue(It.IsAny<Guid>()), Times.Never);
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<GenEvent>()), Times.Never);
            mockEventQueue.Verify(q => q.Enqueue(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }
    }
}
