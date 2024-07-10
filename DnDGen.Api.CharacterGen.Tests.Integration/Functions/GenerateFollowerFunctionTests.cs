using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Integration.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Integration.Functions
{
    public class GenerateFollowerFunctionTests : IntegrationTests
    {
        private GenerateFollowerFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateFollowerFunction(loggerFactory, dependencyFactory);
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(6)]
        public async Task GenerateFollower_ReturnsFollower(int level)
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(level, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var follower = StreamHelper.Read<Character>(response.Body);
            Assert.That(follower, Is.Not.Null);
            Assert.That(follower.Summary, Is.Not.Empty);
            Assert.That(follower.Alignment.Full, Is.Not.Empty);
            Assert.That(follower.Class.Level, Is.AtLeast(1).And.EqualTo(level));
            Assert.That(follower.Class.Summary, Is.Not.Empty);
            Assert.That(follower.Race.Summary, Is.Not.Empty);
        }

        private string GetUrl(int level, string query = "")
        {
            var url = $"https://character.dndgen.com/api/v1/follower/level/{level}/generate";
            if (query.Any())
            {
                if (!query.StartsWith('?'))
                    url += "?";

                url += query;
            }

            return url;
        }

        [Test]
        public async Task GenerateFollower_ReturnsBadRequest_WhenLeaderAlignmentInvalid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode("Invalid Alignment")}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(1, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(AlignmentConstants.LawfulGood)]
        [TestCase(AlignmentConstants.LawfulNeutral)]
        [TestCase(AlignmentConstants.LawfulEvil)]
        [TestCase(AlignmentConstants.NeutralGood)]
        [TestCase(AlignmentConstants.TrueNeutral)]
        [TestCase(AlignmentConstants.NeutralEvil)]
        [TestCase(AlignmentConstants.ChaoticGood)]
        [TestCase(AlignmentConstants.ChaoticNeutral)]
        [TestCase(AlignmentConstants.ChaoticEvil)]
        public async Task GenerateFollower_ReturnsFollower_WithLeaderAlignment(string leaderAlignment)
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(leaderAlignment)}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(1, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var follower = StreamHelper.Read<Character>(response.Body);
            Assert.That(follower, Is.Not.Null);
            Assert.That(follower.Summary, Is.Not.Empty);
            Assert.That(follower.Alignment.Full, Is.Not.Empty);
            Assert.That(follower.Class.Level, Is.AtLeast(1));
            Assert.That(follower.Class.Summary, Is.Not.Empty);
            Assert.That(follower.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateFollower_ReturnsBadRequest_WhenLeaderClassNameInvalid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Invalid";

            var url = GetUrl(1, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(CharacterClassConstants.Adept)]
        [TestCase(CharacterClassConstants.Aristocrat)]
        [TestCase(CharacterClassConstants.Barbarian)]
        [TestCase(CharacterClassConstants.Bard)]
        [TestCase(CharacterClassConstants.Cleric)]
        [TestCase(CharacterClassConstants.Commoner)]
        [TestCase(CharacterClassConstants.Druid)]
        [TestCase(CharacterClassConstants.Expert)]
        [TestCase(CharacterClassConstants.Fighter)]
        [TestCase(CharacterClassConstants.Monk)]
        [TestCase(CharacterClassConstants.Paladin)]
        [TestCase(CharacterClassConstants.Ranger)]
        [TestCase(CharacterClassConstants.Rogue)]
        [TestCase(CharacterClassConstants.Sorcerer)]
        [TestCase(CharacterClassConstants.Warrior)]
        [TestCase(CharacterClassConstants.Wizard)]
        public async Task GenerateFollower_ReturnsCohort_WithLeaderClassName(string leaderClassName)
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += $"&leaderClassName={leaderClassName}";

            var url = GetUrl(1, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var follower = StreamHelper.Read<Character>(response.Body);
            Assert.That(follower, Is.Not.Null);
            Assert.That(follower.Summary, Is.Not.Empty);
            Assert.That(follower.Alignment.Full, Is.Not.Empty);
            Assert.That(follower.Class.Level, Is.AtLeast(1));
            Assert.That(follower.Class.Summary, Is.Not.Empty);
            Assert.That(follower.Race.Summary, Is.Not.Empty);
        }
    }
}