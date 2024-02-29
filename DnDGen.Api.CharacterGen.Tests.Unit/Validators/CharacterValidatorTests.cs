using DnDGen.Api.CharacterGen.Models;
using DnDGen.Api.CharacterGen.Tests.Unit.Helpers;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Races;
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

        [Test]
        public void GetValid_ReturnsValid_WithClassNameRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.PhysicalCombat)}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.PhysicalCombat));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetClassName()
        {
            var req = RequestHelper.BuildRequest($"?classNameRandomizerType=set&setAlignment=paladin");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetClassName, Is.EqualTo(CharacterClassConstants.Paladin));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithClassNameRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?classNameRandomizerType=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.Null);
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetClassName()
        {
            var req = RequestHelper.BuildRequest($"?classNameRandomizerType=set&setClassName=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetClassName, Is.Null);
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithLevelRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Medium)}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Medium));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetLevel()
        {
            var req = RequestHelper.BuildRequest($"?levelRandomizerType=set&setLevel=9");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(9));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithLevelRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?levelRandomizerType=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.Null);
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetLevel_NotANumber()
        {
            var req = RequestHelper.BuildRequest($"?levelRandomizerType=set&setLevel=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.Zero);
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetLevel_OutOfRange()
        {
            var req = RequestHelper.BuildRequest($"?levelRandomizerType=set&setLevel=666");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(666));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithBaseRaceRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.StandardBase)}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.StandardBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetBaseRace()
        {
            var req = RequestHelper.BuildRequest($"?baseRaceRandomizerType=set&setBaseRace=human");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetBaseRace, Is.EqualTo(RaceConstants.BaseRaces.Human));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithBaseRaceRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?baseRaceRandomizerType=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.Null);
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetBaseRace()
        {
            var req = RequestHelper.BuildRequest($"?baseRaceRandomizerType=set&setBaseRace=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetBaseRace, Is.Null);
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithMetaraceRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.GeneticMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [TestCase("true", true)]
        [TestCase("TRUE", true)]
        [TestCase("1", true)]
        [TestCase("false", false)]
        [TestCase("FALSE", false)]
        [TestCase("0", false)]
        [TestCase("", false)]
        public void GetValid_ReturnsValid_WithForceMetarace(string value, bool expected)
        {
            var query = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}";
            query += $"&forceMetarace={value}";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.GeneticMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.EqualTo(expected));
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetMetarace()
        {
            var req = RequestHelper.BuildRequest($"?metaraceRandomizerType=set&setMetarace=lich");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetMetarace, Is.EqualTo(RaceConstants.Metaraces.Lich));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetMetarace_None()
        {
            var req = RequestHelper.BuildRequest($"?metaraceRandomizerType=set&setMetarace={RaceConstants.Metaraces.None}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetMetarace, Is.EqualTo(RaceConstants.Metaraces.None));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithMetaraceRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?metaraceRandomizerType=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.Null);
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [TestCase("invalid")]
        [TestCase("2")]
        [TestCase("-1")]
        public void GetValid_ReturnsInvalid_WithForceMetarace(string value)
        {
            var query = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}";
            query += $"&forceMetarace={value}";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("forceMetarace must be true or false"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.GeneticMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetMetarace()
        {
            var req = RequestHelper.BuildRequest($"?metaraceRandomizerType=set&setMetarace=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetMetarace, Is.Null);
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithAbilitiesRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?abilitiesRandomizerType={HttpUtility.UrlEncode(AbilitiesRandomizerTypeConstants.OnesAsSixes)}");

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
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.OnesAsSixes));
        }

        [Test]
        public void GetValid_ReturnsValid_WithSetAbilities()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

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
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [TestCase("true", true)]
        [TestCase("TRUE", true)]
        [TestCase("1", true)]
        [TestCase("false", false)]
        [TestCase("FALSE", false)]
        [TestCase("0", false)]
        [TestCase("", false)]
        public void GetValid_ReturnsValid_WithAllowAbilityAdjustments(string value, bool expected)
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";
            query += $"&allowAbilityAdjustments={value}";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Null);
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.GeneticMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.EqualTo(expected));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithAbilitiesRandomizer()
        {
            var req = RequestHelper.BuildRequest($"?abilitiesRandomizerType=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.Null);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetStrength_NotANumber()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=invalid";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(0));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetStrength_OutOfRange()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=-1";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(666));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetConstitution_NotANumber()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=invalid";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(0));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetConstitution_OutOfRange()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=-1";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(666));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetDexterity_NotANumber()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=invalid";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(0));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetDexterity_OutOfRange()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=-1";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(666));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetIntelligence_NotANumber()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=invalid";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(0));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetIntelligence_OutOfRange()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=-1";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(666));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetWisdom_NotANumber()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=invalid";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(0));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetWisdom_OutOfRange()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=-1";
            query += $"&setCharisma=1336";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(666));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetCharisma_NotANumber()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=invalid";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(0));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetCharisma_OutOfRange()
        {
            var query = $"?abilitiesRandomizerType=set";
            query += $"&setStrength=9266";
            query += $"&setConstitution=90210";
            query += $"&setDexterity=42";
            query += $"&setIntelligence=600";
            query += $"&setWisdom=1337";
            query += $"&setCharisma=-1";

            var req = RequestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("stuff"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetLevel, Is.EqualTo(666));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.False);
        }

        [Test]
        public void NeedMoreTests()
        {
            Assert.Fail("Copy to cohort validator tests");
            Assert.Fail("Copy to follower validator tests");
            Assert.Fail("Make functions tests");
        }
    }
}
