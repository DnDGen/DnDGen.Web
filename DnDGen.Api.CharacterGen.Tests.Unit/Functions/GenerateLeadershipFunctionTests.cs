using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Leaders;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Functions
{
    public class GenerateLeadershipFunctionTests
    {
        private GenerateLeadershipFunction function;
        private Mock<ILeadershipGenerator> mockLeadershipGenerator;
        private Mock<ILogger<GenerateLeadershipFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLeadershipGenerator = new Mock<ILeadershipGenerator>();
            mockLogger = new Mock<ILogger<GenerateLeadershipFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.CharacterGen.Functions.GenerateLeadershipFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<ILeadershipGenerator>()).Returns(mockLeadershipGenerator.Object);

            function = new GenerateLeadershipFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedLeadership_WithDefaults()
        {
            var leadership = new Leadership
            {
                Score = 90210,
                CohortScore = 42,
                LeadershipModifiers = ["did a thing", "did a different thing"]
            };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(9, 0, string.Empty))
                .Returns(leadership);

            var request = requestHelper.BuildRequest();

            var response = await function.Run(request, 9);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseLeadership = StreamHelper.Read<Leadership>(response.Body);
            Assert.That(responseLeadership, Is.Not.Null);
            Assert.That(responseLeadership.Score, Is.EqualTo(leadership.Score));
            Assert.That(responseLeadership.CohortScore, Is.EqualTo(leadership.CohortScore));
            Assert.That(responseLeadership.LeadershipModifiers, Is.EqualTo(leadership.LeadershipModifiers));

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
            var leadership = new Leadership
            {
                Score = 90210,
                CohortScore = 42,
                LeadershipModifiers = ["did a thing", "did a different thing"]
            };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(leaderLevel, 0, string.Empty))
                .Returns(leadership);

            var request = requestHelper.BuildRequest();

            var response = await function.Run(request, leaderLevel);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseLeadership = StreamHelper.Read<Leadership>(response.Body);
            Assert.That(responseLeadership, Is.Not.Null);
            Assert.That(responseLeadership.Score, Is.EqualTo(leadership.Score));
            Assert.That(responseLeadership.CohortScore, Is.EqualTo(leadership.CohortScore));
            Assert.That(responseLeadership.LeadershipModifiers, Is.EqualTo(leadership.LeadershipModifiers));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedLeadership_WithExplicitDefaults()
        {
            var query = "?leaderCharismaBonus=0";
            query += "&leaderAnimal=";

            var request = requestHelper.BuildRequest(query);

            var leadership = new Leadership
            {
                Score = 90210,
                CohortScore = 42,
                LeadershipModifiers = ["did a thing", "did a different thing"]
            };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(20, 0, string.Empty))
                .Returns(leadership);

            var response = await function.Run(request, 20);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseLeadership = StreamHelper.Read<Leadership>(response.Body);
            Assert.That(responseLeadership, Is.Not.Null);
            Assert.That(responseLeadership.Score, Is.EqualTo(leadership.Score));
            Assert.That(responseLeadership.CohortScore, Is.EqualTo(leadership.CohortScore));
            Assert.That(responseLeadership.LeadershipModifiers, Is.EqualTo(leadership.LeadershipModifiers));

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

            var request = requestHelper.BuildRequest(query);

            var leadership = new Leadership
            {
                Score = 90210,
                CohortScore = 42,
                LeadershipModifiers = ["did a thing", "did a different thing"]
            };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(6, charismaBonus, "Elephant"))
                .Returns(leadership);

            var response = await function.Run(request, 6);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseLeadership = StreamHelper.Read<Leadership>(response.Body);
            Assert.That(responseLeadership, Is.Not.Null);
            Assert.That(responseLeadership.Score, Is.EqualTo(leadership.Score));
            Assert.That(responseLeadership.CohortScore, Is.EqualTo(leadership.CohortScore));
            Assert.That(responseLeadership.LeadershipModifiers, Is.EqualTo(leadership.LeadershipModifiers));

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Generated Leadership: Score - {leadership.Score}; Modifiers - {string.Join(", ", leadership.LeadershipModifiers)}");
        }

        [Test]
        public async Task Run_ReturnsTheGeneratedLeadership_WithInvalidCharismaBonus()
        {
            var query = "?leaderCharismaBonus=invalid";
            query += $"&leaderAnimal=Elephant";

            var request = requestHelper.BuildRequest(query);

            var leadership = new Leadership
            {
                Score = 90210,
                CohortScore = 42,
                LeadershipModifiers = ["did a thing", "did a different thing"]
            };

            mockLeadershipGenerator
                .Setup(g => g.GenerateLeadership(6, 0, "Elephant"))
                .Returns(leadership);

            var response = await function.Run(request, 6);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseLeadership = StreamHelper.Read<Leadership>(response.Body);
            Assert.That(responseLeadership, Is.Not.Null);
            Assert.That(responseLeadership.Score, Is.EqualTo(leadership.Score));
            Assert.That(responseLeadership.CohortScore, Is.EqualTo(leadership.CohortScore));
            Assert.That(responseLeadership.LeadershipModifiers, Is.EqualTo(leadership.LeadershipModifiers));

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
            var request = requestHelper.BuildRequest();

            var response = await function.Run(request, leaderLevel);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);

            mockLogger.AssertLog("C# HTTP trigger function (GenerateLeadershipFunction.Run) processed a request.");
            mockLogger.AssertLog($"Level {leaderLevel} is not in the valid range. Valid: 6 <= level <= 20", LogLevel.Error);
        }
    }
}