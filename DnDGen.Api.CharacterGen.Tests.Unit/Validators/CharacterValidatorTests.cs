using DnDGen.Api.CharacterGen.Models;
using DnDGen.Api.CharacterGen.Validators;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Validators
{
    public class CharacterValidatorTests
    {
        private RequestHelper _requestHelper;

        [SetUp]
        public void Setup()
        {
            _requestHelper = new RequestHelper();
        }

        [Test]
        public void GetValid_ReturnsValid_WithDefaults()
        {
            var req = _requestHelper.BuildRequest();

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?alignmentRandomizerType={AlignmentRandomizerTypeConstants.NonEvil}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?alignmentRandomizerType=set&setAlignment={AlignmentConstants.ChaoticGood}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?alignmentRandomizerType=invalid");

            var alignmentRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                AlignmentRandomizerTypeConstants.Any,
                AlignmentRandomizerTypeConstants.Chaotic,
                AlignmentRandomizerTypeConstants.Evil,
                AlignmentRandomizerTypeConstants.Good,
                AlignmentRandomizerTypeConstants.Lawful,
                AlignmentRandomizerTypeConstants.Neutral,
                AlignmentRandomizerTypeConstants.NonChaotic,
                AlignmentRandomizerTypeConstants.NonEvil,
                AlignmentRandomizerTypeConstants.NonGood,
                AlignmentRandomizerTypeConstants.NonLawful,
                AlignmentRandomizerTypeConstants.NonNeutral,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"AlignmentRandomizerType is not valid. Should be one of: [{string.Join(", ", alignmentRandomizers)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.Empty);
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
            var req = _requestHelper.BuildRequest("?alignmentRandomizerType=set&setAlignment=invalid alignment");

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

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"SetAlignment is not valid. Should be one of: [{string.Join(", ", alignments)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetAlignment, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?classNameRandomizerType={ClassNameRandomizerTypeConstants.PhysicalCombat}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?classNameRandomizerType=set&setClassName=paladin");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?classNameRandomizerType=invalid");

            var classNameRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                ClassNameRandomizerTypeConstants.AnyNPC,
                ClassNameRandomizerTypeConstants.AnyPlayer,
                ClassNameRandomizerTypeConstants.ArcaneSpellcaster,
                ClassNameRandomizerTypeConstants.DivineSpellcaster,
                ClassNameRandomizerTypeConstants.NonSpellcaster,
                ClassNameRandomizerTypeConstants.PhysicalCombat,
                ClassNameRandomizerTypeConstants.Spellcaster,
                ClassNameRandomizerTypeConstants.Stealth,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"ClassNameRandomizerType is not valid. Should be one of: [{string.Join(", ", classNameRandomizers)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.Empty);
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetClassName()
        {
            var req = _requestHelper.BuildRequest($"?classNameRandomizerType=set&setClassName=invalid");

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

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"SetClassName is not valid. Should be one of: [{string.Join(", ", classNames)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetClassName, Is.Empty);
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithLevelRandomizer()
        {
            var req = _requestHelper.BuildRequest($"?levelRandomizerType={LevelRandomizerTypeConstants.Medium}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?levelRandomizerType=set&setLevel=9");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?levelRandomizerType=invalid");

            var levelRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                LevelRandomizerTypeConstants.Any,
                LevelRandomizerTypeConstants.High,
                LevelRandomizerTypeConstants.Low,
                LevelRandomizerTypeConstants.Medium,
                LevelRandomizerTypeConstants.VeryHigh,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"LevelRandomizerType is not valid. Should be one of: [{string.Join(", ", levelRandomizers)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.Empty);
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetLevel_NotANumber()
        {
            var req = _requestHelper.BuildRequest($"?levelRandomizerType=set&setLevel=invalid");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetLevel is not valid. Should be 1 <= level <= 20"));
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
            var req = _requestHelper.BuildRequest($"?levelRandomizerType=set&setLevel=666");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetLevel is not valid. Should be 1 <= level <= 20"));
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
            var req = _requestHelper.BuildRequest($"?baseRaceRandomizerType={RaceRandomizerTypeConstants.BaseRace.StandardBase}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?baseRaceRandomizerType=set&setBaseRace=human");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?baseRaceRandomizerType=invalid");

            var baseRaceRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                RaceRandomizerTypeConstants.BaseRace.AnyBase,
                RaceRandomizerTypeConstants.BaseRace.AquaticBase,
                RaceRandomizerTypeConstants.BaseRace.MonsterBase,
                RaceRandomizerTypeConstants.BaseRace.NonMonsterBase,
                RaceRandomizerTypeConstants.BaseRace.NonStandardBase,
                RaceRandomizerTypeConstants.BaseRace.StandardBase,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"BaseRaceRandomizerType is not valid. Should be one of: [{string.Join(", ", baseRaceRandomizers)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.Empty);
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetBaseRace()
        {
            var req = _requestHelper.BuildRequest($"?baseRaceRandomizerType=set&setBaseRace=invalid");

            var baseRaces = new[]
            {
                RaceConstants.BaseRaces.Aasimar,
                RaceConstants.BaseRaces.AquaticElf,
                RaceConstants.BaseRaces.Azer,
                RaceConstants.BaseRaces.BlueSlaad,
                RaceConstants.BaseRaces.Bugbear,
                RaceConstants.BaseRaces.Centaur,
                RaceConstants.BaseRaces.CloudGiant,
                RaceConstants.BaseRaces.DeathSlaad,
                RaceConstants.BaseRaces.DeepDwarf,
                RaceConstants.BaseRaces.DeepHalfling,
                RaceConstants.BaseRaces.Derro,
                RaceConstants.BaseRaces.Doppelganger,
                RaceConstants.BaseRaces.Drow,
                RaceConstants.BaseRaces.DuergarDwarf,
                RaceConstants.BaseRaces.FireGiant,
                RaceConstants.BaseRaces.ForestGnome,
                RaceConstants.BaseRaces.FrostGiant,
                RaceConstants.BaseRaces.Gargoyle,
                RaceConstants.BaseRaces.Githyanki,
                RaceConstants.BaseRaces.Githzerai,
                RaceConstants.BaseRaces.Gnoll,
                RaceConstants.BaseRaces.Goblin,
                RaceConstants.BaseRaces.GrayElf,
                RaceConstants.BaseRaces.GraySlaad,
                RaceConstants.BaseRaces.GreenSlaad,
                RaceConstants.BaseRaces.Grimlock,
                RaceConstants.BaseRaces.HalfElf,
                RaceConstants.BaseRaces.HalfOrc,
                RaceConstants.BaseRaces.Harpy,
                RaceConstants.BaseRaces.HighElf,
                RaceConstants.BaseRaces.HillDwarf,
                RaceConstants.BaseRaces.HillGiant,
                RaceConstants.BaseRaces.Hobgoblin,
                RaceConstants.BaseRaces.HoundArchon,
                RaceConstants.BaseRaces.Human,
                RaceConstants.BaseRaces.Janni,
                RaceConstants.BaseRaces.Kapoacinth,
                RaceConstants.BaseRaces.Kobold,
                RaceConstants.BaseRaces.KuoToa,
                RaceConstants.BaseRaces.LightfootHalfling,
                RaceConstants.BaseRaces.Lizardfolk,
                RaceConstants.BaseRaces.Locathah,
                RaceConstants.BaseRaces.Merfolk,
                RaceConstants.BaseRaces.Merrow,
                RaceConstants.BaseRaces.MindFlayer,
                RaceConstants.BaseRaces.Minotaur,
                RaceConstants.BaseRaces.MountainDwarf,
                RaceConstants.BaseRaces.Mummy,
                RaceConstants.BaseRaces.Ogre,
                RaceConstants.BaseRaces.OgreMage,
                RaceConstants.BaseRaces.Orc,
                RaceConstants.BaseRaces.Pixie,
                RaceConstants.BaseRaces.Rakshasa,
                RaceConstants.BaseRaces.RedSlaad,
                RaceConstants.BaseRaces.RockGnome,
                RaceConstants.BaseRaces.Sahuagin,
                RaceConstants.BaseRaces.Satyr,
                RaceConstants.BaseRaces.Scorpionfolk,
                RaceConstants.BaseRaces.Scrag,
                RaceConstants.BaseRaces.StoneGiant,
                RaceConstants.BaseRaces.StormGiant,
                RaceConstants.BaseRaces.Svirfneblin,
                RaceConstants.BaseRaces.TallfellowHalfling,
                RaceConstants.BaseRaces.Tiefling,
                RaceConstants.BaseRaces.Troglodyte,
                RaceConstants.BaseRaces.Troll,
                RaceConstants.BaseRaces.WildElf,
                RaceConstants.BaseRaces.WoodElf,
                RaceConstants.BaseRaces.YuanTiAbomination,
                RaceConstants.BaseRaces.YuanTiHalfblood,
                RaceConstants.BaseRaces.YuanTiPureblood,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"SetBaseRace is not valid. Should be one of: [{string.Join(", ", baseRaces)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetBaseRace, Is.Empty);
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithMetaraceRandomizer()
        {
            var req = _requestHelper.BuildRequest($"?metaraceRandomizerType={RaceRandomizerTypeConstants.Metarace.GeneticMeta}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
        [TestCase("1", false)] //Even though 1 = true, "1" != true
        [TestCase("false", false)]
        [TestCase("FALSE", false)]
        [TestCase("0", false)]
        [TestCase("", false)]
        [TestCase("invalid", false)]
        public void GetValid_ReturnsValid_WithForceMetarace(string value, bool expected)
        {
            var query = $"?metaraceRandomizerType={RaceRandomizerTypeConstants.Metarace.GeneticMeta}";
            query += $"&forceMetarace={value}";

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?metaraceRandomizerType=set&setMetarace=lich");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?metaraceRandomizerType=set&setMetarace={RaceConstants.Metaraces.None}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            var req = _requestHelper.BuildRequest($"?metaraceRandomizerType=invalid");

            var metaraceRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                RaceRandomizerTypeConstants.Metarace.AnyMeta,
                RaceRandomizerTypeConstants.Metarace.GeneticMeta,
                RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,
                RaceRandomizerTypeConstants.Metarace.NoMeta,
                RaceRandomizerTypeConstants.Metarace.UndeadMeta,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"MetaraceRandomizerType is not valid. Should be one of: [{string.Join(", ", metaraceRandomizers)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.Empty);
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithSetMetarace()
        {
            var req = _requestHelper.BuildRequest($"?metaraceRandomizerType=set&setMetarace=invalid");

            var metaraces = new[]
            {
                RaceConstants.Metaraces.Ghost,
                RaceConstants.Metaraces.HalfCelestial,
                RaceConstants.Metaraces.HalfDragon,
                RaceConstants.Metaraces.HalfFiend,
                RaceConstants.Metaraces.Lich,
                RaceConstants.Metaraces.None,
                RaceConstants.Metaraces.Vampire,
                RaceConstants.Metaraces.Werebear,
                RaceConstants.Metaraces.Wereboar,
                RaceConstants.Metaraces.Wereboar_Dire,
                RaceConstants.Metaraces.Wererat,
                RaceConstants.Metaraces.Weretiger,
                RaceConstants.Metaraces.Werewolf,
                RaceConstants.Metaraces.Werewolf_Dire,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"SetMetarace is not valid. Should be one of: [{string.Join(", ", metaraces)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetMetarace, Is.EqualTo(CharacterSpecifications.InvalidMetarace));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void GetValid_ReturnsValid_WithAbilitiesRandomizer()
        {
            var req = _requestHelper.BuildRequest($"?abilitiesRandomizerType={AbilitiesRandomizerTypeConstants.OnesAsSixes}");

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.True);
            Assert.That(result.Error, Is.Empty);
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
        }

        [TestCase("true", true)]
        [TestCase("TRUE", true)]
        [TestCase("1", true)]
        [TestCase("false", false)]
        [TestCase("FALSE", false)]
        [TestCase("0", true)]
        [TestCase("", true)]
        [TestCase("invalid", true)]
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Error, Is.Empty);
            Assert.That(result.Valid, Is.True);
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.EqualTo(expected));
        }

        [Test]
        public void GetValid_ReturnsInvalid_WithAbilitiesRandomizer()
        {
            var req = _requestHelper.BuildRequest($"?abilitiesRandomizerType=invalid");

            var abilitiesRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                AbilitiesRandomizerTypeConstants.Average,
                AbilitiesRandomizerTypeConstants.BestOfFour,
                AbilitiesRandomizerTypeConstants.Good,
                AbilitiesRandomizerTypeConstants.Heroic,
                AbilitiesRandomizerTypeConstants.OnesAsSixes,
                AbilitiesRandomizerTypeConstants.Poor,
                AbilitiesRandomizerTypeConstants.Raw,
                AbilitiesRandomizerTypeConstants.TwoTenSidedDice,
            };

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo($"AbilitiesRandomizerType is not valid. Should be one of: [{string.Join(", ", abilitiesRandomizers)}]"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.Empty);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetStrength is not valid. Should be SetStrength > 0"));
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetStrength is not valid. Should be SetStrength > 0"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(90210));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetConstitution is not valid. Should be SetConstitution > 0"));
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetConstitution is not valid. Should be SetConstitution > 0"));
            Assert.That(result.CharacterSpecifications, Is.Not.Null);
            Assert.That(result.CharacterSpecifications.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
            Assert.That(result.CharacterSpecifications.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
            Assert.That(result.CharacterSpecifications.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
            Assert.That(result.CharacterSpecifications.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
            Assert.That(result.CharacterSpecifications.ForceMetarace, Is.False);
            Assert.That(result.CharacterSpecifications.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(result.CharacterSpecifications.SetStrength, Is.EqualTo(9266));
            Assert.That(result.CharacterSpecifications.SetConstitution, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(42));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetDexterity is not valid. Should be SetDexterity > 0"));
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetDexterity is not valid. Should be SetDexterity > 0"));
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
            Assert.That(result.CharacterSpecifications.SetDexterity, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(600));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetIntelligence is not valid. Should be SetIntelligence > 0"));
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetIntelligence is not valid. Should be SetIntelligence > 0"));
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
            Assert.That(result.CharacterSpecifications.SetIntelligence, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetWisdom is not valid. Should be SetWisdom > 0"));
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
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetWisdom is not valid. Should be SetWisdom > 0"));
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(1336));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetCharisma is not valid. Should be SetCharisma > 0"));
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(0));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
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

            var req = _requestHelper.BuildRequest(query);

            var result = CharacterValidator.GetValid(req);
            Assert.That(result.Valid, Is.False);
            Assert.That(result.Error, Is.EqualTo("SetCharisma is not valid. Should be SetCharisma > 0"));
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
            Assert.That(result.CharacterSpecifications.SetWisdom, Is.EqualTo(1337));
            Assert.That(result.CharacterSpecifications.SetCharisma, Is.EqualTo(-1));
            Assert.That(result.CharacterSpecifications.AllowAbilityAdjustments, Is.True);
        }
    }
}
