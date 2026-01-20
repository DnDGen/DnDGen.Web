using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Functions;
using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CreatureGen.Creatures;
using DnDGen.CreatureGen.Defenses;
using DnDGen.CreatureGen.Generators.Creatures;
using DnDGen.CreatureGen.Verifiers;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.CreatureGen.Tests.Unit.Functions
{
    [TestFixture]
    public class GenerateCreatureFunctionTests
    {
        private GenerateCreatureFunction function;
        private Mock<ICreatureVerifier> mockCreatureVerifier;
        private Mock<ICreatureGenerator> mockCreatureGenerator;
        private Mock<ILogger<GenerateCreatureFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockCreatureVerifier = new Mock<ICreatureVerifier>();
            mockCreatureGenerator = new Mock<ICreatureGenerator>();
            mockLogger = new Mock<ILogger<GenerateCreatureFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CreatureGen.Functions.GenerateCreatureFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ICreatureVerifier>()).Returns(mockCreatureVerifier.Object);
            mockDependencyFactory.Setup(f => f.Get<ICreatureGenerator>()).Returns(mockCreatureGenerator.Object);

            function = new GenerateCreatureFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task RunV1_ReturnsGeneratedCreature_WithValidCreatureName()
        {
            var creatureName = CreatureConstants.Goblin;
            var request = requestHelper.BuildRequest();

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, null))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My creature name", HitPoints = new() };

            mockCreatureGenerator
                .Setup(g => g.GenerateAsync(false, creatureName, null, It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCreatureFunction.RunV1) processed a request.");
        }

        [Test]
        public async Task RunV1_ReturnsGeneratedCreature_WithSingleTemplate()
        {
            var creatureName = CreatureConstants.Goblin;
            var template = CreatureConstants.Templates.Ghost;
            var query = $"?templates={template}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, It.IsAny<Filters>()))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My templated creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateAsync(false, creatureName, null, It.Is<string[]>(t => t.Length == 1 && t[0] == template)))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsGeneratedCreature_WithMultipleTemplates()
        {
            var creatureName = CreatureConstants.Goblin;
            var template1 = CreatureConstants.Templates.HalfDragon_Gold;
            var template2 = CreatureConstants.Templates.Skeleton;
            var query = $"?templates={template1}&templates={template2}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, It.IsAny<Filters>()))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My multi-templated creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateAsync(false, creatureName, null, It.Is<string[]>(t => t.Length == 2 && t[0] == template1 && t[1] == template2)))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsGeneratedCreature_WithAlignmentFilter()
        {
            var creatureName = CreatureConstants.Goblin;
            var alignment = "Lawful Good";
            var query = $"?alignment={alignment}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, It.Is<Filters>(f => f.Alignment == alignment)))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My aligned creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateAsync(false, creatureName, null, It.IsAny<string[]>()))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidCreatureName()
        {
            var creatureName = "InvalidCreature";
            var request = requestHelper.BuildRequest();

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCreatureFunction.RunV1) processed a request.");
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidTemplate()
        {
            var creatureName = CreatureConstants.Goblin;
            var query = "?templates=InvalidTemplate";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidAlignment()
        {
            var creatureName = CreatureConstants.Goblin;
            var query = "?alignment=InvalidAlignment";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WhenCreatureVerifierReturnsFalse()
        {
            var creatureName = CreatureConstants.Goblin;
            var request = requestHelper.BuildRequest();

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, creatureName, It.IsAny<Filters>()))
                .Returns(false);

            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Creature parameters are not a valid combination.", LogLevel.Error);
        }
    }
}
