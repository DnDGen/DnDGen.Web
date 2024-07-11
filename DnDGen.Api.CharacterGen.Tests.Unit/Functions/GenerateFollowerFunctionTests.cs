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
    public class GenerateFollowerFunctionTests
    {
        private GenerateFollowerFunction function;
        private Mock<ILeadershipGenerator> mockLeadershipGenerator;
        private Mock<ILogger<GenerateFollowerFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLeadershipGenerator = new Mock<ILeadershipGenerator>();
            mockLogger = new Mock<ILogger<GenerateFollowerFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CharacterGen.Functions.GenerateFollowerFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ILeadershipGenerator>()).Returns(mockLeadershipGenerator.Object);

            function = new GenerateFollowerFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedFollower()
        {
            var query = $"?leaderAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&leaderClassName=bard";

            var request = requestHelper.BuildRequest(query);

            var follower = new Character();
            follower.Alignment = new Alignment("follower alignment");
            follower.Class.Level = 600;
            follower.Class.Name = "follower class";
            follower.Race.BaseRace = "follower base race";

            mockLeadershipGenerator
                .Setup(g => g.GenerateFollower(1, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns(follower);

            var response = await function.Run(request, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseFollower = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseFollower, Is.Not.Null);
            Assert.That(responseFollower.Summary, Is.EqualTo(follower.Summary));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateFollowerFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Follower: {follower.Summary}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersInvalid()
        {
            var query = $"?leaderAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&leaderClassName=bard";

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, 7);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateFollowerFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Error: FollowerLevel is not valid. Should be 1 <= level <= 6", LogLevel.Error);
        }

        [Test]
        public async Task Run_ReturnsFollower_SortsCharacterSkills()
        {
            var follower = new Character
            {
                Alignment = new Alignment("my alignment")
            };
            follower.Class.Level = 42;
            follower.Class.Name = "my class";
            follower.Race.BaseRace = "my base race";
            follower.Skills =
            [
                new Skill("zzzz", new Ability(string.Empty), 123456) { Ranks = 42 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "ccccc") { Ranks = 600 },
                new Skill("aaaa", new Ability(string.Empty), 123456, "bbbbb") { Ranks = 1234 },
                new Skill("kkkk", new Ability(string.Empty), 123456) { Ranks = 1337 },
            ];

            mockLeadershipGenerator
                .Setup(g => g.GenerateFollower(6, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns(follower);

            var query = $"?leaderAlignment={AlignmentConstants.ChaoticNeutral}";
            query += "&leaderClassName=bard";

            var request = requestHelper.BuildRequest(query);

            var response = await function.Run(request, 6);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseFollower = StreamHelper.Read<Character>(response.Body);
            Assert.That(responseFollower, Is.Not.Null);
            Assert.That(responseFollower.Summary, Is.EqualTo(follower.Summary));
            Assert.That(responseFollower.Skills, Is.Ordered.By("Name").Then.By("Focus"));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateFollowerFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Follower: {follower.Summary}");
        }
    }
}