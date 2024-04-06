using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Leaders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Functions
{
    public class GenerateFollowerFunctionTests
    {
        private GenerateFollowerFunction function;
        private Mock<ILeadershipGenerator> mockLeadershipGenerator;
        private Mock<ILogger> mockLogger;
        private HttpRequest request;

        [SetUp]
        public void Setup()
        {
            mockLeadershipGenerator = new Mock<ILeadershipGenerator>();
            mockLogger = new Mock<ILogger>();
            request = RequestHelper.BuildRequest();

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ILeadershipGenerator>()).Returns(mockLeadershipGenerator.Object);

            function = new GenerateFollowerFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedFollower()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticNeutral)}";
            query += "&leaderClassName=bard";

            request = RequestHelper.BuildRequest(query);

            var follower = new Character();
            follower.Alignment = new Alignment("follower alignment");
            follower.Class.Level = 600;
            follower.Class.Name = "follower class";
            follower.Race.BaseRace = "follower base race";

            mockLeadershipGenerator
                .Setup(g => g.GenerateFollower(1, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns(follower);

            var result = await function.Run(request, 1, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(follower));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateFollowerFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Follower: {follower.Summary}");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersInvalid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticNeutral)}";
            query += "&leaderClassName=bard";

            request = RequestHelper.BuildRequest(query);

            var result = await function.Run(request, 7, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateFollowerFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Error: FollowerLevel is not valid. Should be 1 <= level <= 6", LogLevel.Error);
        }
    }
}