using DnDGen.Api.CharacterGen.Models;
using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Validators
{
    public class CharacterValidatorTests
    {
        [Test]
        public void GetValid_ReturnsValid_WithDefaults()
        {
            var req = RequestHelper.BuildRequest();

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithAlignmentRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.NonEvil));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetAlignment()
        {
            var req = RequestHelper.BuildRequest($"?alignmentRandomizerType=set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.ChaoticGood)}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetAlignment, Is.EqualTo(AlignmentConstants.ChaoticGood));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithAlignmentRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?alignmentRandomizerType=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.Null);
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetAlignment()
        {
            var req = RequestHelper.BuildRequest($"?alignmentRandomizerType=set&setAlignment={HttpUtility.UrlEncode("invalid alignment")}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetAlignment, Is.Null);
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }
    }
}
