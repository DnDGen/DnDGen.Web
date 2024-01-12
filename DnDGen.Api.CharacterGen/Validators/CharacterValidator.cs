﻿using DnDGen.Api.CharacterGen.Models;
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
        private static IEnumerable<string> Powers => new[] { PowerConstants.Mundane, PowerConstants.Minor, PowerConstants.Medium, PowerConstants.Major };

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

            spec.AlignmentRandomizerType = (string)request.Query["alignmentRandomizerType"] ?? AlignmentRandomizerTypeConstants.Any;
            spec.ClassNameRandomizerType = (string)request.Query["classNameRandomizerType"] ?? ClassNameRandomizerTypeConstants.AnyPlayer;
            spec.LevelRandomizerType = (string)request.Query["levelRandomizerType"] ?? LevelRandomizerTypeConstants.Any;
            spec.BaseRaceRandomizerType = (string)request.Query["baseRaceRandomizerType"] ?? RaceRandomizerTypeConstants.BaseRace.AnyBase;
            spec.MetaraceRandomizerType = (string)request.Query["metaraceRandomizerType"] ?? RaceRandomizerTypeConstants.Metarace.AnyMeta;
            spec.AbilitiesRandomizerType = (string)request.Query["abilitiesRandomizerType"] ?? AbilitiesRandomizerTypeConstants.Raw;

            spec.SetAlignment = (string)request.Query["setAlignment"];
            spec.SetClassName = (string)request.Query["setClassName"];
            spec.SetLevel = Convert.ToInt32(request.Query["setLevel"]);
            spec.SetBaseRace = (string)request.Query["setBaseRace"];
            spec.SetMetarace = (string)request.Query["setMetarace"];
            spec.ForceMetarace = Convert.ToBoolean(request.Query["forceMetarace"]);
            spec.SetStrength = Convert.ToInt32(request.Query["setStrength"]);
            spec.SetConstitution = Convert.ToInt32(request.Query["setConstitution"]);
            spec.SetDexterity = Convert.ToInt32(request.Query["setDexterity"]);
            spec.SetIntelligence = Convert.ToInt32(request.Query["setIntelligence"]);
            spec.SetWisdom = Convert.ToInt32(request.Query["setWisdom"]);
            spec.SetCharisma = Convert.ToInt32(request.Query["setCharisma"]);
            spec.AllowAbilityAdjustments = Convert.ToBoolean(request.Query["allowAbilityAdjustments"]);

            if (spec.AlignmentRandomizerType == RandomizerTypeConstants.Set && string.IsNullOrEmpty(spec.SetAlignment))
            {
                return (false, "Need to provide setAlignment", null);
            }

            //Validate that all things are entered as needed (if set alignment, there is a set alignment value, it's valid, etc.)

            var validatedPower = Powers.FirstOrDefault(p => p.ToLower() == power.ToLower());
            var valid = validatedPower != null;

            var validItemType = Enum.TryParse<ItemTypes>(itemType, true, out var validatedItemType);
            valid &= validItemType;

            if (!valid)
            {
                return (false, null, null, null);
            }

            var itemTypeDescription = EnumHelper.GetDescription(validatedItemType);
            valid &= Validate(itemTypeDescription, validatedPower);

            if (name == null)
            {
                return (valid, itemTypeDescription, validatedPower, null);
            }

            var items = GetItemNames(itemTypeDescription, validatedPower, name);
            var validatedName = items.FirstOrDefault(n => n.ToLower() == name.ToLower());
            valid &= validatedName != null;

            return (valid, itemTypeDescription, validatedPower, validatedName);
        }
    }
}
