using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Functions;
using DnDGen.Api.CreatureGen.Models;
using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CreatureGen.Creatures;
using DnDGen.CreatureGen.Generators.Creatures;
using DnDGen.CreatureGen.Verifiers;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Specialized;
using System.Net;

namespace DnDGen.Api.CreatureGen.Tests.Unit.Functions
{
    [TestFixture]
    public class ValidateCreatureFunctionTests
    {
        private ValidateCreatureFunction function;
        private Mock<ICreatureVerifier> mockCreatureVerifier;
        private Mock<ILogger<GenerateCreatureFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockCreatureVerifier = new Mock<ICreatureVerifier>();
            mockLogger = new Mock<ILogger<GenerateCreatureFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CreatureGen.Functions.ValidateCreatureFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ICreatureVerifier>()).Returns(mockCreatureVerifier.Object);

            function = new ValidateCreatureFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheCreatureValidity(bool validity)
        {
            var creatureName = CreatureConstants.Goblin;
            var request = requestHelper.BuildRequest();

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, null))
                .Returns(validity);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateCreatureFunction.RunV1) processed a request.");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheCreatureValidity_WithSingleTemplate(bool validity)
        {
            var creatureName = CreatureConstants.Goblin;
            var template = CreatureConstants.Templates.Ghost;
            var query = $"?templates={template}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, It.Is<Filters>(f => f.Templates.IsEqualTo(new[] { template }))))
                .Returns(validity);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheCreatureValidity_WithMultipleTemplates(bool validity)
        {
            var creatureName = CreatureConstants.Goblin;
            var template1 = CreatureConstants.Templates.HalfDragon_Gold;
            var template2 = CreatureConstants.Templates.Skeleton;
            var query = new NameValueCollection
            {
                { "templates", template1 },
                { "templates", template2 },
            };
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, It.Is<Filters>(f => f.Templates.IsEqualTo(new[] { template1, template2 }))))
                .Returns(validity);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));
        }

        [Test]
        public async Task RunV1_ReturnsInvalid_WithInvalidCreatureName()
        {
            var creatureName = "InvalidCreature";
            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Creature is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.Creatures)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsInvalid_WithInvalidTemplate()
        {
            var creatureName = CreatureConstants.Goblin;
            var query = "?templates=InvalidTemplate";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Templates filter is not valid. Should be subset of: [{string.Join(", ", CreatureSpecifications.Templates)}]",
                LogLevel.Error);
        }
    }
}
