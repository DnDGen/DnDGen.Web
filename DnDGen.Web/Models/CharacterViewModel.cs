using CharacterGen.Alignments;
using CharacterGen.CharacterClasses;
using CharacterGen.Races;
using CharacterGen.Randomizers.Abilities;
using CharacterGen.Randomizers.Alignments;
using CharacterGen.Randomizers.CharacterClasses;
using CharacterGen.Randomizers.Races;
using DnDGen.Web.App_Start.Factories;
using System.Collections.Generic;

namespace DnDGen.Web.Models
{
    public class CharacterViewModel
    {
        public IEnumerable<string> AlignmentRandomizerTypes { get; set; }
        public IEnumerable<string> Alignments { get; set; }
        public IEnumerable<string> ClassNameRandomizerTypes { get; set; }
        public IEnumerable<string> ClassNames { get; set; }
        public IEnumerable<string> LevelRandomizerTypes { get; set; }
        public IEnumerable<string> BaseRaceRandomizerTypes { get; set; }
        public IEnumerable<string> BaseRaces { get; set; }
        public IEnumerable<string> MetaraceRandomizerTypes { get; set; }
        public IEnumerable<string> Metaraces { get; set; }
        public IEnumerable<string> AbilitiesRandomizerTypes { get; set; }

        public CharacterViewModel()
        {
            AlignmentRandomizerTypes = new[]
            {
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
                RandomizerTypeConstants.Set
            };

            Alignments = new[]
            {
                AlignmentConstants.LawfulGood,
                AlignmentConstants.NeutralGood,
                AlignmentConstants.ChaoticGood,
                AlignmentConstants.LawfulNeutral,
                AlignmentConstants.TrueNeutral,
                AlignmentConstants.ChaoticNeutral,
                AlignmentConstants.LawfulEvil,
                AlignmentConstants.NeutralEvil,
                AlignmentConstants.ChaoticEvil,
            };

            BaseRaceRandomizerTypes = new[]
            {
                RaceRandomizerTypeConstants.BaseRace.AnyBase,
                RaceRandomizerTypeConstants.BaseRace.AquaticBase,
                RaceRandomizerTypeConstants.BaseRace.MonsterBase,
                RaceRandomizerTypeConstants.BaseRace.NonMonsterBase,
                RaceRandomizerTypeConstants.BaseRace.NonStandardBase,
                RaceRandomizerTypeConstants.BaseRace.StandardBase,
                RandomizerTypeConstants.Set
            };

            BaseRaces = new[]
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

            ClassNameRandomizerTypes = new[]
            {
                ClassNameRandomizerTypeConstants.AnyPlayer,
                ClassNameRandomizerTypeConstants.DivineSpellcaster,
                ClassNameRandomizerTypeConstants.ArcaneSpellcaster,
                ClassNameRandomizerTypeConstants.NonSpellcaster,
                ClassNameRandomizerTypeConstants.Spellcaster,
                ClassNameRandomizerTypeConstants.Stealth,
                ClassNameRandomizerTypeConstants.PhysicalCombat,
                ClassNameRandomizerTypeConstants.AnyNPC,
                RandomizerTypeConstants.Set
            };

            ClassNames = new[]
            {
                CharacterClassConstants.Barbarian,
                CharacterClassConstants.Bard,
                CharacterClassConstants.Cleric,
                CharacterClassConstants.Druid,
                CharacterClassConstants.Fighter,
                CharacterClassConstants.Monk,
                CharacterClassConstants.Paladin,
                CharacterClassConstants.Ranger,
                CharacterClassConstants.Rogue,
                CharacterClassConstants.Sorcerer,
                CharacterClassConstants.Wizard,
                CharacterClassConstants.Adept,
                CharacterClassConstants.Aristocrat,
                CharacterClassConstants.Commoner,
                CharacterClassConstants.Expert,
                CharacterClassConstants.Warrior
            };

            LevelRandomizerTypes = new[]
            {
                LevelRandomizerTypeConstants.Any,
                LevelRandomizerTypeConstants.High,
                LevelRandomizerTypeConstants.Low,
                LevelRandomizerTypeConstants.Medium,
                LevelRandomizerTypeConstants.VeryHigh,
                RandomizerTypeConstants.Set
            };

            MetaraceRandomizerTypes = new[]
            {
                RaceRandomizerTypeConstants.Metarace.AnyMeta,
                RaceRandomizerTypeConstants.Metarace.GeneticMeta,
                RaceRandomizerTypeConstants.Metarace.LycanthropeMeta,
                RaceRandomizerTypeConstants.Metarace.NoMeta,
                RaceRandomizerTypeConstants.Metarace.UndeadMeta,
                RandomizerTypeConstants.Set
            };

            Metaraces = new[]
            {
                RaceConstants.Metaraces.Ghost,
                RaceConstants.Metaraces.HalfCelestial,
                RaceConstants.Metaraces.HalfDragon,
                RaceConstants.Metaraces.HalfFiend,
                RaceConstants.Metaraces.Lich,
                RaceConstants.Metaraces.Mummy,
                RaceConstants.Metaraces.Vampire,
                RaceConstants.Metaraces.Werebear,
                RaceConstants.Metaraces.Wereboar,
                RaceConstants.Metaraces.Wererat,
                RaceConstants.Metaraces.Weretiger,
                RaceConstants.Metaraces.Werewolf,
            };

            AbilitiesRandomizerTypes = new[]
            {
                AbilitiesRandomizerTypeConstants.Raw,
                AbilitiesRandomizerTypeConstants.Average,
                AbilitiesRandomizerTypeConstants.BestOfFour,
                AbilitiesRandomizerTypeConstants.Good,
                AbilitiesRandomizerTypeConstants.Heroic,
                AbilitiesRandomizerTypeConstants.OnesAsSixes,
                AbilitiesRandomizerTypeConstants.Poor,
                AbilitiesRandomizerTypeConstants.TwoTenSidedDice,
                RandomizerTypeConstants.Set
            };
        }
    }
}