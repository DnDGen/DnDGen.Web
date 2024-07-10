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
    public class GenerateCohortFunctionTests : IntegrationTests
    {
        private GenerateCohortFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateCohortFunction(loggerFactory, dependencyFactory);
        }

        [TestCase(3, 2)]
        [TestCase(10, 7)]
        [TestCase(20, 14)]
        [TestCase(25, 17)]
        [TestCase(42, 17)]
        public async Task GenerateCohort_ReturnsCohort(int score, int expectedCohortLevel)
        {
            var query = "?leaderLevel=20";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(score, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, score);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var cohort = StreamHelper.Read<Character>(response.Body);
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1).And.EqualTo(expectedCohortLevel).Within(1));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
        }

        private string GetUrl(int cohortScore, string query = "")
        {
            var url = $"https://character.dndgen.com/api/v1/cohort/score/{cohortScore}/generate";
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
        public async Task GenerateCohort_ReturnsNull_WhenScoreInvalid(int score)
        {
            var query = "?leaderLevel=20";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(score, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, score);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.EqualTo("null"));
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
        public async Task GenerateCohort_ReturnsBadRequest_WhenLeaderLevelInvalid(int level)
        {
            var query = $"?leaderLevel={level}";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(10, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 10);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(6, 5)]
        [TestCase(10, 9)]
        [TestCase(20, 17)]
        public async Task GenerateCohort_ReturnsCohort_WithLeaderLevel(int leaderLevel, int expectedCohortLevel)
        {
            var query = $"?leaderLevel={leaderLevel}";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(25, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 25);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var cohort = StreamHelper.Read<Character>(response.Body);
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1).And.EqualTo(expectedCohortLevel).Within(1));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCohort_ReturnsBadRequest_WhenLeaderAlignmentInvalid()
        {
            var query = "?leaderLevel=20";
            query += $"&leaderAlignment={HttpUtility.UrlEncode("Invalid Alignment")}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(10, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 10);
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
        public async Task GenerateCohort_ReturnsCohort_WithLeaderAlignment(string leaderAlignment)
        {
            var query = "?leaderLevel=20";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(leaderAlignment)}";
            query += "&leaderClassName=Fighter";

            var url = GetUrl(25, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 25);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var cohort = StreamHelper.Read<Character>(response.Body);
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCohort_ReturnsBadRequest_WhenLeaderClassNameInvalid()
        {
            var query = "?leaderLevel=20";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Invalid";

            var url = GetUrl(10, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 10);
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
        public async Task GenerateCohort_ReturnsCohort_WithLeaderClassName(string leaderClassName)
        {
            var query = "?leaderLevel=20";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += $"&leaderClassName={leaderClassName}";

            var url = GetUrl(25, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, 25);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var cohort = StreamHelper.Read<Character>(response.Body);
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
        }

        [TestCase(27, 19, AlignmentConstants.ChaoticEvil, CharacterClassConstants.Barbarian)]
        public async Task BUG_GenerateCohort_WithoutError(int score, int leaderLevel, string leaderAlignment, string leaderClass)
        {
            var query = string.Empty;
            query += $"?leaderAlignment={HttpUtility.UrlEncode(leaderAlignment)}";
            query += $"&leaderClassName={leaderClass}";
            query += $"&leaderLevel={leaderLevel}";

            var url = GetUrl(score, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, score);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var cohort = StreamHelper.Read<Character>(response.Body);
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
        }
    }
}