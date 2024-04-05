﻿using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Validators
{
    public class FollowerValidatorTests
    {
        [Test]
        public void GetValid_ReturnsValid()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.LawfulGood)}";
            query += "&leaderClassName=Paladin";

            var req = RequestHelper.BuildRequest(query);

            var result = FollowerValidator.GetValid(1, req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.FollowerSpecifications, Is.Not.Null);
            Assert.That(result.FollowerSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.LawfulGood));
            Assert.That(result.FollowerSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.FollowerSpecifications.FollowerLevel, Is.EqualTo(1));
        }

        [Test]
        public void GetValid_ReturnsValid_WithLeaderAlignment()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticGood)}";
            query += "&leaderClassName=Paladin";

            var req = RequestHelper.BuildRequest(query);

            var result = FollowerValidator.GetValid(2, req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.FollowerSpecifications, Is.Not.Null);
            Assert.That(result.FollowerSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.ChaoticGood));
            Assert.That(result.FollowerSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.FollowerSpecifications.FollowerLevel, Is.EqualTo(2));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetAlignment()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode("invalid alignment")}";
            query += "&leaderClassName=Paladin";

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

            var result = FollowerValidator.GetValid(3, req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"LeaderAlignment is not valid. Should be one of: [{string.Join(", ", alignments)}]"));
            Assert.That(result.FollowerSpecifications, Is.Not.Null);
            Assert.That(result.FollowerSpecifications.LeaderAlignment, Is.Null);
            Assert.That(result.FollowerSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.FollowerSpecifications.FollowerLevel, Is.EqualTo(3));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetClassName()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=barbarian";

            var req = RequestHelper.BuildRequest(query);

            var result = FollowerValidator.GetValid(4, req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.FollowerSpecifications, Is.Not.Null);
            Assert.That(result.FollowerSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.FollowerSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.FollowerSpecifications.FollowerLevel, Is.EqualTo(4));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetClassName()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=invalid";

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

            var result = FollowerValidator.GetValid(5, req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"LeaderClassName is not valid. Should be one of: [{string.Join(", ", classNames)}]"));
            Assert.That(result.FollowerSpecifications, Is.Not.Null);
            Assert.That(result.FollowerSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.FollowerSpecifications.LeaderClassName, Is.Null);
            Assert.That(result.FollowerSpecifications.FollowerLevel, Is.EqualTo(5));
        }

        [Test]
        public void GetValid_ReturnsValid_WithFollowerLevel()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=barbarian";

            var req = RequestHelper.BuildRequest(query);

            var result = FollowerValidator.GetValid(6, req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.FollowerSpecifications, Is.Not.Null);
            Assert.That(result.FollowerSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.FollowerSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.FollowerSpecifications.FollowerLevel, Is.EqualTo(6));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithFollowerLevel_OutOfRange()
        {
            var query = $"?leaderAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += "&leaderClassName=barbarian";

            var req = RequestHelper.BuildRequest(query);

            var result = FollowerValidator.GetValid(7, req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("FollowerLevel is not valid. Should be 1 <= level <= 6"));
            Assert.That(result.FollowerSpecifications, Is.Not.Null);
            Assert.That(result.FollowerSpecifications.LeaderAlignment, Is.EqualTo(AlignmentConstants.NeutralGood));
            Assert.That(result.FollowerSpecifications.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(result.FollowerSpecifications.FollowerLevel, Is.EqualTo(7));
        }
    }
}
