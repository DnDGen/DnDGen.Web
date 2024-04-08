using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Leaders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Functions
{
    public class GenerateLeadershipFunctionTests
    {
        private GenerateLeadershipFunction function;
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

            function = new GenerateLeadershipFunction(mockDependencyFactory.Object);
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedLeadership_WithDefaults()
        {
            var leadership = new Leadership();
            leadership.Score = 90210;
            leadership.CohortScore = 42;
            leadership.LeadershipModifiers = new[] { "did a thing", "did a different thing" };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(9, 0, string.Empty))
                .Returns(leadership);

            var result = await function.Run(request, 9, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(leadership));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");
        }

        [TestCase(6)]
        [TestCase(7)]
        [TestCase(8)]
        [TestCase(9)]
        [TestCase(10)]
        [TestCase(20)]
        public async Task Run_ReturnsTheGeneratedLeadership_WithLeaderLevel(int leaderLevel)
        {
            var leadership = new Leadership();
            leadership.Score = 90210;
            leadership.CohortScore = 42;
            leadership.LeadershipModifiers = new[] { "did a thing", "did a different thing" };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(leaderLevel, 0, string.Empty))
                .Returns(leadership);

            var result = await function.Run(request, leaderLevel, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(leadership));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedLeadership_WithExplicitDefaults()
        {
            var query = "?leaderCharismaBonus=0";
            query += "&leaderAnimal=";

            request = RequestHelper.BuildRequest(query);

            var leadership = new Leadership();
            leadership.Score = 90210;
            leadership.CohortScore = 42;
            leadership.LeadershipModifiers = new[] { "did a thing", "did a different thing" };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(20, 0, string.Empty))
                .Returns(leadership);

            var result = await function.Run(request, 20, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(leadership));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");
        }

        [TestCase(-5)]
        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        [TestCase(10)]
        public async Task Run_ReturnsTheGeneratedLeadership_WithLeaderCharismaBonus(int charismaBonus)
        {
            var query = $"?leaderCharismaBonus={charismaBonus}";
            query += "&leaderAnimal=Elephant";

            request = RequestHelper.BuildRequest(query);

            var leadership = new Leadership();
            leadership.Score = 90210;
            leadership.CohortScore = 42;
            leadership.LeadershipModifiers = new[] { "did a thing", "did a different thing" };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(6, charismaBonus, "Elephant"))
                .Returns(leadership);

            var result = await function.Run(request, 6, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(leadership));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedLeadership_WithInvalidCharismaBonus()
        {
            var query = "?leaderCharismaBonus=invalid";
            query += $"&leaderAnimal=Elephant";

            request = RequestHelper.BuildRequest(query);

            var leadership = new Leadership();
            leadership.Score = 90210;
            leadership.CohortScore = 42;
            leadership.LeadershipModifiers = new[] { "did a thing", "did a different thing" };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(6, 0, "Elephant"))
                .Returns(leadership);

            var result = await function.Run(request, 6, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(leadership));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        [TestCase(5)]
        [TestCase(21)]
        [TestCase(9266)]
        public async Task Run_ReturnsBadRequest_WhenLeaderLevelInvalid(int leaderLevel)
        {
            var result = await function.Run(request, leaderLevel, mockLogger.Object);
            Assert.That(result, Is.InstanceOf<BadRequestResult>());

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Level {leaderLevel} is not in the valid range. Valid: 6 <= level <= 20", LogLevel.Error);
        }
    }
}