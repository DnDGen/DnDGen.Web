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
    public class ValidateRandomCreatureFunctionTests
    {
        private ValidateRandomCreatureFunction function;
        private Mock<ICreatureVerifier> mockCreatureVerifier;
        private Mock<ILogger<ValidateRandomCreatureFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockCreatureVerifier = new Mock<ICreatureVerifier>();
            mockLogger = new Mock<ILogger<ValidateRandomCreatureFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CreatureGen.Functions.ValidateRandomCreatureFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ICreatureVerifier>()).Returns(mockCreatureVerifier.Object);

            function = new ValidateRandomCreatureFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheRandomCreatureValidity(bool validity)
        {
            var request = requestHelper.BuildRequest();

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, null))
                .Returns(validity);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.EqualTo(validity));

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomCreatureFunction.RunV1) processed a request.");
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithSingleTemplate(bool validity)
        {
            var template = CreatureConstants.Templates.Ghost;
            var query = $"?templates={template}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Templates.IsEqualTo(new[] { template }))))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithSingleTemplate_CaseInsensitive(bool validity)
        {
            var template = CreatureConstants.Templates.Ghost;
            var query = $"?templates={template.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Templates.IsEqualTo(new[] { template }))))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithMultipleTemplates(bool validity)
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
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Templates.IsEqualTo(new[] { template1, template2 }))))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithAlignment(bool validity)
        {
            var alignment = AlignmentConstants.LawfulGood;
            var query = $"?alignment={alignment}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Alignment == alignment)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithAlignment_CaseInsensitive(bool validity)
        {
            var alignment = AlignmentConstants.LawfulGood;
            var query = $"?alignment={alignment.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Alignment == alignment)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithType(bool validity)
        {
            var type = CreatureConstants.Types.Humanoid;
            var query = $"?type={type}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Type == type)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithType_CaseInsensitive(bool validity)
        {
            var type = CreatureConstants.Types.Humanoid;
            var query = $"?type={type.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Type == type)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithSubtype(bool validity)
        {
            var type = CreatureConstants.Types.Subtypes.Halfling;
            var query = $"?type={type}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Type == type)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithSubtype_CaseInsensitive(bool validity)
        {
            var type = CreatureConstants.Types.Subtypes.Halfling;
            var query = $"?type={type.ToUpper()}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Type == type)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithChallengeRating(bool validity)
        {
            var cr = ChallengeRatingConstants.CR22;
            var query = $"?cr={cr}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.ChallengeRating == cr)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithChallengeRating_Fractional(bool validity)
        {
            var cr = ChallengeRatingConstants.CR1_2nd;
            var query = $"?cr={cr}";
            var request = requestHelper.BuildRequest(query);

            mockCreatureVerifier
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.ChallengeRating == cr)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsTheRandomCreatureValidity_WithAllFilters(bool validity)
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
                .Setup(v => v.VerifyCompatibility(false, null, It.Is<Filters>(f => f.Templates.IsEqualTo(new[] { template })
                    && f.Alignment == alignment
                    && f.Type == type
                    && f.ChallengeRating == cr)))
                .Returns(validity);

            var response = await function.RunV1(request);

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
        public async Task RunV1_ReturnsInvalid_WithInvalidTemplate()
        {
            var query = "?templates=InvalidTemplate";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Templates filter is not valid. Should be subset of: [{string.Join(", ", CreatureSpecifications.Templates)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsInvalid_WithInvalidAlignment()
        {
            var query = "?alignment=Invalid Alignment";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Alignment filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.Alignments)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsInvalid_WithInvalidType()
        {
            var query = "?type=InvalidType";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Creature Type filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.CreatureTypes)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsInvalid_WithInvalidSubtype()
        {
            var query = "?type=InvalidSubtype";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Creature Type filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.CreatureTypes)}]",
                LogLevel.Error);
        }

        [Test]
        public async Task RunV1_ReturnsInvalid_WithInvalidChallengeRating()
        {
            var query = "?cr=666";
            var request = requestHelper.BuildRequest(query);

            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);

            mockLogger.AssertLog("C# HTTP trigger function (ValidateRandomCreatureFunction.RunV1) processed a request.");
            mockLogger.AssertLog(
                $"Parameters are not valid. Error: Challenge Rating filter is not valid. Should be one of: [{string.Join(", ", CreatureSpecifications.ChallengeRatings)}]",
                LogLevel.Error);
        }
    }
}
