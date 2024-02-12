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
    public class GenerateFollowerFunctionTests : IntegrationTests
    {
        private GenerateFollowerFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateFollowerFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
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

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, level, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var cohort = okResult.Value as Character;
            Assert.That(cohort, Is.Not.Null);
            Assert.That(cohort.Summary, Is.Not.Empty);
            Assert.That(cohort.Alignment.Full, Is.Not.Empty);
            Assert.That(cohort.Class.Level, Is.AtLeast(1).And.EqualTo(level));
            Assert.That(cohort.Class.Summary, Is.Not.Empty);
            Assert.That(cohort.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateFollower_ReturnsBadRequest_WhenLeaderAlignmentInvalid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode("Invalid Alignment")}";
            query += "&leaderClassName=Fighter";

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 1, logger);
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
        public async Task GenerateFollower_ReturnsFollower_WithLeaderAlignment(string leaderAlignment)
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(leaderAlignment)}";
            query += "&leaderClassName=Fighter";

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 1, logger);
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
        public async Task GenerateFollower_ReturnsBadRequest_WhenLeaderClassNameInvalid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += "&leaderClassName=Invalid";

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 1, logger);
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
        public async Task GenerateFollower_ReturnsCohort_WithLeaderClassName(string leaderClassName)
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            query += $"&leaderClassName={leaderClassName}";

            var request = RequestHelper.BuildRequest(query);
            var response = await function.Run(request, 1, logger);
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