using DnDGen.CreatureGen.Alignments;
using DnDGen.CreatureGen.Creatures;
using DnDGen.CreatureGen.Generators.Creatures;

namespace DnDGen.Api.CreatureGen.Models
{
    public class CreatureSpecifications
    {
        public bool AsCharacter { get; set; }
        public string? Creature { get; private set; }
        public Filters? Filters { get; private set; }

        private static readonly IEnumerable<string> AlignmentRandomizers =
        [
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
        ];

        private static readonly IEnumerable<string> Alignments =
        [
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticNeutral,
            AlignmentConstants.ChaoticEvil,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil,
        ];

        private static readonly IEnumerable<string> ClassNameRandomizers =
        [
            RandomizerTypeConstants.Set,
            ClassNameRandomizerTypeConstants.AnyNPC,
            ClassNameRandomizerTypeConstants.AnyPlayer,
            ClassNameRandomizerTypeConstants.ArcaneSpellcaster,
            ClassNameRandomizerTypeConstants.DivineSpellcaster,
            ClassNameRandomizerTypeConstants.NonSpellcaster,
            ClassNameRandomizerTypeConstants.PhysicalCombat,
            ClassNameRandomizerTypeConstants.Spellcaster,
            ClassNameRandomizerTypeConstants.Stealth,
        ];

        private static readonly IEnumerable<string> ClassNames =
        [
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
        ];

        private static readonly IEnumerable<string> LevelRandomizers =
        [
            RandomizerTypeConstants.Set,
            LevelRandomizerTypeConstants.Any,
            LevelRandomizerTypeConstants.High,
            LevelRandomizerTypeConstants.Low,
            LevelRandomizerTypeConstants.Medium,
            LevelRandomizerTypeConstants.VeryHigh,
        ];

        private static readonly IEnumerable<string> BaseRaceRandomizers =
        [
            RandomizerTypeConstants.Set,
            RaceRandomizerTypeConstants.BaseRace.AnyBase,
            RaceRandomizerTypeConstants.BaseRace.AquaticBase,
            RaceRandomizerTypeConstants.BaseRace.MonsterBase,
            RaceRandomizerTypeConstants.BaseRace.NonMonsterBase,
            RaceRandomizerTypeConstants.BaseRace.NonStandardBase,
            RaceRandomizerTypeConstants.BaseRace.StandardBase,
        ];

        private static readonly IEnumerable<string> Creatures = CreatureConstants.GetAll();

        private static readonly IEnumerable<string> MetaraceRandomizers =
        [
            RandomizerTypeConstants.Set,
            RaceRandomizerTypeConstants.Metarace.AnyMeta,
            RaceRandomizerTypeConstants.Metarace.GeneticMeta,
            RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,
            RaceRandomizerTypeConstants.Metarace.NoMeta,
            RaceRandomizerTypeConstants.Metarace.UndeadMeta,
        ];

        private static readonly IEnumerable<string> Metaraces =
        [
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
        ];

        public const string InvalidMetarace = "Invalid Metarace";

        private static readonly IEnumerable<string> AbilitiesRandomizers =
        [
            RandomizerTypeConstants.Set,
            AbilitiesRandomizerTypeConstants.Average,
            AbilitiesRandomizerTypeConstants.BestOfFour,
            AbilitiesRandomizerTypeConstants.Good,
            AbilitiesRandomizerTypeConstants.Heroic,
            AbilitiesRandomizerTypeConstants.OnesAsSixes,
            AbilitiesRandomizerTypeConstants.Poor,
            AbilitiesRandomizerTypeConstants.Raw,
            AbilitiesRandomizerTypeConstants.TwoTenSidedDice,
        ];

        public void SetCreature(string? creature)
        {
            Creature = Creatures.FirstOrDefault(c => c.Equals(creature, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
        }

        public void SetAlignmentFilter(string? alignment)
        {
            Filters ??= new();
            Filters.Alignment = Alignments.FirstOrDefault(a => a.Equals(alignment, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
        }

        public void SetClassNameRandomizer(string randomizerType, string setValue)
        {
            ClassNameRandomizerType = ClassNameRandomizers.FirstOrDefault(r => r.Equals(randomizerType, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
            SetClassName = ClassNames.FirstOrDefault(a => a.Equals(setValue, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
        }

        public void SetLevelRandomizer(string randomizerType, int setValue)
        {
            LevelRandomizerType = LevelRandomizers.FirstOrDefault(r => r.Equals(randomizerType, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
            SetLevel = setValue;
        }

        public void SetBaseRaceRandomizer(string randomizerType, string setValue)
        {
            BaseRaceRandomizerType = BaseRaceRandomizers.FirstOrDefault(r => r.Equals(randomizerType, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
            SetBaseRace = BaseRaces.FirstOrDefault(a => a.Equals(setValue, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
        }

        public void SetMetaraceRandomizer(string randomizerType, string setValue, bool forceMetarace)
        {
            MetaraceRandomizerType = MetaraceRandomizers.FirstOrDefault(r => r.Equals(randomizerType, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
            //HACK: Can't use string.Empty, as that is the "None" metarace
            SetMetarace = Metaraces.FirstOrDefault(a => a.Equals(setValue, StringComparison.CurrentCultureIgnoreCase)) ?? InvalidMetarace;
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
            AbilitiesRandomizerType = AbilitiesRandomizers.FirstOrDefault(r => r.Equals(randomizerType, StringComparison.CurrentCultureIgnoreCase)) ?? string.Empty;
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

            valid &= AlignmentRandomizerType != string.Empty;
            if (!valid)
                return (false, $"AlignmentRandomizerType is not valid. Should be one of: [{string.Join(", ", AlignmentRandomizers)}]");

            valid &= ClassNameRandomizerType != string.Empty;
            if (!valid)
                return (false, $"ClassNameRandomizerType is not valid. Should be one of: [{string.Join(", ", ClassNameRandomizers)}]");

            valid &= LevelRandomizerType != string.Empty;
            if (!valid)
                return (false, $"LevelRandomizerType is not valid. Should be one of: [{string.Join(", ", LevelRandomizers)}]");

            valid &= BaseRaceRandomizerType != string.Empty;
            if (!valid)
                return (false, $"BaseRaceRandomizerType is not valid. Should be one of: [{string.Join(", ", BaseRaceRandomizers)}]");

            valid &= MetaraceRandomizerType != string.Empty;
            if (!valid)
                return (false, $"MetaraceRandomizerType is not valid. Should be one of: [{string.Join(", ", MetaraceRandomizers)}]");

            valid &= AbilitiesRandomizerType != string.Empty;
            if (!valid)
                return (false, $"AbilitiesRandomizerType is not valid. Should be one of: [{string.Join(", ", AbilitiesRandomizers)}]");

            valid &= Creature != string.Empty;
            if (!valid)
                return (false, $"Creature is not valid. Should be one of: [{string.Join(", ", C)}]");

            valid &= Filters?.Alignment != string.Empty;
            if (!valid)
                return (false, $"Alignment filter is not valid. Should be one of: [{string.Join(", ", Alignments)}]");

            if (ClassNameRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetClassName != string.Empty;
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
            }

            if (MetaraceRandomizerType == RandomizerTypeConstants.Set)
            {
                valid &= SetMetarace != InvalidMetarace;
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

            return (valid, string.Empty);
        }

        internal void SetTypeFilter(string? creatureType)
        {
            throw new NotImplementedException();
        }

        internal void SetChallengeRatingFilter(string? challengeRating)
        {
            throw new NotImplementedException();
        }

        internal void SetTemplatesFilter(string? templates)
        {
            throw new NotImplementedException();
        }
    }
}