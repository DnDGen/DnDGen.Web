using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Validators
{
    public class CohortValidatorTests
    {
        [Test]
        public void GetValid_ReturnsValid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.LawfulGood)}";
            query += "&leaderClassName=Paladin";
            query += "&leaderLevel=10";

            var req = RequestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.LawfulGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsValid_WithLeaderAlignment()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticGood)}";
            query += "&leaderClassName=Paladin";
            query += "&leaderLevel=10";

            var req = RequestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.ChaoticGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetAlignment()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode("invalid alignment")}";
            query += "&leaderClassName=Paladin";
            query += "&leaderLevel=10";

            var req = RequestHelper.BuildRequest(query);

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
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.Null);
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetClassName()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=10";

            var req = RequestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetClassName()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=invalid";
            query += "&leaderLevel=10";

            var req = RequestHelper.BuildRequest(query);

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
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.Null);
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(10));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetLevel()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=9";

            var req = RequestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(9));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetLevel_NotANumber()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=invalid";

            var req = RequestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("LeaderLevel is not valid. Should be 6 <= level <= 20"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(0));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetLevel_OutOfRange()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=barbarian";
            query += "&leaderLevel=3";

            var req = RequestHelper.BuildRequest(query);

            var result = CohortValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("LeaderLevel is not valid. Should be 6 <= level <= 20"));
            Assert.That(result.CohortSpecifications, Is.Not.Null);
            Assert.That(result.CohortSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.CohortSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.CohortSpecifications.LeaderLevel, Is.EqualTo(3));
        }
    }
}
