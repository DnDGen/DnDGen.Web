using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Functions;
using DnDGen.Api.CreatureGen.Models;
using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CreatureGen.Alignments;
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
    public class GenerateRandomCreatureFunctionTests
    {
        private GenerateRandomCreatureFunction function;
        private Mock<ICreatureVerifier> mockCreatureVerifier;
        private Mock<ICreatureGenerator> mockCreatureGenerator;
        private Mock<ILogger<GenerateRandomCreatureFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockCreatureVerifier = new Mock<ICreatureVerifier>();
            mockCreatureGenerator = new Mock<ICreatureGenerator>();
            mockLogger = new Mock<ILogger<GenerateRandomCreatureFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger(typeof(GenerateRandomCreatureFunction).FullName)).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ICreatureVerifier>()).Returns(mockCreatureVerifier.Object);
            mockDependencyFactory.Setup(f => f.Get<ICreatureGenerator>()).Returns(mockCreatureGenerator.Object);

            function = new GenerateRandomCreatureFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature()
        {
            var request = requestHelper.BuildRequest();

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, null, It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random creature name", HitPoints = new() };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, null, It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithSingleTemplate()
        {
            var template = CreatureConstants.Templates.Ghost;
            var query = $"?templates={template}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, null, It.Is<string[]>(t => t.IsEqualTo([template]))))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random templated creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, null, It.Is<string[]>(t => t.IsEqualTo([template]))))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithSingleTemplate_CaseInsensitive()
        {
            var template = CreatureConstants.Templates.Ghost;
            var query = $"?templates={template.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, null, It.Is<string[]>(t => t.IsEqualTo([template]))))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random templated creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, null, It.Is<string[]>(t => t.IsEqualTo([template]))))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithMultipleTemplates()
        {
            var template1 = CreatureConstants.Templates.HalfDragon_Gold;
            var template2 = CreatureConstants.Templates.Skeleton;
            var query = new NameValueCollection
            {
                { "templates", template1 },
                { "templates", template2 },
            };
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, null, It.Is<string[]>(t => t.IsEqualTo([template1, template2]))))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random multi-templated creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, null, It.Is<string[]>(t => t.IsEqualTo([template1, template2]))))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithAlignment()
        {
            var alignment = AlignmentConstants.LawfulGood;
            var query = $"?alignment={alignment}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.Alignments.Contains(alignment)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random aligned creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.Alignments.Contains(alignment)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithAlignment_CaseInsensitive()
        {
            var alignment = AlignmentConstants.LawfulGood;
            var query = $"?alignment={alignment.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.Alignments.Contains(alignment)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random aligned creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.Alignments.Contains(alignment)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithType()
        {
            var type = CreatureConstants.Types.Humanoid;
            var query = $"?type={type}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random typed creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithType_CaseInsensitive()
        {
            var type = CreatureConstants.Types.Humanoid;
            var query = $"?type={type.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random typed creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithSubtype()
        {
            var type = CreatureConstants.Types.Subtypes.Halfling;
            var query = $"?type={type}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random typed creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithSubtype_CaseInsensitive()
        {
            var type = CreatureConstants.Types.Subtypes.Halfling;
            var query = $"?type={type.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random typed creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.Types.Contains(type)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithChallengeRating()
        {
            var cr = ChallengeRatingConstants.CR22;
            var query = $"?cr={cr}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.ChallengeRatings.Contains(cr)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random cr-scaled creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.ChallengeRatings.Contains(cr)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithChallengeRating_Fractional()
        {
            var cr = ChallengeRatingConstants.CR1_2nd;
            var query = $"?cr={cr}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, It.Is<Filters>(f => f.ChallengeRatings.Contains(cr)), It.Is<string[]>(t => !t.Any())))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random cr-scaled creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null, It.Is<Filters>(f => f.ChallengeRatings.Contains(cr)), It.Is<string[]>(t => !t.Any())))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsRandomGeneratedCreature_WithAllFilters()
        {
            var template = CreatureConstants.Templates.Ghost;
            var alignment = AlignmentConstants.ChaoticEvil;
            var type = CreatureConstants.Types.MonstrousHumanoid;
            var cr = ChallengeRatingConstants.CR8;
            var query = $"?templates={template}";
            query += $"&alignment={alignment}";
            query += $"&type={type}";
            query += $"&cr={cr}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null,
                    It.Is<Filters>(f => f.Alignments.Contains(alignment) && f.Types.Contains(type) && f.ChallengeRatings.Contains(cr)),
                    It.Is<string[]>(t => t.IsEqualTo([template]))))
                .Returns(true);

            var expectedCreature = new Creature { Name = "My random filtered creature" };

            mockCreatureGenerator
                .Setup(g => g.GenerateRandomAsync(false, null,
                    It.Is<Filters>(f => f.Alignments.Contains(alignment) && f.Types.Contains(type) && f.ChallengeRatings.Contains(cr)),
                    It.Is<string[]>(t => t.IsEqualTo([template]))))
                .ReturnsAsync(expectedCreature);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature.Name, Is.EqualTo(expectedCreature.Name));
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidTemplate()
        {
            var query = "?templates=InvalidTemplate";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Templates filter is not valid. Should be subset of: [{string.Join(", ", CreatureSpecifications.AllTemplates)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidAlignment()
        {
            var query = "?alignment=Invalid Alignment";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Alignment filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.Alignments)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidType()
        {
            var query = "?type=InvalidType";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Creature Type filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.CreatureTypes)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidSubtype()
        {
            var query = "?type=InvalidSubtype";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Creature Type filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.CreatureTypes)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WithInvalidChallengeRating()
        {
            var query = "?cr=666";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Challenge Rating filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.ChallengeRatings)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsBadRequest_WhenCreatureVerifierReturnsFalse()
        {
            var request = requestHelper.BuildRequest();

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null, null, It.Is<string[]>(t => !t.Any())))
                .Returns(false);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog("Creature parameters are not compatible.", LogLevel.Error);
        }
    }
}
