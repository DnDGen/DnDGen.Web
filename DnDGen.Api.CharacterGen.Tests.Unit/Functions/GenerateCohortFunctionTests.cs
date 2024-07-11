using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Abilities;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Leaders;
using DnDGen.CharacterGen.Skills;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Functions
{
    public class GenerateCohortFunctionTests
    {
        private GenerateCohortFunction function;
        private Mock<ILeadershipGenerator> mockLeadershipGenerator;
        private Mock<ILogger<GenerateCohortFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLeadershipGenerator = new Mock<ILeadershipGenerator>();
            mockLogger = new Mock<ILogger<GenerateCohortFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CharacterGen.Functions.GenerateCohortFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ILeadershipGenerator>()).Returns(mockLeadershipGenerator.Object);

            function = new GenerateCohortFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCohort()
        {
            var query = $"?leaderAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&leaderClassName=bard";
            query += "&leaderLevel=9";

            var request = requestHelper.BuildRequest(query);

            var cohort = new Character();
            cohort.Alignment = new Alignment("cohort alignment");
            cohort.Class.Level = 600;
            cohort.Class.Name = "cohort class";
            cohort.Race.BaseRace = "cohort base race";

            mockLeadershipGenerator
                .Setup(g => g.GenerateCohort(9266, 9, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns(cohort);

            var response = await function.Run(request, 9266);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCohort = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCohort, Is.Not.Null);
            Assert.That(responseCohort.Summary, Is.EqualTo(cohort.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Cohort: {cohort.Summary}");
        }

        [Test]
        public async Task Run_ReturnsNoGeneratedCohort()
        {
            var query = $"?leaderAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&leaderClassName=bard";
            query += "&leaderLevel=9";

            var request = requestHelper.BuildRequest(query);

            mockLeadershipGenerator
                .Setup(g => g.GenerateCohort(9266, 9, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns((Character)null);

            var response = await function.Run(request, 9266);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.EqualTo("null"));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated Cohort: (None)");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersInvalid()
        {
            var query = $"?leaderAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&leaderClassName=bard";
            query += "&leaderLevel=5";

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, 9266);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Error: LeaderLevel is not valid. Should be 6 <= level <= 20", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsCohort_SortsCharacterSkills()
        {
            var cohort = new Character
            {
                Alignment = new Alignment("my alignment")
            };
            cohort.Class.Level = 42;
            cohort.Class.Name = "my class";
            cohort.Race.BaseRace = "my base race";
            cohort.Skills =
            [
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            ];

            mockLeadershipGenerator
                .Setup(g => g.GenerateCohort(9266, 9, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns(cohort);

            var query = $"?leaderAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&leaderClassName=bard";
            query += "&leaderLevel=9";

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, 9266);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseCohort = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseCohort, Is.Not.Null);
            Assert.That(responseCohort.Summary, Is.EqualTo(cohort.Summary));
            Assert.That(responseCohort.Skills, Is.Ordered.By("Name").Then.By("Focus"));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Cohort: {cohort.Summary}");
        }
    }
}