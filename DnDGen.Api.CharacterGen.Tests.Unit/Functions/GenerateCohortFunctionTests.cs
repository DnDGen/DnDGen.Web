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
    public class GenerateCohortFunctionTests
    {
        private GenerateCohortFunction function;
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

            function = new GenerateCohortFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedCohort()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticNeutral)}";
            query += "&leaderClassName=bard";
            query += "&leaderLevel=9";

            request = RequestHelper.BuildRequest(query);

            var cohort = new Character();
            cohort.Alignment = new Alignment("cohort alignment");
            cohort.Class.Level = 600;
            cohort.Class.Name = "cohort class";
            cohort.Race.BaseRace = "cohort base race";

            mockLeadershipGenerator
                .Setup(g => g.GenerateCohort(9266, 9, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns(cohort);

            var result = await function.Run(request, 9266, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(cohort));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Cohort: {cohort.Summary}");
        }

        [Test]
        public async Task Run_ReturnsNoGeneratedCohort()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticNeutral)}";
            query += "&leaderClassName=bard";
            query += "&leaderLevel=9";

            request = RequestHelper.BuildRequest(query);

            mockLeadershipGenerator
                .Setup(g => g.GenerateCohort(9266, 9, AlignmentConstants.ChaoticNeutral, CharacterClassConstants.Bard))
                .Returns((Character)null);

            var result = await function.Run(request, 9266, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.Null);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");
            mockLogger.AssertLog("Generated Cohort: (None)");
        }

        [Test]
        public async Task Run_ReturnsBadRequest_WhenParametersInvalid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticNeutral)}";
            query += "&leaderClassName=bard";
            query += "&leaderLevel=5";

            request = RequestHelper.BuildRequest(query);

            var result = await function.Run(request, 9266, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateCohortFunction.Run) processed a request.");
            mockLogger.AssertLog("Parameters are not a valid combination. Error: LeaderLevel is not valid. Should be 6 <= level <= 20", LogLevel.Error);
        }
    }
}