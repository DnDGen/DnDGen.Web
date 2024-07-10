using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Integration.Helpers;
using DnDGen.CharacterGen.Leaders;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.CharacterGen.Tests.Integration.Functions
{
    public class GenerateLeadershipFunctionTests : IntegrationTests
    {
        private GenerateLeadershipFunction function;
        private const int sigma = 6;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateLeadershipFunction(loggerFactory, dependencyFactory);
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
            var url = GetUrl(level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var leadership = StreamHelper.Read<Leadership>(response.Body);
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

        private string GetUrl(int level, string query = "")
        {
            var url = $"https://character.dndgen.com/api/v1/leadership/level/{level}/generate";
            if (query.Any())
            {
                if (!query.StartsWith('?'))
                    url += "?";

                url += query;
            }

            return url;
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
            var url = GetUrl(level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
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
            var url = GetUrl(9, $"?leaderCharismaBonus={charismaBonus}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 9);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var leadership = StreamHelper.Read<Leadership>(response.Body);
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
            var url = GetUrl(9, "?leaderAnimal=Cat");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 9);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var leadership = StreamHelper.Read<Leadership>(response.Body);
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
            var url = GetUrl(20, "?leaderCharismaBonus=5&leaderAnimal=Grizzly+Bear");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 20);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var leadership = StreamHelper.Read<Leadership>(response.Body);
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