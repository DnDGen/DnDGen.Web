using DnDGen.Api.CharacterGen.Models;
using DnDGen.CharacterGen.Randomizers.Abilities;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using DnDGen.TreasureGen.Items;
using DnDGen.TreasureGen.Items.Magical;
using DnDGen.TreasureGen.Items.Mundane;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DnDGen.Api.CharacterGen.Validators
{
    public static class CharacterValidator
    {
        private static IEnumerable<string> AlignmentRandomizers = new[]
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

        private static Dictionary<string, IEnumerable<string>> GetPowers()
        {
            var powers = new Dictionary<string, IEnumerable<string>>();
            powers[ItemTypeConstants.AlchemicalItem] = new[]
            {
                PowerConstants.Mundane
            };

            powers[ItemTypeConstants.Armor] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Potion] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Ring] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Rod] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Scroll] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Staff] = new[]
            {
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Tool] = new[]
            {
                PowerConstants.Mundane
            };

            powers[ItemTypeConstants.Wand] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.Weapon] = new[]
            {
                PowerConstants.Mundane,
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            powers[ItemTypeConstants.WondrousItem] = new[]
            {
                PowerConstants.Minor,
                PowerConstants.Medium,
                PowerConstants.Major
            };

            return powers;
        }

        private static bool Validate(string itemType, string power)
        {
            var powers = GetPowers();

            return powers.ContainsKey(itemType) && powers[itemType].Contains(power);
        }

        private static IEnumerable<string> GetItemNames(string itemType, string power, string name)
        {
            switch (itemType)
            {
                case ItemTypeConstants.AlchemicalItem: return AlchemicalItemConstants.GetAllAlchemicalItems();
                case ItemTypeConstants.Armor:
                    var specificArmors = ArmorConstants.GetAllSpecificArmorsAndShields();
                    if (specificArmors.Select(n => n.ToLower()).Contains(name.ToLower()) && power == PowerConstants.Mundane)
                        return Enumerable.Empty<string>();

                    return ArmorConstants.GetAllArmorsAndShields(true);
                case ItemTypeConstants.Potion: return PotionConstants.GetAllPotions(false);
                case ItemTypeConstants.Ring: return RingConstants.GetAllRings();
                case ItemTypeConstants.Rod: return RodConstants.GetAllRods();
                case ItemTypeConstants.Scroll: return new[] { name };
                case ItemTypeConstants.Staff: return StaffConstants.GetAllStaffs();
                case ItemTypeConstants.Tool: return ToolConstants.GetAllTools();
                case ItemTypeConstants.Wand: return new[] { name };
                case ItemTypeConstants.Weapon:
                    var specificWeapons = WeaponConstants.GetAllSpecific();
                    if (specificWeapons.Select(n => n.ToLower()).Contains(name.ToLower()) && power == PowerConstants.Mundane)
                        return Enumerable.Empty<string>();

                    return WeaponConstants.GetAllWeapons(true, false);
                case ItemTypeConstants.WondrousItem: return WondrousItemConstants.GetAllWondrousItems();
                default: return Enumerable.Empty<string>();
            }
        }

        public static (bool Valid, string Error, CharacterSpecifications CharacterSpecifications) GetValid(HttpRequest request)
        {
            //TODO: Get all the possible parameters from the request
            var spec = new CharacterSpecifications();

            var alignmentRandomizerType = (string)request.Query["alignmentRandomizerType"] ?? AlignmentRandomizerTypeConstants.Any;
            var classNameRandomizerType = (string)request.Query["classNameRandomizerType"] ?? ClassNameRandomizerTypeConstants.AnyPlayer;
            var levelRandomizerType = (string)request.Query["levelRandomizerType"] ?? LevelRandomizerTypeConstants.Any;
            var baseRaceRandomizerType = (string)request.Query["baseRaceRandomizerType"] ?? RaceRandomizerTypeConstants.BaseRace.AnyBase;
            var metaraceRandomizerType = (string)request.Query["metaraceRandomizerType"] ?? RaceRandomizerTypeConstants.Metarace.AnyMeta;
            var abilitiesRandomizerType = (string)request.Query["abilitiesRandomizerType"] ?? AbilitiesRandomizerTypeConstants.Raw;

            var setAlignment = (string)request.Query["setAlignment"];
            var setClassName = (string)request.Query["setClassName"];
            var setLevel = Convert.ToInt32(request.Query["setLevel"]);
            var setBaseRace = (string)request.Query["setBaseRace"];
            var setMetarace = (string)request.Query["setMetarace"];
            var forceMetarace = Convert.ToBoolean(request.Query["forceMetarace"]);
            var setStrength = Convert.ToInt32(request.Query["setStrength"]);
            var setConstitution = Convert.ToInt32(request.Query["setConstitution"]);
            var setDexterity = Convert.ToInt32(request.Query["setDexterity"]);
            var setIntelligence = Convert.ToInt32(request.Query["setIntelligence"]);
            var setWisdom = Convert.ToInt32(request.Query["setWisdom"]);
            var setCharisma = Convert.ToInt32(request.Query["setCharisma"]);
            var allowAbilityAdjustments = Convert.ToBoolean(request.Query["allowAbilityAdjustments"]);

            spec.SetAlignmentRandomizer(alignmentRandomizerType, setAlignment);
            spec.SetClassNameRandomizer(classNameRandomizerType, setClassName);
            spec.SetLevelRandomizer(levelRandomizerType, setLevel);
            spec.SetBaseRaceRandomizer(baseRaceRandomizerType, setBaseRace);
            spec.SetMetaraceRandomizer(metaraceRandomizerType, setMetarace, forceMetarace);
            spec.SetAbilitiesRandomizer(
                abilitiesRandomizerType,
                setStrength,
                setConstitution,
                setDexterity,
                setIntelligence,
                setWisdom,
                setCharisma,
                allowAbilityAdjustments);

            //var validatedPower = Powers.FirstOrDefault(p => p.ToLower() == power.ToLower());
            //var valid = validatedPower != null;

            //var validItemType = Enum.TryParse<ItemTypes>(itemType, true, out var validatedItemType);
            //valid &= validItemType;

            //if (!valid)
            //{
            //    return (false, null, null, null);
            //}

            //var itemTypeDescription = EnumHelper.GetDescription(validatedItemType);
            //valid &= Validate(itemTypeDescription, validatedPower);

            //if (name == null)
            //{
            //    return (valid, itemTypeDescription, validatedPower, null);
            //}

            //var items = GetItemNames(itemTypeDescription, validatedPower, name);
            //var validatedName = items.FirstOrDefault(n => n.ToLower() == name.ToLower());
            //valid &= validatedName != null;

            var result = spec.IsValid();
            return (result.Valid, result.Error, spec);
        }
    }
}
