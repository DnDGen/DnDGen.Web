using DnDGen.Api.CharacterGen.Models;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using System.Collections;

namespace DnDGen.Api.CharacterGen.Tests.Unit.Models
{
    public class CharacterSpecificationsTests
    {
        private CharacterSpecifications spec;

        [SetUp]
        public void Setup()
        {
            spec = new CharacterSpecifications();
        }

        [TestCase(RandomizerTypeConstants.Set, RandomizerTypeConstants.Set)]
        [TestCase("set", RandomizerTypeConstants.Set)]
        [TestCase("SET", RandomizerTypeConstants.Set)]
        [TestCase(AlignmentRandomizerTypeConstants.Any, AlignmentRandomizerTypeConstants.Any)]
        [TestCase("any", AlignmentRandomizerTypeConstants.Any)]
        [TestCase("ANY", AlignmentRandomizerTypeConstants.Any)]
        [TestCase(AlignmentRandomizerTypeConstants.Chaotic, AlignmentRandomizerTypeConstants.Chaotic)]
        [TestCase("chaotic", AlignmentRandomizerTypeConstants.Chaotic)]
        [TestCase("CHAOTIC", AlignmentRandomizerTypeConstants.Chaotic)]
        [TestCase(AlignmentRandomizerTypeConstants.Evil, AlignmentRandomizerTypeConstants.Evil)]
        [TestCase("evil", AlignmentRandomizerTypeConstants.Evil)]
        [TestCase("EVIL", AlignmentRandomizerTypeConstants.Evil)]
        [TestCase(AlignmentRandomizerTypeConstants.Good, AlignmentRandomizerTypeConstants.Good)]
        [TestCase("good", AlignmentRandomizerTypeConstants.Good)]
        [TestCase("GOOD", AlignmentRandomizerTypeConstants.Good)]
        [TestCase(AlignmentRandomizerTypeConstants.Lawful, AlignmentRandomizerTypeConstants.Lawful)]
        [TestCase("lawful", AlignmentRandomizerTypeConstants.Lawful)]
        [TestCase("LAWFUL", AlignmentRandomizerTypeConstants.Lawful)]
        [TestCase(AlignmentRandomizerTypeConstants.Neutral, AlignmentRandomizerTypeConstants.Neutral)]
        [TestCase("neutral", AlignmentRandomizerTypeConstants.Neutral)]
        [TestCase("NEUTRAL", AlignmentRandomizerTypeConstants.Neutral)]
        [TestCase(AlignmentRandomizerTypeConstants.NonChaotic, AlignmentRandomizerTypeConstants.NonChaotic)]
        [TestCase("non-chaotic", AlignmentRandomizerTypeConstants.NonChaotic)]
        [TestCase("NON-CHAOTIC", AlignmentRandomizerTypeConstants.NonChaotic)]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil, AlignmentRandomizerTypeConstants.NonEvil)]
        [TestCase("non-evil", AlignmentRandomizerTypeConstants.NonEvil)]
        [TestCase("NON-EVIL", AlignmentRandomizerTypeConstants.NonEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.NonGood, AlignmentRandomizerTypeConstants.NonGood)]
        [TestCase("non-good", AlignmentRandomizerTypeConstants.NonGood)]
        [TestCase("NON-GOOD", AlignmentRandomizerTypeConstants.NonGood)]
        [TestCase(AlignmentRandomizerTypeConstants.NonLawful, AlignmentRandomizerTypeConstants.NonLawful)]
        [TestCase("non-lawful", AlignmentRandomizerTypeConstants.NonLawful)]
        [TestCase("NON-LAWFUL", AlignmentRandomizerTypeConstants.NonLawful)]
        [TestCase(AlignmentRandomizerTypeConstants.NonNeutral, AlignmentRandomizerTypeConstants.NonNeutral)]
        [TestCase("non-neutral", AlignmentRandomizerTypeConstants.NonNeutral)]
        [TestCase("NON-NEUTRAL", AlignmentRandomizerTypeConstants.NonNeutral)]
        [TestCase(AlignmentConstants.NeutralGood, "")]
        [TestCase("neutral good", "")]
        [TestCase("NEUTRAL GOOD", "")]
        [TestCase(ClassNameRandomizerTypeConstants.Stealth, "")]
        [TestCase("stealth", "")]
        [TestCase("STEALTH", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetAlignmentRandomizer_SetsRandomizerType(string input, string expected)
        {
            spec.SetAlignmentRandomizer(input, string.Empty);
            Assert.That(spec.AlignmentRandomizerType, Is.EqualTo(expected));
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
        [TestCase(AlignmentRandomizerTypeConstants.Any, "")]
        [TestCase("any", "")]
        [TestCase("ANY", "")]
        [TestCase(CharacterClassConstants.Fighter, "")]
        [TestCase("fighter", "")]
        [TestCase("FIGHTER", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetAlignmentRandomizer_SetsSetAlignment(string input, string expected)
        {
            spec.SetAlignmentRandomizer("set", input);
            Assert.That(spec.SetAlignment, Is.EqualTo(expected));
        }

        [TestCase(RandomizerTypeConstants.Set, RandomizerTypeConstants.Set)]
        [TestCase("set", RandomizerTypeConstants.Set)]
        [TestCase("SET", RandomizerTypeConstants.Set)]
        [TestCase(ClassNameRandomizerTypeConstants.AnyPlayer, ClassNameRandomizerTypeConstants.AnyPlayer)]
        [TestCase("any player", ClassNameRandomizerTypeConstants.AnyPlayer)]
        [TestCase("ANY PLAYER", ClassNameRandomizerTypeConstants.AnyPlayer)]
        [TestCase(ClassNameRandomizerTypeConstants.AnyNPC, ClassNameRandomizerTypeConstants.AnyNPC)]
        [TestCase("any npc", ClassNameRandomizerTypeConstants.AnyNPC)]
        [TestCase("ANY NPC", ClassNameRandomizerTypeConstants.AnyNPC)]
        [TestCase(ClassNameRandomizerTypeConstants.ArcaneSpellcaster, ClassNameRandomizerTypeConstants.ArcaneSpellcaster)]
        [TestCase("arcane spellcaster", ClassNameRandomizerTypeConstants.ArcaneSpellcaster)]
        [TestCase("ARCANE SPELLCASTER", ClassNameRandomizerTypeConstants.ArcaneSpellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.DivineSpellcaster, ClassNameRandomizerTypeConstants.DivineSpellcaster)]
        [TestCase("divine spellcaster", ClassNameRandomizerTypeConstants.DivineSpellcaster)]
        [TestCase("DIVINE SPELLCASTER", ClassNameRandomizerTypeConstants.DivineSpellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.NonSpellcaster, ClassNameRandomizerTypeConstants.NonSpellcaster)]
        [TestCase("non-spellcaster", ClassNameRandomizerTypeConstants.NonSpellcaster)]
        [TestCase("NON-SPELLCASTER", ClassNameRandomizerTypeConstants.NonSpellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.PhysicalCombat, ClassNameRandomizerTypeConstants.PhysicalCombat)]
        [TestCase("physical combat", ClassNameRandomizerTypeConstants.PhysicalCombat)]
        [TestCase("PHYSICAL COMBAT", ClassNameRandomizerTypeConstants.PhysicalCombat)]
        [TestCase(ClassNameRandomizerTypeConstants.Spellcaster, ClassNameRandomizerTypeConstants.Spellcaster)]
        [TestCase("spellcaster", ClassNameRandomizerTypeConstants.Spellcaster)]
        [TestCase("SPELLCASTER", ClassNameRandomizerTypeConstants.Spellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.Stealth, ClassNameRandomizerTypeConstants.Stealth)]
        [TestCase("stealth", ClassNameRandomizerTypeConstants.Stealth)]
        [TestCase("STEALTH", ClassNameRandomizerTypeConstants.Stealth)]
        [TestCase(CharacterClassConstants.Fighter, "")]
        [TestCase("fighter", "")]
        [TestCase("FIGHTER", "")]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil, "")]
        [TestCase("non-evil", "")]
        [TestCase("NON-EVIL", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetClassNameRandomizer_SetsRandomizerType(string input, string expected)
        {
            spec.SetClassNameRandomizer(input, string.Empty);
            Assert.That(spec.ClassNameRandomizerType, Is.EqualTo(expected));
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
        [TestCase(ClassNameRandomizerTypeConstants.AnyPlayer, "")]
        [TestCase("any player", "")]
        [TestCase("ANY PLAYER", "")]
        [TestCase(AlignmentConstants.TrueNeutral, "")]
        [TestCase("true neutral", "")]
        [TestCase("TRUE NEUTRAL", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetClassNameRandomizer_SetsSetClassName(string input, string expected)
        {
            spec.SetClassNameRandomizer("set", input);
            Assert.That(spec.SetClassName, Is.EqualTo(expected));
        }

        [TestCase(RandomizerTypeConstants.Set, RandomizerTypeConstants.Set)]
        [TestCase("set", RandomizerTypeConstants.Set)]
        [TestCase("SET", RandomizerTypeConstants.Set)]
        [TestCase(LevelRandomizerTypeConstants.Any, LevelRandomizerTypeConstants.Any)]
        [TestCase("any", LevelRandomizerTypeConstants.Any)]
        [TestCase("ANY", LevelRandomizerTypeConstants.Any)]
        [TestCase(LevelRandomizerTypeConstants.Low, LevelRandomizerTypeConstants.Low)]
        [TestCase("low", LevelRandomizerTypeConstants.Low)]
        [TestCase("LOW", LevelRandomizerTypeConstants.Low)]
        [TestCase(LevelRandomizerTypeConstants.Medium, LevelRandomizerTypeConstants.Medium)]
        [TestCase("medium", LevelRandomizerTypeConstants.Medium)]
        [TestCase("MEDIUM", LevelRandomizerTypeConstants.Medium)]
        [TestCase(LevelRandomizerTypeConstants.High, LevelRandomizerTypeConstants.High)]
        [TestCase("high", LevelRandomizerTypeConstants.High)]
        [TestCase("HIGH", LevelRandomizerTypeConstants.High)]
        [TestCase(LevelRandomizerTypeConstants.VeryHigh, LevelRandomizerTypeConstants.VeryHigh)]
        [TestCase("very high", LevelRandomizerTypeConstants.VeryHigh)]
        [TestCase("VERY HIGH", LevelRandomizerTypeConstants.VeryHigh)]
        [TestCase("1", "")]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil, "")]
        [TestCase("non-evil", "")]
        [TestCase("NON-EVIL", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetLevelRandomizer_SetsRandomizerType(string input, string expected)
        {
            spec.SetLevelRandomizer(input, 0);
            Assert.That(spec.LevelRandomizerType, Is.EqualTo(expected));
        }

        [TestCaseSource(nameof(SetNumberTestCases))]
        public void SetLevelRandomizer_SetsSetLevel(int input)
        {
            spec.SetLevelRandomizer("set", input);
            Assert.That(spec.SetLevel, Is.EqualTo(input));
        }

        private static IEnumerable<int> AllNumbers =>
        [
            -9266, -2, -1, 0, 1, 2, 3, 6, 9, 10, 12, 13, 15, 16, 18, 20, 21, 90210
        ];

        public static IEnumerable SetNumberTestCases => AllNumbers.Select(n => new TestCaseData(n));

        [TestCase(RandomizerTypeConstants.Set, RandomizerTypeConstants.Set)]
        [TestCase("set", RandomizerTypeConstants.Set)]
        [TestCase("SET", RandomizerTypeConstants.Set)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.AnyBase, RaceRandomizerTypeConstants.BaseRace.AnyBase)]
        [TestCase("any base", RaceRandomizerTypeConstants.BaseRace.AnyBase)]
        [TestCase("ANY BASE", RaceRandomizerTypeConstants.BaseRace.AnyBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.AquaticBase, RaceRandomizerTypeConstants.BaseRace.AquaticBase)]
        [TestCase("aquatic base", RaceRandomizerTypeConstants.BaseRace.AquaticBase)]
        [TestCase("AQUATIC BASE", RaceRandomizerTypeConstants.BaseRace.AquaticBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.MonsterBase, RaceRandomizerTypeConstants.BaseRace.MonsterBase)]
        [TestCase("monster base", RaceRandomizerTypeConstants.BaseRace.MonsterBase)]
        [TestCase("MONSTER BASE", RaceRandomizerTypeConstants.BaseRace.MonsterBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase, RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)]
        [TestCase("non-monster base", RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)]
        [TestCase("NON-MONSTER BASE", RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonStandardBase, RaceRandomizerTypeConstants.BaseRace.NonStandardBase)]
        [TestCase("non-standard base", RaceRandomizerTypeConstants.BaseRace.NonStandardBase)]
        [TestCase("NON-STANDARD BASE", RaceRandomizerTypeConstants.BaseRace.NonStandardBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.StandardBase, RaceRandomizerTypeConstants.BaseRace.StandardBase)]
        [TestCase("standard base", RaceRandomizerTypeConstants.BaseRace.StandardBase)]
        [TestCase("STANDARD BASE", RaceRandomizerTypeConstants.BaseRace.StandardBase)]
        [TestCase(RaceConstants.BaseRaces.Human, "")]
        [TestCase("human", "")]
        [TestCase("HUMAN", "")]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil, "")]
        [TestCase("non-evil", "")]
        [TestCase("NON-EVIL", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetBaseRaceRandomizer_SetsRandomizerType(string input, string expected)
        {
            spec.SetBaseRaceRandomizer(input, string.Empty);
            Assert.That(spec.BaseRaceRandomizerType, Is.EqualTo(expected));
        }

        [TestCaseSource(nameof(SetBaseRaces))]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.AnyBase, "")]
        [TestCase("any base", "")]
        [TestCase("ANY BASE", "")]
        [TestCase(AlignmentConstants.TrueNeutral, "")]
        [TestCase("true neutral", "")]
        [TestCase("TRUE NEUTRAL", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetBaseRaceRandomizer_SetsSetBaseRace(string input, string expected)
        {
            spec.SetBaseRaceRandomizer("set", input);
            Assert.That(spec.SetBaseRace, Is.EqualTo(expected));
        }

        private static IEnumerable<string> BaseRaces =
        [
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
        ];

        public static IEnumerable SetBaseRaces
        {
            get
            {
                foreach (var baseRace in BaseRaces)
                {
                    yield return new TestCaseData(baseRace, baseRace);
                    yield return new TestCaseData(baseRace.ToLower(), baseRace);
                    yield return new TestCaseData(baseRace.ToUpper(), baseRace);
                }
            }
        }

        [TestCase(RandomizerTypeConstants.Set, RandomizerTypeConstants.Set)]
        [TestCase("set", RandomizerTypeConstants.Set)]
        [TestCase("SET", RandomizerTypeConstants.Set)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, RaceRandomizerTypeConstants.Metarace.AnyMeta)]
        [TestCase("any meta", RaceRandomizerTypeConstants.Metarace.AnyMeta)]
        [TestCase("ANY META", RaceRandomizerTypeConstants.Metarace.AnyMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta, RaceRandomizerTypeConstants.Metarace.GeneticMeta)]
        [TestCase("genetic meta", RaceRandomizerTypeConstants.Metarace.GeneticMeta)]
        [TestCase("GENETIC META", RaceRandomizerTypeConstants.Metarace.GeneticMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta, RaceRandomizerTypeConstants.Metarace.LycanthropeMeta)]
        [TestCase("lycanthrope meta", RaceRandomizerTypeConstants.Metarace.LycanthropeMeta)]
        [TestCase("LYCANTHROPE META", RaceRandomizerTypeConstants.Metarace.LycanthropeMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta, RaceRandomizerTypeConstants.Metarace.UndeadMeta)]
        [TestCase("undead meta", RaceRandomizerTypeConstants.Metarace.UndeadMeta)]
        [TestCase("UNDEAD META", RaceRandomizerTypeConstants.Metarace.UndeadMeta)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta, RaceRandomizerTypeConstants.Metarace.NoMeta)]
        [TestCase("no meta", RaceRandomizerTypeConstants.Metarace.NoMeta)]
        [TestCase("NO META", RaceRandomizerTypeConstants.Metarace.NoMeta)]
        [TestCase(RaceConstants.Metaraces.None, "")]
        [TestCase("none", "")]
        [TestCase("NONE", "")]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil, "")]
        [TestCase("non-evil", "")]
        [TestCase("NON-EVIL", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetMetaraceRandomizer_SetsRandomizerType(string input, string expected)
        {
            spec.SetMetaraceRandomizer(input, string.Empty, false);
            Assert.That(spec.MetaraceRandomizerType, Is.EqualTo(expected));
        }

        [TestCase(true)]
        [TestCase(false)]
        public void SetMetaraceRandomizer_SetsForceMetarace(bool force)
        {
            spec.SetMetaraceRandomizer("any meta", string.Empty, force);
            Assert.That(spec.ForceMetarace, Is.EqualTo(force));
        }

        [TestCaseSource(nameof(SetMetaraces))]
        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, CharacterSpecifications.InvalidMetarace)]
        [TestCase("any meta", CharacterSpecifications.InvalidMetarace)]
        [TestCase("ANY META", CharacterSpecifications.InvalidMetarace)]
        [TestCase(AlignmentConstants.TrueNeutral, CharacterSpecifications.InvalidMetarace)]
        [TestCase("true neutral", CharacterSpecifications.InvalidMetarace)]
        [TestCase("TRUE NEUTRAL", CharacterSpecifications.InvalidMetarace)]
        [TestCase("Invalid", CharacterSpecifications.InvalidMetarace)]
        [TestCase("invalid", CharacterSpecifications.InvalidMetarace)]
        [TestCase("INVALID", CharacterSpecifications.InvalidMetarace)]
        [TestCase("", RaceConstants.Metaraces.None)]
        public void SetMetaraceRandomizer_SetsSetMetarace(string input, string expected)
        {
            spec.SetMetaraceRandomizer("set", input, false);
            Assert.That(spec.SetMetarace, Is.EqualTo(expected));
        }

        public static IEnumerable SetMetaraces
        {
            get
            {
                var metaraces = new[]
                {
                    RaceConstants.Metaraces.Ghost,
                    RaceConstants.Metaraces.HalfCelestial,
                    RaceConstants.Metaraces.HalfDragon,
                    RaceConstants.Metaraces.HalfFiend,
                    RaceConstants.Metaraces.Lich,
                    RaceConstants.Metaraces.Mummy,
                    RaceConstants.Metaraces.None,
                    RaceConstants.Metaraces.Vampire,
                    RaceConstants.Metaraces.Werebear,
                    RaceConstants.Metaraces.Wereboar,
                    RaceConstants.Metaraces.Wererat,
                    RaceConstants.Metaraces.Weretiger,
                    RaceConstants.Metaraces.Werewolf,
                };

                foreach (var metarace in metaraces)
                {
                    yield return new TestCaseData(metarace, metarace);
                    yield return new TestCaseData(metarace.ToLower(), metarace);
                    yield return new TestCaseData(metarace.ToUpper(), metarace);
                }
            }
        }

        [TestCase(RandomizerTypeConstants.Set, RandomizerTypeConstants.Set)]
        [TestCase("set", RandomizerTypeConstants.Set)]
        [TestCase("SET", RandomizerTypeConstants.Set)]
        [TestCase(AbilitiesRandomizerTypeConstants.Raw, AbilitiesRandomizerTypeConstants.Raw)]
        [TestCase("raw", AbilitiesRandomizerTypeConstants.Raw)]
        [TestCase("RAW", AbilitiesRandomizerTypeConstants.Raw)]
        [TestCase(AbilitiesRandomizerTypeConstants.Average, AbilitiesRandomizerTypeConstants.Average)]
        [TestCase("average", AbilitiesRandomizerTypeConstants.Average)]
        [TestCase("AVERAGE", AbilitiesRandomizerTypeConstants.Average)]
        [TestCase(AbilitiesRandomizerTypeConstants.BestOfFour, AbilitiesRandomizerTypeConstants.BestOfFour)]
        [TestCase("best of four", AbilitiesRandomizerTypeConstants.BestOfFour)]
        [TestCase("BEST OF FOUR", AbilitiesRandomizerTypeConstants.BestOfFour)]
        [TestCase(AbilitiesRandomizerTypeConstants.Good, AbilitiesRandomizerTypeConstants.Good)]
        [TestCase("good", AbilitiesRandomizerTypeConstants.Good)]
        [TestCase("GOOD", AbilitiesRandomizerTypeConstants.Good)]
        [TestCase(AbilitiesRandomizerTypeConstants.Heroic, AbilitiesRandomizerTypeConstants.Heroic)]
        [TestCase("heroic", AbilitiesRandomizerTypeConstants.Heroic)]
        [TestCase("HEROIC", AbilitiesRandomizerTypeConstants.Heroic)]
        [TestCase(AbilitiesRandomizerTypeConstants.OnesAsSixes, AbilitiesRandomizerTypeConstants.OnesAsSixes)]
        [TestCase("ones as sixes", AbilitiesRandomizerTypeConstants.OnesAsSixes)]
        [TestCase("ONES AS SIXES", AbilitiesRandomizerTypeConstants.OnesAsSixes)]
        [TestCase(AbilitiesRandomizerTypeConstants.Poor, AbilitiesRandomizerTypeConstants.Poor)]
        [TestCase("poor", AbilitiesRandomizerTypeConstants.Poor)]
        [TestCase("POOR", AbilitiesRandomizerTypeConstants.Poor)]
        [TestCase(AbilitiesRandomizerTypeConstants.TwoTenSidedDice, AbilitiesRandomizerTypeConstants.TwoTenSidedDice)]
        [TestCase("2d10", AbilitiesRandomizerTypeConstants.TwoTenSidedDice)]
        [TestCase("2D10", AbilitiesRandomizerTypeConstants.TwoTenSidedDice)]
        [TestCase("1", "")]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil, "")]
        [TestCase("non-evil", "")]
        [TestCase("NON-EVIL", "")]
        [TestCase("Invalid", "")]
        [TestCase("invalid", "")]
        [TestCase("INVALID", "")]
        [TestCase("", "")]
        public void SetAbilitiesRandomizer_SetsRandomizerType(string input, string expected)
        {
            spec.SetAbilitiesRandomizer(input, 0, 0, 0, 0, 0, 0, false);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(expected));
        }

        [TestCase(true)]
        [TestCase(false)]
        public void SetMetaraceRandomizer_SetsAllowAdjustments(bool adjust)
        {
            spec.SetAbilitiesRandomizer("raw", 0, 0, 0, 0, 0, 0, adjust);
            Assert.That(spec.AllowAbilityAdjustments, Is.EqualTo(adjust));
        }

        [TestCaseSource(nameof(SetNumberTestCases))]
        public void SetAbilitiesRandomizer_SetsSetStrength(int input)
        {
            spec.SetAbilitiesRandomizer("set", input, 0, 0, 0, 0, 0, false);
            Assert.That(spec.SetStrength, Is.EqualTo(input));
        }

        [TestCaseSource(nameof(SetNumberTestCases))]
        public void SetAbilitiesRandomizer_SetsSetConstitution(int input)
        {
            spec.SetAbilitiesRandomizer("set", 0, input, 0, 0, 0, 0, false);
            Assert.That(spec.SetConstitution, Is.EqualTo(input));
        }

        [TestCaseSource(nameof(SetNumberTestCases))]
        public void SetAbilitiesRandomizer_SetsSetDexterity(int input)
        {
            spec.SetAbilitiesRandomizer("set", 0, 0, input, 0, 0, 0, false);
            Assert.That(spec.SetDexterity, Is.EqualTo(input));
        }

        [TestCaseSource(nameof(SetNumberTestCases))]
        public void SetAbilitiesRandomizer_SetsSetIntelligence(int input)
        {
            spec.SetAbilitiesRandomizer("set", 0, 0, 0, input, 0, 0, false);
            Assert.That(spec.SetIntelligence, Is.EqualTo(input));
        }

        [TestCaseSource(nameof(SetNumberTestCases))]
        public void SetAbilitiesRandomizer_SetsSetWisdom(int input)
        {
            spec.SetAbilitiesRandomizer("set", 0, 0, 0, 0, input, 0, false);
            Assert.That(spec.SetWisdom, Is.EqualTo(input));
        }

        [TestCaseSource(nameof(SetNumberTestCases))]
        public void SetAbilitiesRandomizer_SetsSetCharisma(int input)
        {
            spec.SetAbilitiesRandomizer("set", 0, 0, 0, 0, 0, input, false);
            Assert.That(spec.SetCharisma, Is.EqualTo(input));
        }

        [Test]
        public void IsValid_ReturnsValid_WithDefaults()
        {
            SetSpecDefaults();

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
        }

        private void SetSpecDefaults()
        {
            spec.SetAlignmentRandomizer(AlignmentRandomizerTypeConstants.Any, string.Empty);
            spec.SetClassNameRandomizer(ClassNameRandomizerTypeConstants.AnyPlayer, string.Empty);
            spec.SetLevelRandomizer(LevelRandomizerTypeConstants.Any, 0);
            spec.SetBaseRaceRandomizer(RaceRandomizerTypeConstants.BaseRace.AnyBase, string.Empty);
            spec.SetMetaraceRandomizer(RaceRandomizerTypeConstants.Metarace.AnyMeta, string.Empty, false);
            spec.SetAbilitiesRandomizer(AbilitiesRandomizerTypeConstants.Raw, 0, 0, 0, 0, 0, 0, false);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenAlignmentRandomizerSet()
        {
            SetSpecDefaults();

            spec.SetAlignmentRandomizer("any", string.Empty);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AlignmentRandomizerType, Is.EqualTo(AlignmentRandomizerTypeConstants.Any));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenAlignmentRandomizerNotSet()
        {
            SetSpecDefaults();

            spec.SetAlignmentRandomizer("invalid", string.Empty);

            var valid = spec.IsValid();
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

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"AlignmentRandomizerType is not valid. Should be one of: [{string.Join(", ", alignmentRandomizers)}]"));
            Assert.That(spec.AlignmentRandomizerType, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenClassNameRandomizerSet()
        {
            SetSpecDefaults();

            spec.SetClassNameRandomizer("any player", string.Empty);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.ClassNameRandomizerType, Is.EqualTo(ClassNameRandomizerTypeConstants.AnyPlayer));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenClassNameRandomizerNotSet()
        {
            SetSpecDefaults();

            spec.SetClassNameRandomizer("invalid", string.Empty);

            var valid = spec.IsValid();
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

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"ClassNameRandomizerType is not valid. Should be one of: [{string.Join(", ", classNameRandomizers)}]"));
            Assert.That(spec.ClassNameRandomizerType, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenLevelRandomizerSet()
        {
            SetSpecDefaults();

            spec.SetLevelRandomizer("any", 0);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.LevelRandomizerType, Is.EqualTo(LevelRandomizerTypeConstants.Any));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenLevelRandomizerNotSet()
        {
            SetSpecDefaults();

            spec.SetLevelRandomizer("invalid", 0);

            var valid = spec.IsValid();
            var levelRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                LevelRandomizerTypeConstants.Any,
                LevelRandomizerTypeConstants.High,
                LevelRandomizerTypeConstants.Low,
                LevelRandomizerTypeConstants.Medium,
                LevelRandomizerTypeConstants.VeryHigh,
            };

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"LevelRandomizerType is not valid. Should be one of: [{string.Join(", ", levelRandomizers)}]"));
            Assert.That(spec.LevelRandomizerType, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenBaseRaceRandomizerSet()
        {
            SetSpecDefaults();

            spec.SetBaseRaceRandomizer("any base", string.Empty);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.BaseRaceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.BaseRace.AnyBase));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenBaseRaceRandomizerNotSet()
        {
            SetSpecDefaults();

            spec.SetBaseRaceRandomizer("invalid", string.Empty);

            var valid = spec.IsValid();
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

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"BaseRaceRandomizerType is not valid. Should be one of: [{string.Join(", ", baseRaceRandomizers)}]"));
            Assert.That(spec.BaseRaceRandomizerType, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenMetaraceRandomizerSet()
        {
            SetSpecDefaults();

            spec.SetMetaraceRandomizer("any meta", string.Empty, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.MetaraceRandomizerType, Is.EqualTo(RaceRandomizerTypeConstants.Metarace.AnyMeta));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenMetaraceRandomizerNotSet()
        {
            SetSpecDefaults();

            spec.SetMetaraceRandomizer("invalid", string.Empty, false);

            var valid = spec.IsValid();
            var metaraceRandomizers = new[]
            {
                RandomizerTypeConstants.Set,
                RaceRandomizerTypeConstants.Metarace.AnyMeta,
                RaceRandomizerTypeConstants.Metarace.GeneticMeta,
                RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,
                RaceRandomizerTypeConstants.Metarace.NoMeta,
                RaceRandomizerTypeConstants.Metarace.UndeadMeta,
            };

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"MetaraceRandomizerType is not valid. Should be one of: [{string.Join(", ", metaraceRandomizers)}]"));
            Assert.That(spec.MetaraceRandomizerType, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenAbilitiesRandomizerSet()
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("raw", 0, 0, 0, 0, 0, 0, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(AbilitiesRandomizerTypeConstants.Raw));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenAbilitiesRandomizerNotSet()
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("invalid", 0, 0, 0, 0, 0, 0, false);

            var valid = spec.IsValid();
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

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"AbilitiesRandomizerType is not valid. Should be one of: [{string.Join(", ", abilitiesRandomizers)}]"));
            Assert.That(spec.AbilitiesRandomizerType, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenSetAlignmentSet()
        {
            SetSpecDefaults();

            spec.SetAlignmentRandomizer("set", "lawful good");

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AlignmentRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetAlignment, Is.EqualTo(AlignmentConstants.LawfulGood));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenSetAlignmentNotSet()
        {
            SetSpecDefaults();

            spec.SetAlignmentRandomizer("set", "invalid alignment");

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
            Assert.That(valid.Error, Is.EqualTo($"SetAlignment is not valid. Should be one of: [{string.Join(", ", alignments)}]"));
            Assert.That(spec.AlignmentRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetAlignment, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenSetClassNameSet()
        {
            SetSpecDefaults();

            spec.SetClassNameRandomizer("set", "barbarian");

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.ClassNameRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetClassName, Is.EqualTo(CharacterClassConstants.Barbarian));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenSetClassNameNotSet()
        {
            SetSpecDefaults();

            spec.SetClassNameRandomizer("set", "invalid");

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
            Assert.That(valid.Error, Is.EqualTo($"SetClassName is not valid. Should be one of: [{string.Join(", ", classes)}]"));
            Assert.That(spec.ClassNameRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetClassName, Is.Empty);
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(6)]
        [TestCase(7)]
        [TestCase(8)]
        [TestCase(9)]
        [TestCase(10)]
        [TestCase(11)]
        [TestCase(12)]
        [TestCase(13)]
        [TestCase(14)]
        [TestCase(15)]
        [TestCase(16)]
        [TestCase(17)]
        [TestCase(18)]
        [TestCase(19)]
        [TestCase(20)]
        public void IsValid_ReturnsValid_WhenSetLevelValid(int level)
        {
            SetSpecDefaults();

            spec.SetLevelRandomizer("set", level);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetLevel, Is.EqualTo(level));
        }

        [TestCase(-9266)]
        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(21)]
        [TestCase(90210)]
        public void IsValid_ReturnsInvalid_WhenSetLevelNotValid(int level)
        {
            SetSpecDefaults();

            spec.SetLevelRandomizer("set", level);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("SetLevel is not valid. Should be 1 <= level <= 20"));
            Assert.That(spec.LevelRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetLevel, Is.EqualTo(level));
        }

        [Test]
        public void IsValid_ReturnsValid_WhenSetBaseRaceSet()
        {
            SetSpecDefaults();

            spec.SetBaseRaceRandomizer("set", "human");

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.BaseRaceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetBaseRace, Is.EqualTo(RaceConstants.BaseRaces.Human));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenSetBaseRaceNotSet()
        {
            SetSpecDefaults();

            spec.SetBaseRaceRandomizer("set", "invalid");

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"SetBaseRace is not valid. Should be one of: [{string.Join(", ", BaseRaces)}]"));
            Assert.That(spec.BaseRaceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetBaseRace, Is.Empty);
        }

        [Test]
        public void IsValid_ReturnsValid_WhenSetMetaraceSet()
        {
            SetSpecDefaults();

            spec.SetMetaraceRandomizer("set", "half-dragon", false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.MetaraceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetMetarace, Is.EqualTo(RaceConstants.Metaraces.HalfDragon));
        }

        [Test]
        public void IsValid_ReturnsInvalid_WhenSetMetaraceNotSet()
        {
            SetSpecDefaults();

            spec.SetMetaraceRandomizer("set", "invalid", false);

            var valid = spec.IsValid();
            var metaraces = new[]
            {
                RaceConstants.Metaraces.Ghost,
                RaceConstants.Metaraces.HalfCelestial,
                RaceConstants.Metaraces.HalfDragon,
                RaceConstants.Metaraces.HalfFiend,
                RaceConstants.Metaraces.Lich,
                RaceConstants.Metaraces.Mummy,
                RaceConstants.Metaraces.None,
                RaceConstants.Metaraces.Vampire,
                RaceConstants.Metaraces.Werebear,
                RaceConstants.Metaraces.Wereboar,
                RaceConstants.Metaraces.Wererat,
                RaceConstants.Metaraces.Weretiger,
                RaceConstants.Metaraces.Werewolf,
            };

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo($"SetMetarace is not valid. Should be one of: [{string.Join(", ", metaraces)}]"));
            Assert.That(spec.MetaraceRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetMetarace, Is.EqualTo(CharacterSpecifications.InvalidMetarace));
        }

        [TestCaseSource(nameof(PositiveNumberTestCases))]
        public void IsValid_ReturnsValid_WhenSetStrengthValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", score, 10, 10, 10, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(score));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        public static IEnumerable PositiveNumberTestCases => AllNumbers.Where(n => n > 0).Select(n => new TestCaseData(n));

        [TestCaseSource(nameof(NotPositiveNumberTestCases))]
        public void IsValid_ReturnsInvalid_WhenSetStrengthNotValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", score, 10, 10, 10, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("SetStrength is not valid. Should be SetStrength > 0"));
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(score));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        public static IEnumerable NotPositiveNumberTestCases => AllNumbers.Where(n => n <= 0).Select(n => new TestCaseData(n));

        [TestCaseSource(nameof(PositiveNumberTestCases))]
        public void IsValid_ReturnsValid_WhenSetConstitutionValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, score, 10, 10, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(score));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(NotPositiveNumberTestCases))]
        public void IsValid_ReturnsInvalid_WhenSetConstitutionNotValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, score, 10, 10, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("SetConstitution is not valid. Should be SetConstitution > 0"));
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(score));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(PositiveNumberTestCases))]
        public void IsValid_ReturnsValid_WhenSetDexterityValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, score, 10, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(score));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(NotPositiveNumberTestCases))]
        public void IsValid_ReturnsInvalid_WhenSetDexterityNotValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, score, 10, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("SetDexterity is not valid. Should be SetDexterity > 0"));
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(score));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(PositiveNumberTestCases))]
        public void IsValid_ReturnsValid_WhenSetIntelligenceValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, 10, score, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(score));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(NotPositiveNumberTestCases))]
        public void IsValid_ReturnsInvalid_WhenSetIntelligenceNotValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, 10, score, 10, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("SetIntelligence is not valid. Should be SetIntelligence > 0"));
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(score));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(PositiveNumberTestCases))]
        public void IsValid_ReturnsValid_WhenSetWisdomValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, 10, 10, score, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(score));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(NotPositiveNumberTestCases))]
        public void IsValid_ReturnsInvalid_WhenSetWisdomNotValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, 10, 10, score, 10, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("SetWisdom is not valid. Should be SetWisdom > 0"));
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(score));
            Assert.That(spec.SetCharisma, Is.EqualTo(10));
        }

        [TestCaseSource(nameof(PositiveNumberTestCases))]
        public void IsValid_ReturnsValid_WhenSetCharismaValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, 10, 10, 10, score, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.True);
            Assert.That(valid.Error, Is.Empty);
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(score));
        }

        [TestCaseSource(nameof(NotPositiveNumberTestCases))]
        public void IsValid_ReturnsInvalid_WhenSetCharismaNotValid(int score)
        {
            SetSpecDefaults();

            spec.SetAbilitiesRandomizer("set", 10, 10, 10, 10, 10, score, false);

            var valid = spec.IsValid();

            Assert.That(valid.Valid, Is.False);
            Assert.That(valid.Error, Is.EqualTo("SetCharisma is not valid. Should be SetCharisma > 0"));
            Assert.That(spec.AbilitiesRandomizerType, Is.EqualTo(RandomizerTypeConstants.Set));
            Assert.That(spec.SetStrength, Is.EqualTo(10));
            Assert.That(spec.SetConstitution, Is.EqualTo(10));
            Assert.That(spec.SetDexterity, Is.EqualTo(10));
            Assert.That(spec.SetIntelligence, Is.EqualTo(10));
            Assert.That(spec.SetWisdom, Is.EqualTo(10));
            Assert.That(spec.SetCharisma, Is.EqualTo(score));
        }
    }
}
