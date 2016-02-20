using DNDGenSite.Controllers;
using DNDGenSite.Repositories;
using Moq;
using NUnit.Framework;
using System.Web.Mvc;

namespace DNDGenSite.Tests.Unit.Controllers
{
    [TestFixture]
    public class ErrorControllerTests
    {
        private ErrorController controller;
        private Mock<ErrorRepository> mockErrorRepository;

        [SetUp]
        public void Setup()
        {
            mockErrorRepository = new Mock<ErrorRepository>();
            controller = new ErrorController(mockErrorRepository.Object);
        }

        [TestCase("Index")]
        public void ActionHandlesGetVerb(string methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [TestCase("Report")]
        public void ActionHandlesPostVerb(string methodName)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, methodName);
            Assert.That(attributes, Contains.Item(typeof(HttpPostAttribute)));
        }

        [Test]
        public void IndexReturnsView()
        {
            var result = controller.Index();
            Assert.That(result, Is.InstanceOf<ViewResult>());
        }

        [Test]
        public void ReportPostsErrorFromClient()
        {
            controller.Report("something went wrong", "cause");
            mockErrorRepository.Verify(e => e.Report("something went wrong", "cause"), Times.Once);
            mockErrorRepository.Verify(e => e.Report(It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }
    }
}
