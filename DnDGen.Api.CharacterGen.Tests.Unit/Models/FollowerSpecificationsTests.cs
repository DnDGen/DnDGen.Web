using DnDGen.Api.CharacterGen.Models;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Models
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Structure",
    "NUnit1001:The individual arguments provided by a TestCaseAttribute must match the type of the corresponding parameter of the method",
    Justification = "NUnit doesn't like passing in null for string parameters")]
    public class FollowerSpecificationsTests
    {
        private FollowerSpecifications spec;

        [SetUp]
        public void Setup()
        {
            spec = new FollowerSpecifications();
        }

        [TestCase(AlignmentConstants.LawfulGood, AlignmentConstants.LawfulGood)]
        [TestCase("lawful good", AlignmentConstants.LawfulGood)]
        [TestCase("LAWFUL GOOD", AlignmentConstants.LawfulGood)]
        [TestCase(AlignmentConstants.LawfulNeutral, AlignmentConstants.LawfulNeutral)]
        [TestCase("lawful neutral", AlignmentConstants.LawfulNeutral)]
        [TestCase("LAWFUL NEUTRAL", AlignmentConstants.LawfulNeutral)]
        [TestCase(AlignmentConstants.LawfulEvil, AlignmentConstants.LawfulEvil)]
        [TestCase("lawful evil", AlignmentConstants.LawfulEvil)]
        [TestCase("LAWFUL EVIL", AlignmentConstants.LawfulEvil)]
        [TestCase(AlignmentConstants.NeutralGood, AlignmentConstants.NeutralGood)]
        [TestCase("neutral good", AlignmentConstants.NeutralGood)]
        [TestCase("NEUTRAL GOOD", AlignmentConstants.NeutralGood)]
        [TestCase(AlignmentConstants.TrueNeutral, AlignmentConstants.TrueNeutral)]
        [TestCase("true neutral", AlignmentConstants.TrueNeutral)]
        [TestCase("TRUE NEUTRAL", AlignmentConstants.TrueNeutral)]
        [TestCase(AlignmentConstants.NeutralEvil, AlignmentConstants.NeutralEvil)]
        [TestCase("neutral evil", AlignmentConstants.NeutralEvil)]
        [TestCase("NEUTRAL EVIL", AlignmentConstants.NeutralEvil)]
        [TestCase(AlignmentConstants.ChaoticGood, AlignmentConstants.ChaoticGood)]
        [TestCase("chaotic good", AlignmentConstants.ChaoticGood)]
        [TestCase("CHAOTIC GOOD", AlignmentConstants.ChaoticGood)]
        [TestCase(AlignmentConstants.ChaoticNeutral, AlignmentConstants.ChaoticNeutral)]
        [TestCase("chaotic neutral", AlignmentConstants.ChaoticNeutral)]
        [TestCase("CHAOTIC NEUTRAL", AlignmentConstants.ChaoticNeutral)]
        [TestCase(AlignmentConstants.ChaoticEvil, AlignmentConstants.ChaoticEvil)]
        [TestCase("chaotic evil", AlignmentConstants.ChaoticEvil)]
        [TestCase("CHAOTIC EVIL", AlignmentConstants.ChaoticEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.Any, null)]
        [TestCase("any", null)]
        [TestCase("ANY", null)]
        [TestCase(CharacterClassConstants.Fighter, null)]
        [TestCase("fighter", null)]
        [TestCase("FIGHTER", null)]
        [TestCase("Invalid", null)]
        [TestCase("invalid", null)]
        [TestCase("INVALID", null)]
        [TestCase("", null)]
        [TestCase(null, null)]
        public void SetAlignment_SetsLeaderAlignment(string input, string expected)
        {
            spec.SetAlignment(input);
            Assert.That(spec.LeaderAlignment, Is.EqualTo(expected));
        }

        [TestCase(CharacterClassConstants.Adept, CharacterClassConstants.Adept)]
        [TestCase("adept", CharacterClassConstants.Adept)]
        [TestCase("ADEPT", CharacterClassConstants.Adept)]
        [TestCase(CharacterClassConstants.Aristocrat, CharacterClassConstants.Aristocrat)]
        [TestCase("aristocrat", CharacterClassConstants.Aristocrat)]
        [TestCase("ARISTOCRAT", CharacterClassConstants.Aristocrat)]
        [TestCase(CharacterClassConstants.Barbarian, CharacterClassConstants.Barbarian)]
        [TestCase("barbarian", CharacterClassConstants.Barbarian)]
        [TestCase("BARBARIAN", CharacterClassConstants.Barbarian)]
        [TestCase(CharacterClassConstants.Bard, CharacterClassConstants.Bard)]
        [TestCase("bard", CharacterClassConstants.Bard)]
        [TestCase("BARD", CharacterClassConstants.Bard)]
        [TestCase(CharacterClassConstants.Cleric, CharacterClassConstants.Cleric)]
        [TestCase("cleric", CharacterClassConstants.Cleric)]
        [TestCase("CLERIC", CharacterClassConstants.Cleric)]
        [TestCase(CharacterClassConstants.Commoner, CharacterClassConstants.Commoner)]
        [TestCase("commoner", CharacterClassConstants.Commoner)]
        [TestCase("COMMONER", CharacterClassConstants.Commoner)]
        [TestCase(CharacterClassConstants.Druid, CharacterClassConstants.Druid)]
        [TestCase("druid", CharacterClassConstants.Druid)]
        [TestCase("DRUID", CharacterClassConstants.Druid)]
        [TestCase(CharacterClassConstants.Expert, CharacterClassConstants.Expert)]
        [TestCase("expert", CharacterClassConstants.Expert)]
        [TestCase("EXPERT", CharacterClassConstants.Expert)]
        [TestCase(CharacterClassConstants.Fighter, CharacterClassConstants.Fighter)]
        [TestCase("fighter", CharacterClassConstants.Fighter)]
        [TestCase("FIGHTER", CharacterClassConstants.Fighter)]
        [TestCase(CharacterClassConstants.Monk, CharacterClassConstants.Monk)]
        [TestCase("monk", CharacterClassConstants.Monk)]
        [TestCase("MONK", CharacterClassConstants.Monk)]
        [TestCase(CharacterClassConstants.Paladin, CharacterClassConstants.Paladin)]
        [TestCase("paladin", CharacterClassConstants.Paladin)]
        [TestCase("PALADIN", CharacterClassConstants.Paladin)]
        [TestCase(CharacterClassConstants.Ranger, CharacterClassConstants.Ranger)]
        [TestCase("ranger", CharacterClassConstants.Ranger)]
        [TestCase("RANGER", CharacterClassConstants.Ranger)]
        [TestCase(CharacterClassConstants.Rogue, CharacterClassConstants.Rogue)]
        [TestCase("rogue", CharacterClassConstants.Rogue)]
        [TestCase("ROGUE", CharacterClassConstants.Rogue)]
        [TestCase(CharacterClassConstants.Sorcerer, CharacterClassConstants.Sorcerer)]
        [TestCase("sorcerer", CharacterClassConstants.Sorcerer)]
        [TestCase("SORCERER", CharacterClassConstants.Sorcerer)]
        [TestCase(CharacterClassConstants.Warrior, CharacterClassConstants.Warrior)]
        [TestCase("warrior", CharacterClassConstants.Warrior)]
        [TestCase("WARRIOR", CharacterClassConstants.Warrior)]
        [TestCase(CharacterClassConstants.Wizard, CharacterClassConstants.Wizard)]
        [TestCase("wizard", CharacterClassConstants.Wizard)]
        [TestCase("WIZARD", CharacterClassConstants.Wizard)]
        [TestCase(ClassNameRandomizerTypeConstants.AnyPlayer, null)]
        [TestCase("any player", null)]
        [TestCase("ANY PLAYER", null)]
        [TestCase(AlignmentConstants.TrueNeutral, null)]
        [TestCase("true neutral", null)]
        [TestCase("TRUE NEUTRAL", null)]
        [TestCase("Invalid", null)]
        [TestCase("invalid", null)]
        [TestCase("INVALID", null)]
        [TestCase("", null)]
        [TestCase(null, null)]
        public void SetCLassName_SetsLeaderClassName(string input, string expected)
        {
            spec.SetClassName(input);
            Assert.That(spec.LeaderClassName, Is.EqualTo(expected));
        }

        [Test]
        public void IsValid_ReturnsValid_WithDefaults()
        {
            SetSpecDefaults();

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Null);
        }

        private void SetSpecDefaults()
        {
            spec.FollowerLevel = 1;
            spec.SetAlignment("true neutral");
            spec.SetClassName("fighter");
        }

        [Test]
        public void IsValid_ReturnsValid_WhenLeaderAlignmentSet()
        {
            SetSpecDefaults();

            spec.SetAlignment("lawful good");

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Null);
            Assert.That(spec.LeaderAlignment, Is.EqualTo(AlignmentConstants.LawfulGood));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenLeaderAlignmentNotSet()
        {
            SetSpecDefaults();

            spec.SetAlignment("invalid alignment");

            var valid = spec.IsValid();
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

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"LeaderAlignment is not valid. Should be one of: [{string.Join(", ", alignments)}]"));
            Assert.That(spec.LeaderAlignment, Is.Null);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenLeaderClassNameSet()
        {
            SetSpecDefaults();

            spec.SetClassName("barbarian");

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Null);
            Assert.That(spec.LeaderClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenLeaderClassNameNotSet()
        {
            SetSpecDefaults();

            spec.SetClassName("invalid");

            var valid = spec.IsValid();
            var classes = new[]
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

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"LeaderClassName is not valid. Should be one of: [{string.Join(", ", classes)}]"));
            Assert.That(spec.LeaderClassName, Is.Null);
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(6)]
        public void IsValid_ReturnsValid_WhenFollowerLevelValid(int level)
        {
            SetSpecDefaults();

            spec.FollowerLevel = level;

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Null);
            Assert.That(spec.FollowerLevel, Is.EqualTo(level));
        }

        [TestCase(-9266)]
        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(7)]
        [TestCase(10)]
        [TestCase(20)]
        [TestCase(90210)]
        public void IsValid_ReturnsInvalid_WhenLeaderLevelNotValid(int level)
        {
            SetSpecDefaults();

            spec.FollowerLevel = level;

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("FollowerLevel is not valid. Should be 1 <= level <= 6"));
            Assert.That(spec.FollowerLevel, Is.EqualTo(level));
        }
    }
}
