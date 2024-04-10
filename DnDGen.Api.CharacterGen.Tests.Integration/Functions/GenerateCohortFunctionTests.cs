using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Integration.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Integration.Functions
{
    public class GenerateCohortFunctionTests : IntegrationTests
    {
        private GenerateCohortFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateCohortFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, score, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var cohort = okResult.Value as Character;
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1).And.EqualTo(expectedCohortLevel).Within(1));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, score, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.Null);
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 10, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(6, 5)]
        [TestCase(10, 9)]
        [TestCase(20, 17)]
        public async Task GenerateCohort_ReturnsCohort_WithLeaderLevel(int leaderLevel, int expectedCohortLevel)
        {
            var query = $"?leaderLevel={leaderLevel}";
            query += $"&leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Fighter";

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 25, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var cohort = okResult.Value as Character;
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 10, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 25, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var cohort = okResult.Value as Character;
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 10, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 25, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var cohort = okResult.Value as Character;
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, score, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var cohort = okResult.Value as Character;
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
        }
    }
}