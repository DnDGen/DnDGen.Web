using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Api.CharacterGen.Models
{
    public class CharacterSpecifications
    {
        public string AlignmentRandomizerType { get; private set; }
        public string ClassNameRandomizerType { get; private set; }
        public string LevelRandomizerType { get; private set; }
        public string BaseRaceRandomizerType { get; private set; }
        public string MetaraceRandomizerType { get; private set; }
        public string AbilitiesRandomizerType { get; private set; }
        public string SetAlignment { get; private set; }
        public string SetClassName { get; private set; }
        public int SetLevel { get; private set; }
        public string SetBaseRace { get; private set; }
        public bool ForceMetarace { get; private set; }
        public string SetMetarace { get; private set; }
        public int SetStrength { get; private set; }
        public int SetConstitution { get; private set; }
        public int SetDexterity { get; private set; }
        public int SetIntelligence { get; private set; }
        public int SetWisdom { get; private set; }
        public int SetCharisma { get; private set; }
        public bool AllowAbilityAdjustments { get; private set; }

        private static readonly IEnumerable<string> AlignmentRandomizers = new[]
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

        private static readonly IEnumerable<string> Alignments = new[]
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

        private static readonly IEnumerable<string> ClassNameRandomizers = new[]
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

        private static readonly IEnumerable<string> ClassNames = new[]
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

        private static readonly IEnumerable<string> LevelRandomizers = new[]
        {
            RandomizerTypeConstants.Set,
            LevelRandomizerTypeConstants.Any,
            LevelRandomizerTypeConstants.High,
            LevelRandomizerTypeConstants.Low,
            LevelRandomizerTypeConstants.Medium,
            LevelRandomizerTypeConstants.VeryHigh,
        };

        private static readonly IEnumerable<string> BaseRaceRandomizers = new[]
        {
            RandomizerTypeConstants.Set,
            RaceRandomizerTypeConstants.BaseRace.AnyBase,
            RaceRandomizerTypeConstants.BaseRace.AquaticBase,
            RaceRandomizerTypeConstants.BaseRace.MonsterBase,
            RaceRandomizerTypeConstants.BaseRace.NonMonsterBase,
            RaceRandomizerTypeConstants.BaseRace.NonStandardBase,
            RaceRandomizerTypeConstants.BaseRace.StandardBase,
        };

        private static readonly IEnumerable<string> BaseRaces = new[]
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

        private static readonly IEnumerable<string> MetaraceRandomizers = new[]
        {
            RandomizerTypeConstants.Set,
            RaceRandomizerTypeConstants.Metarace.AnyMeta,
            RaceRandomizerTypeConstants.Metarace.GeneticMeta,
            RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,
            RaceRandomizerTypeConstants.Metarace.NoMeta,
            RaceRandomizerTypeConstants.Metarace.UndeadMeta,
        };

        private static readonly IEnumerable<string> Metaraces = new[]
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

        private static readonly IEnumerable<string> AbilitiesRandomizers = new[]
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

        public void SetAlignmentRandomizer(string randomizerType, string setValue)
        {
            AlignmentRandomizerType = AlignmentRandomizers.FirstOrDefault(r => r.ToLower() == randomizerType?.ToLower());
            SetAlignment = Alignments.FirstOrDefault(a => a.ToLower() == setValue?.ToLower());
        }

        public void SetClassNameRandomizer(string randomizerType, string setValue)
        {
            ClassNameRandomizerType = ClassNameRandomizers.FirstOrDefault(r => r.ToLower() == randomizerType?.ToLower());
            SetClassName = ClassNames.FirstOrDefault(a => a.ToLower() == setValue?.ToLower());
        }

        public void SetLevelRandomizer(string randomizerType, int setValue)
        {
            LevelRandomizerType = LevelRandomizers.FirstOrDefault(r => r.ToLower() == randomizerType?.ToLower());
            SetLevel = setValue;
        }

        public void SetBaseRaceRandomizer(string randomizerType, string setValue)
        {
            BaseRaceRandomizerType = BaseRaceRandomizers.FirstOrDefault(r => r.ToLower() == randomizerType?.ToLower());
            SetBaseRace = BaseRaces.FirstOrDefault(a => a.ToLower() == setValue?.ToLower());
        }

        public void SetMetaraceRandomizer(string randomizerType, string setValue, bool forceMetarace)
        {
            MetaraceRandomizerType = MetaraceRandomizers.FirstOrDefault(r => r.ToLower() == randomizerType?.ToLower());
            SetMetarace = Metaraces.FirstOrDefault(a => a.ToLower() == setValue?.ToLower());
            ForceMetarace = forceMetarace;
        }

        public void SetAbilitiesRandomizer(
            string randomizerType,
            int setStrengthValue,
            int setConstitutionValue,
            int setDexterityValue,
            int setIntelligenceValue,
            int setWisdomValue,
            int setCharismaValue,
            bool allowAbilityAdjustments)
        {
            AbilitiesRandomizerType = AbilitiesRandomizers.FirstOrDefault(r => r.ToLower() == randomizerType?.ToLower());
            SetStrength = setStrengthValue;
            SetConstitution = setConstitutionValue;
            SetDexterity = setDexterityValue;
            SetIntelligence = setIntelligenceValue;
            SetWisdom = setWisdomValue;
            SetCharisma = setCharismaValue;
            AllowAbilityAdjustments = allowAbilityAdjustments;
        }

        public (bool Valid, string Error) IsValid()
        {
            var valid = true;

            valid &= AlignmentRandomizerType != null;
            if (!valid)
                return (false, $"AlignmentRandomizerType is not valid. Should be one of: [{string.Join(", ", AlignmentRandomizers)}]");

            valid &= ClassNameRandomizerType != null;
            if (!valid)
                return (false, $"ClassNameRandomizerType is not valid. Should be one of: [{string.Join(", ", ClassNameRandomizers)}]");

            valid &= LevelRandomizerType != null;
            if (!valid)
                return (false, $"LevelRandomizerType is not valid. Should be one of: [{string.Join(", ", LevelRandomizers)}]");

            valid &= BaseRaceRandomizerType != null;
            if (!valid)
                return (false, $"BaseRaceRandomizerType is not valid. Should be one of: [{string.Join(", ", BaseRaceRandomizers)}]");

            valid &= MetaraceRandomizerType != null;
            if (!valid)
                return (false, $"MetaraceRandomizerType is not valid. Should be one of: [{string.Join(", ", MetaraceRandomizers)}]");

            valid &= AbilitiesRandomizerType != null;
            if (!valid)
                return (false, $"AbilitiesRandomizerType is not valid. Should be one of: [{string.Join(", ", AbilitiesRandomizers)}]");

            if (AlignmentRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetAlignment != null;
                if (!valid)
                    return (false, $"SetAlignment is not valid. Should be one of: [{string.Join(", ", Alignments)}]");
            }

            if (ClassNameRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetClassName != null;
                if (!valid)
                    return (false, $"SetClassName is not valid. Should be one of: [{string.Join(", ", ClassNames)}]");
            }

            if (LevelRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetLevel > 0;
                valid &= SetLevel <= 20;
                if (!valid)
                    return (false, "SetLevel is not valid. Should be 1 <= level <= 20");
            }

            if (BaseRaceRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetBaseRace != null;
                if (!valid)
                    return (false, $"SetBaseRace is not valid. Should be one of: [{string.Join(", ", BaseRaces)}]");
            }

            if (MetaraceRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetMetarace != null;
                if (!valid)
                    return (false, $"SetMetarace is not valid. Should be one of: [{string.Join(", ", Metaraces)}]");
            }

            if (AbilitiesRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetStrength > 0;
                if (!valid)
                    return (false, "SetStrength is not valid. Should be SetStrength > 0");

                valid &= SetConstitution > 0;
                if (!valid)
                    return (false, "SetConstitution is not valid. Should be SetConstitution > 0");

                valid &= SetDexterity > 0;
                if (!valid)
                    return (false, "SetDexterity is not valid. Should be SetDexterity > 0");

                valid &= SetIntelligence > 0;
                if (!valid)
                    return (false, "SetIntelligence is not valid. Should be SetIntelligence > 0");

                valid &= SetWisdom > 0;
                if (!valid)
                    return (false, "SetWisdom is not valid. Should be SetWisdom > 0");

                valid &= SetCharisma > 0;
                if (!valid)
                    return (false, "SetCharisma is not valid. Should be SetCharisma > 0");
            }

            return (valid, null);
        }
    }
}