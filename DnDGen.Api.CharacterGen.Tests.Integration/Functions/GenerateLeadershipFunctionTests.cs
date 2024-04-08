using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Integration.Helpers;
using DnDGen.CharacterGen.Leaders;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DnDGen.Api.CharacterGen.Tests.Integration.Functions
{
    public class GenerateLeadershipFunctionTests : IntegrationTests
    {
        private GenerateLeadershipFunction function;
        private ILogger logger;
        private const int sigma = 6;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateLeadershipFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [TestCase(6)]
        [TestCase(7)]
        [TestCase(8)]
        [TestCase(9)]
        [TestCase(10)]
        [TestCase(11)]
        [TestCase(12)]
        [TestCase(13)]
        [TestCase(14)]
        [TestCase(15)]
        [TestCase(16)]
        [TestCase(17)]
        [TestCase(18)]
        [TestCase(19)]
        [TestCase(20)]
        public async Task GenerateLeadership_ReturnsLeadership(int level)
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, level, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Leadership>());

            var leadership = okResult.Value as Leadership;
            Assert.That(leadership, Is.Not.Null);
            Assert.That(leadership.Score, Is.EqualTo(level).Within(sigma));
            Assert.That(leadership.CohortScore, Is.EqualTo(level).Within(sigma));
            Assert.That(leadership.LeadershipModifiers, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities.Level1, Is.Not.Negative);
            Assert.That(leadership.FollowerQuantities.Level2, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level1));
            Assert.That(leadership.FollowerQuantities.Level3, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level2));
            Assert.That(leadership.FollowerQuantities.Level4, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level3));
            Assert.That(leadership.FollowerQuantities.Level5, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level4));
            Assert.That(leadership.FollowerQuantities.Level6, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level5));
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(21)]
        [TestCase(22)]
        public async Task GenerateLeadership_ReturnsBadRequest_WhenLevelInvalid(int level)
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, level, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-5)]
        [TestCase(-4)]
        [TestCase(-3)]
        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(42)]
        public async Task GenerateLeadership_ReturnsLeadership_WithCharismaModifier(int charismaBonus)
        {
            var request = RequestHelper.BuildRequest($"?leaderCharismaBonus={charismaBonus}");
            var response = await function.Run(request, 9, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Leadership>());

            var leadership = okResult.Value as Leadership;
            Assert.That(leadership, Is.Not.Null);
            Assert.That(leadership.Score, Is.EqualTo(9 + charismaBonus).Within(sigma));
            Assert.That(leadership.CohortScore, Is.EqualTo(9 + charismaBonus).Within(sigma));
            Assert.That(leadership.LeadershipModifiers, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities.Level1, Is.Not.Negative);
            Assert.That(leadership.FollowerQuantities.Level2, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level1));
            Assert.That(leadership.FollowerQuantities.Level3, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level2));
            Assert.That(leadership.FollowerQuantities.Level4, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level3));
            Assert.That(leadership.FollowerQuantities.Level5, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level4));
            Assert.That(leadership.FollowerQuantities.Level6, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level5));
        }

        [Test]
        public async Task GenerateLeadership_ReturnsLeadership_WithAnimal()
        {
            var request = RequestHelper.BuildRequest($"?leaderAnimal=Cat");
            var response = await function.Run(request, 9, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Leadership>());

            var leadership = okResult.Value as Leadership;
            Assert.That(leadership, Is.Not.Null);
            Assert.That(leadership.Score, Is.EqualTo(9).Within(sigma));
            Assert.That(leadership.CohortScore, Is.EqualTo(9).Within(sigma));
            Assert.That(leadership.LeadershipModifiers, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities.Level1, Is.Not.Negative);
            Assert.That(leadership.FollowerQuantities.Level2, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level1));
            Assert.That(leadership.FollowerQuantities.Level3, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level2));
            Assert.That(leadership.FollowerQuantities.Level4, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level3));
            Assert.That(leadership.FollowerQuantities.Level5, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level4));
            Assert.That(leadership.FollowerQuantities.Level6, Is.Not.Negative.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level5));
        }

        [Test]
        public async Task GenerateLeadership_ReturnsLeadership_WithAllParameters()
        {
            var request = RequestHelper.BuildRequest($"?leaderCharismaBonus=5&leaderAnimal=Grizzly+Bear");
            var response = await function.Run(request, 20, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Leadership>());

            var leadership = okResult.Value as Leadership;
            Assert.That(leadership, Is.Not.Null);
            Assert.That(leadership.Score, Is.EqualTo(24).Within(sigma));
            Assert.That(leadership.CohortScore, Is.EqualTo(24).Within(sigma));
            Assert.That(leadership.LeadershipModifiers, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities, Is.Not.Null);
            Assert.That(leadership.FollowerQuantities.Level1, Is.Not.Negative);
            Assert.That(leadership.FollowerQuantities.Level2, Is.Positive.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level1));
            Assert.That(leadership.FollowerQuantities.Level3, Is.Positive.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level2));
            Assert.That(leadership.FollowerQuantities.Level4, Is.Positive.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level3));
            Assert.That(leadership.FollowerQuantities.Level5, Is.Positive.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level4));
            Assert.That(leadership.FollowerQuantities.Level6, Is.Positive.And.LessThanOrEqualTo(leadership.FollowerQuantities.Level5));
        }
    }
}