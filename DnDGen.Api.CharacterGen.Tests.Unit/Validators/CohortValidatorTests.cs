using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Validators
{
    public class CohortValidatorTests
    {
        private RequestHelper _requestHelper;

        [SetUp]
        public void Setup()
        {
            _requestHelper = new RequestHelper();
        }

        [Test]
        public void GetValid_ReturnsValid()
        {
            var query = $"?leaderAlignment={AlignmentConstants.LawfulGood}";
            query += "&leaderClassName=Paladin";
            query += "&leaderLevel=10";

            var req = _requestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.LawfulGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsValid_WithLeaderAlignment()
        {
            var query = $"?leaderAlignment={AlignmentConstants.ChaoticGood}";
            query += "&leaderClassName=Paladin";
            query += "&leaderLevel=10";

            var req = _requestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.ChaoticGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithLeaderAlignment()
        {
            var query = "?leaderAlignment=invalid alignment";
            query += "&leaderClassName=Paladin";
            query += "&leaderLevel=10";

            var req = _requestHelper.BuildRequest(query);

            var alignments = new[]
            {
                AlignmentConstants.LawfulGood,
                AlignmentConstants.LawfulNeutral,
                AlignmentConstants.LawfulEvil,
                AlignmentConstants.ChaoticGood,
                AlignmentConstants.ChaoticNeutral,
                AlignmentConstants.ChaoticEvil,
                AlignmentConstants.NeutralGood,
                AlignmentConstants.TrueNeutral,
                AlignmentConstants.NeutralEvil,
            };

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"LeaderAlignment is not valid. Should be one of: [{string.Join(", ", alignments)}]"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.Empty);
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithoutLeaderAlignment()
        {
            var query = $"?leaderClassName=Paladin";
            query += "&leaderLevel=10";

            var req = _requestHelper.BuildRequest(query);

            var alignments = new[]
            {
                AlignmentConstants.LawfulGood,
                AlignmentConstants.LawfulNeutral,
                AlignmentConstants.LawfulEvil,
                AlignmentConstants.ChaoticGood,
                AlignmentConstants.ChaoticNeutral,
                AlignmentConstants.ChaoticEvil,
                AlignmentConstants.NeutralGood,
                AlignmentConstants.TrueNeutral,
                AlignmentConstants.NeutralEvil,
            };

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"LeaderAlignment is not valid. Should be one of: [{string.Join(", ", alignments)}]"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.Empty);
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsValid_WithLeaderClassName()
        {
            var query = $"?leaderAlignment={AlignmentConstants.NeutralGood}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=10";

            var req = _requestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithLeaderClassName()
        {
            var query = $"?leaderAlignment={AlignmentConstants.NeutralGood}";
            query += "&leaderClassName=invalid";
            query += "&leaderLevel=10";

            var req = _requestHelper.BuildRequest(query);

            var classNames = new[]
            {
                CharacterClassConstants.Adept,
                CharacterClassConstants.Aristocrat,
                CharacterClassConstants.Barbarian,
                CharacterClassConstants.Bard,
                CharacterClassConstants.Cleric,
                CharacterClassConstants.Commoner,
                CharacterClassConstants.Druid,
                CharacterClassConstants.Expert,
                CharacterClassConstants.Fighter,
                CharacterClassConstants.Monk,
                CharacterClassConstants.Paladin,
                CharacterClassConstants.Ranger,
                CharacterClassConstants.Rogue,
                CharacterClassConstants.Sorcerer,
                CharacterClassConstants.Warrior,
                CharacterClassConstants.Wizard,
            };

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"LeaderClassName is not valid. Should be one of: [{string.Join(", ", classNames)}]"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.Empty);
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithoutLeaderClassName()
        {
            var query = $"?leaderAlignment={AlignmentConstants.NeutralGood}";
            query += "&leaderLevel=10";

            var req = _requestHelper.BuildRequest(query);

            var classNames = new[]
            {
                CharacterClassConstants.Adept,
                CharacterClassConstants.Aristocrat,
                CharacterClassConstants.Barbarian,
                CharacterClassConstants.Bard,
                CharacterClassConstants.Cleric,
                CharacterClassConstants.Commoner,
                CharacterClassConstants.Druid,
                CharacterClassConstants.Expert,
                CharacterClassConstants.Fighter,
                CharacterClassConstants.Monk,
                CharacterClassConstants.Paladin,
                CharacterClassConstants.Ranger,
                CharacterClassConstants.Rogue,
                CharacterClassConstants.Sorcerer,
                CharacterClassConstants.Warrior,
                CharacterClassConstants.Wizard,
            };

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"LeaderClassName is not valid. Should be one of: [{string.Join(", ", classNames)}]"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.Empty);
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsValid_WithLeaderLevel()
        {
            var query = $"?leaderAlignment={AlignmentConstants.NeutralGood}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=9";

            var req = _requestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(9));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithLeaderLevel_NotANumber()
        {
            var query = $"?leaderAlignment={AlignmentConstants.NeutralGood}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=invalid";

            var req = _requestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("LeaderLevel is not valid. Should be 6 <= level <= 20"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(0));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithLeaderLevel_OutOfRange()
        {
            var query = $"?leaderAlignment={AlignmentConstants.NeutralGood}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=3";

            var req = _requestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("LeaderLevel is not valid. Should be 6 <= level <= 20"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(3));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithoutLeaderLevel()
        {
            var query = $"?leaderAlignment={AlignmentConstants.NeutralGood}";
            query += "&leaderClassName=barbarian";

            var req = _requestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("LeaderLevel is not valid. Should be 6 <= level <= 20"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(0));
        }
    }
}
